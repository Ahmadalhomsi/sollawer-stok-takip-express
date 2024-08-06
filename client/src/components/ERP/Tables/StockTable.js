import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Link, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewStockModal from '../Modals/NewStockModal';

const StockTable = () => {
    const [rows, setRows] = useState([]);
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
                console.log('There was an error fetching the data!', error);
                setLoading(false);
            });
    }, []);

    const handleEdit = (params) => {
        setEditRow(rows.find((row) => row.id === params.id));
    };


    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
        try {
            axios.delete(`http://localhost:5000/api/erp/stocks/${id}`);
        } catch (error) {
            console.log(error);
            toast.error('Error deleting row')
        }
        toast.success('Row deleted successfully!');
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

    let isReadyForSubmit = true;
    const handleURLDialogClose = () => {
        setURLDialogOpen(false);

        console.log(editRow);
        isReadyForSubmit = true;
        handleProcessRowUpdate(editRow);
        setNewPhotoFile(null);

    };

    const handleProcessRowUpdate = async (newRow, oldRow) => {
        if (JSON.stringify(newRow) !== JSON.stringify(oldRow) && isReadyForSubmit) {
            try {
                const response = await axios.put(`http://localhost:5000/api/erp/stocks/${newRow.id}`, newRow);
                if (response.status === 200) {
                    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
                    setRows(updatedRows);
                    toast.success('Row updated successfully!');
                    return newRow;
                } else {
                    console.log(`Failed to update row: ${response.statusText}`);
                    toast.error('Failed to update row');
                    return oldRow;
                }
            } catch (error) {
                console.log('There was an error creating the new row!', error);
                if (error.response && error.response.data && error.response.data.error) {
                    // Check for specific foreign key constraint error
                    if (error.response.data.error.includes('Foreign key constraint violation')) {
                        toast.error('Foreign key constraint violation: the referenced key does not exist.');
                    } else {
                        toast.error(error.response.data.error);
                    }
                } else {
                    toast.error('There was an error creating the new row!');
                }
            }
            return oldRow;
        }
        return oldRow;
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

                console.log("VVVVVVVVVV");
                console.log(photoName);

                const updatedPhotoURLs = [...editRow.photoURL, photoName];
                setEditRow((prev) => ({
                    ...prev,
                    photoURL: updatedPhotoURLs
                }));


                toast.success('Photo uploaded successfully!');
            } catch (error) {
                console.log('Error uploading photo:', error);
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

    const handleEditURLs = (params) => {
        setURLDialogOpen(true);
        handleEdit(params)
    };



    const columns = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },
        { field: 'stockName', headerName: 'Parça Adı', width: 240, editable: true },
        { field: 'stockType', headerName: 'Stok Tipi', width: 100, editable: true },
        { field: 'quantity', headerName: 'Adet', width: 80, editable: true, type: 'number' },
        { field: 'duration', headerName: 'Süre', width: 100, editable: true },
        { field: 'cost', headerName: 'Maliyet', width: 100, editable: true, type: 'number' },
        { field: 'company', headerName: 'Firma', width: 140, editable: true },
        { field: 'description', headerName: 'Açıklama', width: 180, editable: true },
        {
            field: 'photoURL',
            headerName: 'Photo URL',
            width: 300,
            editable: true,
            renderCell: (params) => (
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
            ),
            renderEditCell: (params) => (
                <>
                    <Box style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 80,
                    }}>
                        {params.value}
                        {isReadyForSubmit = false}
                        {handleEditURLs(params)}
                    </Box>
                </>
            ),
        },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 164,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleDelete(params.id)} color="error" size="small">
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
            // renderEditCell: (params) => (
            //     <Button onClick={() => handleEditURLs(params)} variant="contained" size="small" style={{ marginRight: 8 }}>
            //         Edit Photo URL
            //     </Button>
            // )
        },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
                YENİ STOK EKLE
            </Button>

            <NewStockModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />

            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                // checkboxSelection
                disableSelectionOnClick
                loading={loading}
                getRowId={(row) => row.id}
                processRowUpdate={handleProcessRowUpdate}

            />

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
        </Box>
    );
};

export default StockTable;
