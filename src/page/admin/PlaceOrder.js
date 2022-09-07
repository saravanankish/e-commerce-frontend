import {
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../config";
import getToken from "../../util/tokenGetter";
import { useSnackbar } from "notistack";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


const PlaceOrder = ({ type, edit }) => {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [userSelected, setUserSelected] = useState(null);
    const [paymentType, setPaymentType] = useState("CASH_ON_DELIVERY");
    const [productQty, setProductQty] = useState([{
        product: null,
        quantity: 1,
    }])

    useEffect(() => {
        fetchCustomers()
        fetchProducts()
        if (orderId) {
            fetchOrderDetails()
        }
    }, [orderId])


    const fetchOrderDetails = async () => {
        var token = await getToken();
        axios.get(`${backendUrl}/order/${orderId}`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                const order = res.data;
                setUserSelected(order.user);
                setProductQty([...order.products.map(ele => {
                    var temp = { ...ele.product };
                    delete ele.product;
                    ele.product = {};
                    ele.product.id = temp.productId;
                    ele.product.name = temp.name;
                    ele.product.quantity = temp.quantity;
                    return ele
                })])
                setPaymentType(order.paymentType)
            }
        }).catch(err => {
            console.log(err)
            if (err) {
                enqueueSnackbar(err?.response?.data?.message, { variant: "error" })
            }
        })
    }

    const fetchProducts = async () => {
        var token = await getToken();
        axios.get(`${backendUrl}/products/options`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setProducts(res.data);
            }
        }).catch(err => {
            if (err) {
                enqueueSnackbar(err.response.data.message, { variant: "error" });
            }
        })
    }

    const fetchCustomers = async () => {
        var token = await getToken();
        axios.get(`${backendUrl}/user/role/customer`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setCustomers(res.data.data);
            }
        }).catch(err => {
            if (err)
                enqueueSnackbar(err.response.data.message, { variant: "error" })
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            products: [
                ...productQty.map(ele => {
                    var temp = ele;
                    temp.product.productId = temp.product.id;
                    console.log(temp)
                    return temp;
                })
            ],
            paymentType
        }
        var token = await getToken();
        if (!edit)
            axios.post(`${backendUrl}/order/${userSelected.userId}`, data, { headers: { "Authorization": "Bearer " + token } }).then(res => {
                if (res.status === 201) {
                    enqueueSnackbar("Order placed successfully", { variant: "success" });
                    navigate("/admin/orders")
                }
            }).catch(err => {
                if (err) {
                    enqueueSnackbar(err.response.data.message, { variant: "error" });
                }
            })
        else
            axios.put(`${backendUrl}/order/${orderId}`, data, { headers: { "Authorization": "Bearer " + token } }).then(res => {
                if (res.status === 201) {
                    enqueueSnackbar("Order updated successfully", { variant: "success" });
                    navigate("/admin/orders")
                }
            }).catch(err => {
                if (err?.response?.data?.message) {
                    enqueueSnackbar(err.response.data.message, { variant: "error" });
                } else {
                    enqueueSnackbar(err.message, { variant: "error" });
                }
            })
    }

    return (
        <Container>
            <Typography variant="h4" color="primary" sx={{ textAlign: "center", pt: 3 }}>
                {type} Order
            </Typography>
            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        justifyContent: "center",
                        display: "flex",
                        marginTop: "30px",
                        marginBottom: "40px"
                    }}
                >
                    <Grid container spacing={2} style={{ maxWidth: "600px" }}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={customers}
                                required
                                getOptionLabel={option => (option.name + "  (" + option.username + ")")}
                                openOnFocus
                                value={userSelected}
                                onChange={(_, value) => {
                                    setUserSelected(value);
                                }}
                                renderInput={(params) => (
                                    <TextField required fullWidth {...params} label="Customer" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="demo-simple-select-label">Payment type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Payment type"
                                    required
                                    value={paymentType}
                                    onChange={e => setPaymentType(e.target.value)}
                                >
                                    <MenuItem value="CASH_ON_DELIVERY">Cash on delivery</MenuItem>
                                    <MenuItem value="CREDIT_CARD">Credit card</MenuItem>
                                    <MenuItem value="DEBIT_CARD">Debit card</MenuItem>
                                    <MenuItem value="UPI">UPI</MenuItem>
                                    <MenuItem value="EMI">EMI</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            productQty.map((prodQty, index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={products}
                                            required
                                            getOptionLabel={option => (option.name + "  (" + option.quantity + ")")}
                                            openOnFocus
                                            value={prodQty.product}
                                            onChange={(_, value) => {
                                                var temp = productQty;
                                                temp[index].product = value;
                                                setProductQty([...temp])
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    required
                                                    fullWidth
                                                    {...params}
                                                    label="Product"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={10} md={4.5}>
                                        <TextField
                                            label="Quantity"
                                            fullWidth
                                            onFocus={(e) => e.currentTarget.select()}
                                            required
                                            value={prodQty.quantity}
                                            onChange={(e) => {
                                                var temp = productQty;
                                                temp[index].quantity = e.target.value;
                                                setProductQty([...temp])
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2} md={1.5} style={{ display: "flex", alignItems: "center" }}>
                                        <Button
                                            disabled={productQty.length <= 1}
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                var temp = productQty;
                                                temp = temp.slice(0, index).concat(temp.slice(index + 1, temp.length))
                                                setProductQty([...temp])
                                            }}
                                        >
                                            <DeleteForeverIcon />
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            ))
                        }
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={() => setProductQty(prev => [...prev, { product: null, quantity: 1 }])}>Add Product</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth type="submit">{type} order</Button>
                        </Grid>
                    </Grid>
                </div>
            </form>
        </Container>
    )
}

export default PlaceOrder;