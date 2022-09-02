import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TextField } from '@mui/material';
import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import getToken from "../util/tokenGetter";
import { useSnackbar } from "notistack";
import { backendUrl } from "../config";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const AddCategoryDialog = ({ open, setOpen, edit, data, setRefresh, setData }) => {
    const [name, setName] = useState("")
    const [id, setId] = useState(-1);
    const [subcategories, setSubcategories] = useState([""])
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = (e, t) => {
        if (t !== "backdropClick" && t !== "escapeKeyDown")
            setOpen(false);
    };

    useEffect(() => {
        if (edit) {
            setId(data.id)
            setName(data.name)
        }
        // eslint-disable-next-line 
    }, [edit])

    const handleSubmit = async (e) => {
        e.preventDefault();
        var token = await getToken();
        if (!edit) {
            axios.post(`${backendUrl}/category`, { name, subCategory: [...subcategories] }, { headers: { "Authorization": "Bearer " + token } }).then(res => {
                if (res.status === 201) {
                    enqueueSnackbar("Added category successfully", { variant: "success" });
                    setOpen(false);
                    if (setRefresh)
                        setRefresh(prev => !prev)
                }
            }).catch(err => {
                enqueueSnackbar(err.response.data.message, { variant: "error" })
            })
        } else {
            axios.put(`${backendUrl}/category/${id}`, { id, name, subCategory: [...subcategories] }, { headers: { "Authorization": "Bearer " + token } }).then(res => {
                if (res.status === 201) {
                    enqueueSnackbar("Updated category successfully", { variant: "success" });
                    setOpen(false);
                    setData({})
                    if (setRefresh)
                        setRefresh(prev => !prev)
                }
            }).catch(err => {
                console.log(err)
                enqueueSnackbar(err.response.data.message, { variant: "error" })
            })
        }
    }

    return (
        <BootstrapDialog
            fullWidth
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <form onSubmit={handleSubmit}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Category
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Category Name"
                        required
                        sx={{ mb: 1 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Grid container spacing={1}>
                        {
                            subcategories.map((_, index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={10.5}>
                                        <TextField
                                            sx={{ mb: 1 }}
                                            fullWidth
                                            label="Subcategory"
                                            required
                                            value={subcategories[index]}
                                            onChange={(e) => {
                                                var temp = subcategories;
                                                temp[index] = e.target.value;
                                                setSubcategories([...temp])
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1} style={{ display: "flex", alignItems: "center" }}>
                                        <Button
                                            color="error"
                                            onClick={() => {
                                                var temp = subcategories
                                                temp = temp.filter((v, ind) => index !== ind);
                                                setSubcategories([...temp])
                                            }}
                                        >
                                            <DeleteForeverIcon />
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            ))
                        }
                    </Grid>
                    <Button
                        sx={{ mt: 1 }}
                        variant='contained'
                        onClick={() => {
                            setSubcategories(prev => [...prev, ""])
                        }}
                    >
                        Add subcategory
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" autoFocus type="submit">
                        {edit ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </form>
        </BootstrapDialog>
    );
}

export default AddCategoryDialog;