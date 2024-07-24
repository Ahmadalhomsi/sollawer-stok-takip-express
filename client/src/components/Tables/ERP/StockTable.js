import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Link, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewStockModal from '../../Modals/ERP/NewStockModal';

const StockTable = () => {
    const [rows, setRows] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState('');
    const [isURLDialogOpen, setURLDialogOpen] = useState(false);
    const [newPhotoFile, setNewPhotoFile] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/erp/stocks')
            .then((response) => {
                setRows(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                console.error('There was an error fetching the data!', error);
                setLoading(false);
            });
    }, []);

    const handleEdit = (params) => {
        setEditIdx(params.id);
        setEditRow(rows.find((row) => row.id === params.id));
    };

    const handleSave = async () => {
        const dataToUpdate = { ...editRow };
        try {
            const response = await axios.put(`http://localhost:5000/api/erp/stocks/${editIdx}`, dataToUpdate);
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
            axios.delete(`http://localhost:5000/api/erp/stocks/${id}`);
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
        setNewPhotoFile(null);
    };

    const handleURLSubmit = async () => {
        if (newPhotoFile) {
            const formData = new FormData();
            formData.append('file', newPhotoFile);

            try {
                const response = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });


                const photoName = response.data.fileName;

                console.log("XXXXXXXXXX");
                console.log(photoName);

                const updatedPhotoURLs = [...editRow.photoURL, photoName];
                setEditRow((prev) => ({
                    ...prev,
                    photoURL: updatedPhotoURLs
                }));

                handleURLDialogClose();
                toast.success('Photo uploaded successfully!');
            } catch (error) {
                console.error('Error uploading photo:', error);
                toast.error('Error uploading photo');
            }
        }
    };

    const handleDeleteURL = async (urlToDelete) => {
        const updatedPhotoURLs = editRow.photoURL.filter((url) => url !== urlToDelete);
        setEditRow((prev) => ({
            ...prev,
            photoURL: updatedPhotoURLs
        }));


        try {
            await axios.delete('http://localhost:5000/deleteFile', {
                data: { filePath: urlToDelete }
            });
        } catch (err) {
            toast.error('Error deleting file');
        }


        toast.success('Photo deleted successfully!');
    };

    const handleEditURLs = () => {
        setURLDialogOpen(true);
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
            field: 'stockName', headerName: 'Parça Adı', width: 240, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="stockName"
                    value={editRow.stockName}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'stockType', headerName: 'Stok Tipi', width: 100, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="stockType"
                    value={editRow.stockType}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'quantity', headerName: 'Adet', width: 80, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    type="number"
                    name="quantity"
                    value={editRow.quantity}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'duration', headerName: 'Süre', width: 100, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="duration"
                    value={editRow.duration}
                    onChange={handleChange}
                />
            ) : params.value
        },
        // {
        //   field: 'requested', headerName: 'Talep Edilen', width: 100, renderCell: (params) => params.row.id === editIdx ? (
        //     <TextField
        //       type="number"
        //       name="requested"
        //       value={editRow.requested}
        //       onChange={handleChange}
        //     />
        //   ) : params.value
        // },
        {
            field: 'inStock', headerName: 'Stokta', width: 100, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    type="number"
                    name="inStock"
                    value={editRow.inStock}
                    onChange={handleChange}
                />
            ) : params.value
        },
        // {
        //   field: 'boxQuantity', headerName: 'Kutu Adet', width: 100, renderCell: (params) => params.row.id === editIdx ? (
        //     <TextField
        //       type="number"
        //       name="boxQuantity"
        //       value={editRow.boxQuantity}
        //       onChange={handleChange}
        //     />
        //   ) : params.value
        // },
        // {
        //   field: 'need', headerName: 'İhtiyaç', width: 100, renderCell: (params) => params.row.id === editIdx ? (
        //     <TextField
        //       type="number"
        //       name="need"
        //       value={editRow.need}
        //       onChange={handleChange}
        //     />
        //   ) : params.value
        // },
        {
            field: 'cost', headerName: 'Maliyet', width: 100, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    type="number"
                    name="cost"
                    value={editRow.cost}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'deliveryDate', headerName: 'Teslim Süresi', width: 120, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="deliveryDate"
                    value={editRow.deliveryDate}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'company', headerName: 'Firma', width: 140, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="company"
                    value={editRow.company}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'description', headerName: 'Açıklama', width: 180, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="description"
                    value={editRow.description}
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
                        <Button onClick={handleEditURLs} variant="contained" color="primary" size="small">
                            Edit Photo URLs
                        </Button>
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
        }
    ];

    return (
        <div>
            <Box m={2}>
                <Button onClick={handleModalOpen} variant="contained" color="primary">
                    YENİ ARIZALI KART EKLE
                </Button>
            </Box>

            <NewStockModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />

            <Box m={2} style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Photo Preview</DialogTitle>
                <DialogContent>
                    <img src={selectedPhoto} alt="Preview" style={{ width: '100%' }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isURLDialogOpen} onClose={handleURLDialogClose}>
                <DialogTitle>Edit Photo URLs</DialogTitle>
                <DialogContent>

                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        style={{ marginBottom: '1rem' }}
                    >
                        Choose Photo
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setNewPhotoFile(e.target.files[0])}
                            accept="image/*"
                        />
                    </Button>
                    <Button onClick={handleURLSubmit} variant="contained" color="primary" style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                        Upload
                    </Button>

                    <Box>
                        {editRow.photoURL && editRow.photoURL.map((url, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => handleClickOpen(`http://localhost:5000/uploads/${url}`)}
                                    sx={{ display: 'block', cursor: 'pointer', marginRight: 2 }}
                                >
                                    {url}
                                </Link>
                                <IconButton onClick={() => handleDeleteURL(url)} color="error" size="small">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleURLDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StockTable;
