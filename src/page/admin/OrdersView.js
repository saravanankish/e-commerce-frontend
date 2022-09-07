import {
    Container,
    TableContainer,
    TableCell,
    TableRow,
    TableBody,
    TableHead,
    Table,
    Button,
    Typography,
    TextField,
    InputAdornment,
    TablePagination,
    MenuItem,
    IconButton,
    FormControl,
    Select,
    InputLabel,
    Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import getToken from "../../util/tokenGetter";
import axios from "axios";
import { backendUrl } from "../../config";
import format from "date-fns/format";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";


const headerTitles = [
    {
        status: "ALL",
        headers: [
            {
                id: "orderStatus",
                name: "Order Status"
            }
        ]
    },
    {
        status: "PLACED",
        headers: [
            {
                id: "expected-delivery",
                name: "Excepted delivery"
            }
        ]
    },
    {
        status: "CANCELED",
        headers: [
            {
                id: "cancel-date",
                name: "Cancel date"
            },
            {
                id: "cancel-reason",
                name: "Cancel reason"
            }
        ]
    },
    {
        status: "DELIVERED",
        headers: [
            {
                id: "delivery-date",
                name: "Delivery date",
            },
        ]
    },
]

const OrdersView = () => {
    const role = useSelector(state => state.login.role);
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [totalOrders, setTotalOrders] = useState(1);
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [orderStatus, setOrderStatus] = useState("ALL")

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line
    }, [search, refresh, orderStatus])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchCategories = async () => {
        var token = await getToken();
        var url = `${backendUrl}/order/all?search=${search}`;
        if (orderStatus !== "ALL") url += `&orderStatus=${orderStatus}`;
        axios.get(url, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setTotalOrders(res.data.length)
                setOrders(res.data);
            }
        }).catch(err => {
            if (err) {
                enqueueSnackbar(err.response.data.message, { variant: "error" });
            }
        })
    }

    const cancelOrder = async (id) => {
        var token = await getToken();
        axios.post(`${backendUrl}/order/cancel/${id}`, "Cancelled by admin", { headers: { "Authorization": "Bearer " + token, "Content-Type": "text/plain" } }).then(res => {
            if (res.status === 201) {
                setRefresh(prev => !prev)
                enqueueSnackbar("Cancelled order successfully", { variant: "success" });
            }
        }).catch(err => {
            if (err) {
                enqueueSnackbar(err.response.data.message, { variant: "error" })
            }
        })
    }

    return (
        <Container sx={{ mt: 1, mx: 3, mb: 3 }} >
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px" }}>
                <Typography variant="h4" color="primary">Orders</Typography>
                {
                    role === "ADMIN" &&
                    <Button variant="contained" onClick={() => { navigate("/admin/add/order") }}>Place Order</Button>
                }
            </div>
            <Grid container spacing={1} style={{ marginTop: 3 }}>
                <Grid item md={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Order status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Order status"
                            value={orderStatus}
                            onChange={e => setOrderStatus(e.target.value)}
                        >
                            <MenuItem value="ALL">ALL</MenuItem>
                            <MenuItem value="PLACED">Placed</MenuItem>
                            <MenuItem value="PENDING_PAYMENT">Payment pending</MenuItem>
                            <MenuItem value="CANCELED">Cancelled</MenuItem>
                            <MenuItem value="RETURNED">Returned</MenuItem>
                            <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
                            <MenuItem value="OUT_FOR_DELIVERY">Out for delivery</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={10}>
                    <TextField
                        fullWidth
                        label="Search order by username"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
            <TableContainer
                style={{
                    border: "1px solid #c9c3ad",
                    borderRadius: "5px",
                    backgroundColor: "white",
                    marginTop: "5px"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Order ID</TableCell>
                            <TableCell align="center">User</TableCell>
                            <TableCell align="center">Order value</TableCell>
                            <TableCell align="center">Order date</TableCell>
                            {
                                headerTitles.filter(header => header.status === orderStatus).length > 0 &&
                                headerTitles.filter(header => header.status === orderStatus)[0].headers.map(header => (
                                    <TableCell align="center" key={header.id}>{header.name}</TableCell>
                                ))
                            }
                            <TableCell align="center">Modified date</TableCell>
                            {
                                (role === "ADMIN" && orderStatus !== "CANCELED") &&
                                < TableCell align="center">Actions</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                                <TableRow hover key={order.orderId}>
                                    <TableCell align="center">{order.orderId}</TableCell>
                                    <TableCell align="center">{order.user.username}</TableCell>
                                    <TableCell align="center">{order.totalValue}</TableCell>
                                    <TableCell align="center">{format(new Date(order.orderDate), "dd MMM yyyy")}</TableCell>
                                    {
                                        orderStatus === "ALL" &&
                                        <TableCell align="center">{order.orderStatus}</TableCell>
                                    }
                                    {
                                        orderStatus === "PLACED" &&
                                        <TableCell align="center">{format(new Date(order.expectedDeliveryDate), "dd MMM yyyy")}</TableCell>
                                    }
                                    {
                                        orderStatus === "DELIVERED" &&
                                        <TableCell align="center">{format(new Date(order.deliveryDate), "dd MMM yyyy")}</TableCell>
                                    }
                                    {
                                        orderStatus === "CANCELED" &&
                                        <>
                                            <TableCell align="center">{format(new Date(order.cancelDate), "dd MMM yyyy")}</TableCell>
                                            <TableCell align="center">{order.cancelReason}</TableCell>
                                        </>
                                    }
                                    <TableCell align="center">{format(new Date(order.modifiedDate), 'dd MMM yyyy')}</TableCell>
                                    {
                                        role === "ADMIN" &&
                                        <TableCell align="center">
                                            {
                                                (order.orderStatus === "PENDING_PAYMENT" || order.orderStatus === "PLACED") &&
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        navigate("/admin/edit/order/" + order.orderId)
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            }
                                            {
                                                (orderStatus === "PLACED" || orderStatus === 'PENDING_PAYMENT') &&
                                                <IconButton
                                                    color="error"
                                                    onClick={() => cancelOrder(order.orderId)}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            }
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    className="tableContainer"
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalOrders}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Container >
    )
}

export default OrdersView;