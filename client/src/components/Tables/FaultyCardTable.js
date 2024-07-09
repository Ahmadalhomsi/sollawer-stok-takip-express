import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Link, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from "react-hot-toast";
import NewFaultyCardModal from '../Modals/NewFaultyCardModal';

const FaultyCardsTable = () => {
    const [rows, setRows] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState('');
    const [isURLDialogOpen, setURLDialogOpen] = useState(false);
    const [newPhotoURL, setNewPhotoURL] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/faultyCards')
            .then((response) => {
                setRows(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message)
                console.error('There was an error fetching the data!', error);
                setLoading(false);
            });
    }, []);

    const handleEdit = (params) => {
        setEditIdx(params.id);
        setEditRow(rows.find((row) => row.id === params.id));
    };

    const handleSave = async () => {
        const dataToUpdate = {
            ...editRow,
        };

        try {
            const response = await axios.put(`http://localhost:5000/api/faultyCards/${editIdx}`, dataToUpdate);

            if (response.status === 200) {
                const updatedRows = rows.map((row) => (row.id === editIdx ? dataToUpdate : row));
                setRows(updatedRows);
                setEditIdx(-1);
            } else {
                console.error(`Failed to update row: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating row:', error);
        }
    };

    const handleCancel = () => {
        setEditIdx(-1);
    };

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
        try {
            axios.delete(`http://localhost:5000/api/faultyCards/${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleRowCreated = (newRow) => {
        setRows((prevRows) => [...prevRows, newRow]);
    };

    const handleClickOpen = (url) => {
        setSelectedPhoto(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPhoto('');
    };

    const handleAddURL = () => {
        setURLDialogOpen(true);
    };

    const handleURLDialogClose = () => {
        setURLDialogOpen(false);
        setNewPhotoURL('');
    };

    const handleURLSubmit = () => {
        if (newPhotoURL) {
            const updatedPhotoURLs = [...editRow.photoURL, newPhotoURL];
            setEditRow((prev) => ({
                ...prev,
                photoURL: updatedPhotoURLs
            }));
            handleURLDialogClose();
        }
    };

    const columns = [
        {
            field: 'id', headerName: 'ID', width: 10, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="id"
                    value={editRow.id}
                    disabled
                />
            ) : params.value
        },
        {
            field: 'cardID', headerName: 'Kart ID', width: 120, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="cardID"
                    value={editRow.cardID}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'servisDate',
            headerName: 'Servis Tarih',
            width: 140,
            renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    fullWidth
                    type="datetime-local"
                    name="servisDate"
                    value={new Date(editRow.servisDate).toISOString().slice(0, 16)}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            ) : new Date(params.value).toLocaleString()
        },
        {
            field: 'status', headerName: 'Durum', width: 110, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="status"
                    value={editRow.status}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'fault', headerName: 'Arıza', width: 140, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="fault"
                    value={editRow.fault}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'photoURL',
            headerName: 'Photo URL',
            width: 300,
            renderCell: (params) => params.row.id === editIdx ? (
                <>
                    <Box>
                        {editRow.photoURL.map((url, index) => (
                            <Link
                                key={index}
                                component="button"
                                variant="body2"
                                onClick={() => handleClickOpen(`http://localhost:5000/uploads/${url}`)}
                                sx={{ display: 'block', cursor: 'pointer' }}
                            >
                                {url}
                            </Link>
                        ))}
                    </Box>
                </>
            ) : (
                <Box>
                    {params.value.map((url, index) => (
                        <Link
                            key={index}
                            component="button"
                            variant="body2"
                            onClick={() => handleClickOpen(`http://localhost:5000/uploads/${url}`)}
                            sx={{ display: 'block', cursor: 'pointer' }}
                        >
                            {url}
                        </Link>
                    ))}
                </Box>
            )
        },
        {
            field: 'projectNO', headerName: 'Proje NO', width: 120, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="projectNO"
                    value={editRow.projectNO}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 164,
            renderCell: (params) => (
                params.row.id === editIdx ? (
                    <>
                        <Button onClick={handleSave} variant="contained" color="primary" size="small" style={{ marginRight: 8 }}>
                            Save
                        </Button>
                        <Button onClick={handleCancel} variant="contained" color="secondary" size="small">
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => handleEdit(params)} variant="contained" size="small" style={{ marginRight: 8 }}>
                            Edit
                        </Button>
                        <IconButton onClick={() => handleDelete(params.id)} color="error" size="small">
                            <DeleteIcon />
                        </IconButton>
                    </>
                )
            )
        },
        {
            field: 'addURL',
            headerName: 'PhotoURL',
            width: 300,
            renderCell: (params) => params.row.id === editIdx ? (
                <>
                    
                    <Button onClick={handleAddURL} variant="contained" color="primary" size="small" style={{ marginRight: 8 }}>
                        Add Photo URL
                    </Button>
                </>
            ) : null
        },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
                Yeni Arızalı Kart Ekle
            </Button>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                loading={loading}
                getRowId={(row) => row.id}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Photo</DialogTitle>
                <DialogContent>
                    {selectedPhoto && (
                        <img src={selectedPhoto} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isURLDialogOpen} onClose={handleURLDialogClose}>
                <DialogTitle>Add Photo URL</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Photo URL"
                        type="url"
                        fullWidth
                        value={newPhotoURL}
                        onChange={(e) => setNewPhotoURL(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleURLDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleURLSubmit} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <NewFaultyCardModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />
        </Box>
    );
};

export default FaultyCardsTable;
