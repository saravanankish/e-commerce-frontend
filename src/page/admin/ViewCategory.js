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
    IconButton
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import getToken from "../../util/tokenGetter";
import axios from "axios";
import { backendUrl } from "../../config";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCategoryDialog from "../../component/AddCategoryDialog";

const ViewCategory = () => {

    const role = useSelector(state => state.login.role);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [totalCategories, setTotalCategories] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [openAddCategory, setOpenAddCategory] = useState(false);
    const [editData, setEditData] = useState({});
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line
    }, [search, refresh])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchCategories = async () => {
        var token = await getToken();
        axios.get(`${backendUrl}/category/all?search=${search}`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 200) {
                setTotalCategories(res.data.length)
                setCategories(res.data);
            }
        }).catch(err => {
            if (err)
                enqueueSnackbar(err.response.data.message, { variant: "error" });
        })
    }

    const deleteCategory = async (id) => {
        var token = await getToken();
        axios.delete(`${backendUrl}/category/${id}`, { headers: { "Authorization": "Bearer " + token } }).then(res => {
            if (res.status === 201) {
                setRefresh(prev => !prev)
                enqueueSnackbar("Deleted category successfully", { variant: "success" });
            }
        }).catch(err => {
            if (err)
                enqueueSnackbar(err.response.data.message, { variant: "error" })
        })
    }

    return (
        <Container sx={{ mt: 1, mx: 3, mb: 3 }} >
            <AddCategoryDialog
                open={openAddCategory}
                setOpen={setOpenAddCategory}
                edit={editData?.id}
                data={editData}
                setData={setEditData}
                setRefresh={setRefresh}
            />
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px" }}>
                <Typography variant="h4" color="primary">Categories</Typography>
                {
                    role === "ADMIN" &&
                    <Button variant="contained" onClick={() => setOpenAddCategory(true)}>Add Category</Button>
                }
            </div>
            <TextField
                sx={{ mt: 1 }}
                fullWidth
                label="Search Category"
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
                            <TableCell align="center">Category ID</TableCell>
                            <TableCell align="center">Category Name</TableCell>
                            <TableCell align="center">Subcategories</TableCell>
                            {
                                role === "ADMIN" &&
                                <TableCell align="center">Actions</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(category => (
                                <TableRow hover key={category.id}>
                                    <TableCell align="center">{category.id}</TableCell>
                                    <TableCell align="center">{category.name}</TableCell>
                                    <TableCell align="center" onMouseEnter={(e) => {
                                        if (e.currentTarget.children.length > 1)
                                            e.currentTarget.children[1].style.display = "block"
                                    }} onMouseLeave={(e) => {
                                        if (e.currentTarget.children.length > 1)
                                            e.currentTarget.children[1].style.display = "none"
                                    }}>
                                        {
                                            category.subCategory.length > 0 &&
                                            <>
                                                <VisibilityIcon color="info" />
                                                <div
                                                    elevation={2}
                                                    className="sub-category"
                                                    style={{
                                                        borderRadius: "5px",
                                                        display: "none",
                                                        position: "absolute",
                                                        background: "white",
                                                        padding: "5px 10px",
                                                        zIndex: 999,
                                                        maxHeight: "200px",
                                                        overflowY: "auto",
                                                        boxShadow: "5px 5px 10px -2px rgba(0, 0, 0, 0.75)"
                                                    }}
                                                >
                                                    {
                                                        category.subCategory.map((subCategory, index) => (
                                                            <MenuItem disableTouchRipple key={category.id + "-" + index}>{subCategory}</MenuItem>
                                                        ))
                                                    }
                                                </div>
                                            </>
                                        }
                                    </TableCell>
                                    {
                                        role === "ADMIN" &&
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setEditData(category);
                                                    setOpenAddCategory(true);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => deleteCategory(category.id)}
                                            >
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
                    count={totalCategories}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Container >
    )
}

export default ViewCategory;