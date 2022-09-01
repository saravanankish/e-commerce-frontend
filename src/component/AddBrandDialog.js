import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TextField } from '@mui/material';
import axios from "axios";
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

const AddBrandDialog = ({ open, setOpen, edit, data, setRefresh, setData }) => {

    const [name, setName] = useState("")
    const [id, setId] = useState(-1)
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
    }, [edit])

    const handleSubmit = async (e) => {
        e.preventDefault();
        var token = await getToken();
        if (!edit) {
            axios.post(`${backendUrl}/brand`, { name }, { headers: { "Authorization": "Bearer " + token } }).then(res => {
                if (res.status === 201) {
                    enqueueSnackbar("Added brand successfully", { variant: "success" });
                    setOpen(false);
                    if (setRefresh)
                        setRefresh(prev => !prev)
                }
            }).catch(err => {
                enqueueSnackbar(err.response.data.message, { variant: "error" })
            })
        } else {
            axios.put(`${backendUrl}/brand/${id}`, { id, name }, { headers: { "Authorization": "Bearer " + token } }).then(res => {
                if (res.status == 201) {
                    enqueueSnackbar("Updated brand successfully", { variant: "success" });
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
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <form style={{ minWidth: "300px" }} onSubmit={handleSubmit}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Brand
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Brand Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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

export default AddBrandDialog;