import {
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { validateEmail, validatePassword, validateUsername } from "../../util/validations";
import axios from "axios";
import { backendUrl } from "../../config";
import getToken from "../../util/tokenGetter";
import { useSnackbar } from "notistack";


const PlaceOrder = ({ type }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productQtyMapper, setProductQtyMapper] = useState([]);



    const fetchProducts = async () => {
        var token = await getToken();
        axios.get(`${backendUrl}/product/options`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setProducts(res.data);
            }
        }).catch(err => {
            if (err) {
                enqueueSnackbar(err.response.data.message, { variant: "error" });
            }
        })
    }

    const fetchBrands = async () => {
        var token = await getToken();
        axios.get(`${backendUrl}/user/options`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setCustomers(res.data);
            }
        }).catch(err => {
            if (err)
                enqueueSnackbar(err.response.data.message, { variant: "error" })
        })
    }


    const handleSubmit = () => {

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

                    </Grid>
                </div>
            </form>
        </Container>
    )
}

export default PlaceOrder;