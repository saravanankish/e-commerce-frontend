import {
    Container,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Table,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    IconButton,
    TablePagination,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Grid,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import getToken from "../../util/tokenGetter";
import { backendUrl } from "../../config";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import format from "date-fns/format";

const ViewCustomer = () => {

    const role = useSelector(state => state.login.role);
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [totalCustomers, setTotalCustomers] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [field, setField] = useState("name");
    const [search, setSearch] = useState("");

    useEffect(() => {
        getCustomers();
        // eslint-disable-next-line 
    }, [page, rowsPerPage, search, field])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getCustomers = async () => {
        var token = await getToken();
        var url = `${backendUrl}/user/role/customer?limit=${rowsPerPage}&page=${page}`;
        if (search !== "") {
            url += `&field=${field}&search=${search}`;
        }
        axios.get(url, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setTotalCustomers(res.data.total);
                setCustomers(res.data.data);
            }
        })
    }

    const deleteCustomer = async (id) => {
        var token = await getToken()
        axios.delete(`${backendUrl}/user/${id}`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 204) {
                enqueueSnackbar("Deleted customer", { variant: "success" })
            }
        })
    }

    return (
        <Container style={{ minHeight: "76vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px" }}>
                <Typography variant="h4" color="primary">Customers</Typography>
                {
                    role === "ADMIN" &&
                    <Button variant="contained" onClick={() => navigate("/admin/add/customer")}>Add Customer</Button>
                }
            </div>
            <Grid container spacing={1} style={{ marginTop: 3 }}>
                <Grid item md={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Field</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Field"
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                        >
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="username">Username</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={10}>
                    <TextField
                        fullWidth
                        label="Search Customer"
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
            <TableContainer style={{ border: "1px solid #c9c3ad", borderRadius: "5px", marginTop: "5px", marginBottom: "20px", backgroundColor: "white" }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">User since</TableCell>
                            {
                                role === 'ADMIN' &&
                                <TableCell align="center">Action</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            customers.map((customer, index) => (
                                <TableRow key={index} hover>
                                    <TableCell align="center">{customer.userId}</TableCell>
                                    <TableCell align="center">{customer.name || "-"}</TableCell>
                                    <TableCell align="center">{customer.username}</TableCell>
                                    <TableCell align="center">{customer.email || "-"}</TableCell>
                                    <TableCell align="center">{format(new Date(customer.creationTime), "dd MMM yyyy")} </TableCell>
                                    {
                                        role === "ADMIN" &&
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => navigate("/admin/edit/customer/" + customer.userId)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => deleteCustomer(customer.userId)}>
                                                <DeleteForeverIcon />
                                            </IconButton>
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
                    count={totalCustomers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Container >
    )
}

export default ViewCustomer;