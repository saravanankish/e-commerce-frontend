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
import AddBrandDialog from "../../component/AddBrandDialog";
import { format } from "date-fns";

const ViewBrand = () => {

    const role = useSelector(state => state.login.role);
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [totalBrands, setTotalBrands] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [openAddBrand, setOpenAddBrand] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        fetchBrand();
    }, [search, refresh])

    const fetchBrand = async () => {
        var token = await getToken();
        axios.get(`${backendUrl}/brand?search=${search}`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setTotalBrands(res.data.length)
                setBrands(res.data);
            }
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const deleteBrand = async (id) => {
        var token = await getToken();
        axios.delete(`${backendUrl}/brand/${id}`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 204) {
                setRefresh(true);
                enqueueSnackbar("Deleted brand successfully", { variant: "success" });
            }
        }).catch(err => {
            if (err)
                enqueueSnackbar(err.response.data.message, { variant: "error" });
        })
    }

    return (
        <Container style={{ minHeight: "76vh" }}>
            <AddBrandDialog open={openAddBrand} setOpen={setOpenAddBrand} setRefresh={setRefresh} data={editData} setData={setEditData} edit={editData?.id} />
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px" }}>
                <Typography variant="h4" color="primary">Brands</Typography>
                {
                    role === "ADMIN" &&
                    <Button variant="contained" onClick={() => setOpenAddBrand(true)}>Add Brand</Button>
                }
            </div>
            <TextField
                sx={{ mt: 1 }}
                fullWidth
                label="Search Brand"
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
            <TableContainer style={{ border: "1px solid #c9c3ad", borderRadius: "5px", marginTop: "5px", marginBottom: "20px", backgroundColor: "white" }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Created Date</TableCell>
                            <TableCell align="center">Modified Date</TableCell>
                            <TableCell align="center">Modified By</TableCell>
                            {
                                role === 'ADMIN' &&
                                <TableCell align="center">Action</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            brands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((brand, index) => (
                                <TableRow key={brand.id} hover>
                                    <TableCell align="center">{brand.id}</TableCell>
                                    <TableCell align="center">{brand.name}</TableCell>
                                    <TableCell align="center">{(brand?.creationDate ? format(new Date(brand.creationDate), "dd MMM yyyy") : null) || "-"}</TableCell>
                                    <TableCell align="center">{(brand?.modifiedDate ? format(new Date(brand.modifiedDate), "dd MMM yyyy") : null) || "-"}</TableCell>
                                    <TableCell align="center">{brand.modifiedBy.username || "-"}</TableCell>
                                    {
                                        role === "ADMIN" &&
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => {
                                                setEditData(brand)
                                                setOpenAddBrand(true);
                                            }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => deleteBrand(brand.id)}>
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
                    count={totalBrands}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Container >
    )
}

export default ViewBrand;