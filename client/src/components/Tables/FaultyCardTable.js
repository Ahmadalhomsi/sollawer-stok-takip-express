import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, TextField, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewFaultyCardModal from '../Modals/NewFaultyCardModal';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@mui/material';
import { mainButtonStyle, modalCloseButtonStyle } from '../styles';

const FaultyCardsTable = () => {
    const [rows, setRows] = useState([]);

    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState('');
    const [isURLDialogOpen, setURLDialogOpen] = useState(false);
    const [newPhotoFile, setNewPhotoFile] = useState(null);


    const [unidOptions, setUnidOptions] = useState([]);
    const [projectNoOptions, setProjectNoOptions] = useState([]);

    useEffect(() => {
        // Fetch UNID options
        axios.get('http://localhost:5000/api/controlCards')
            .then((response) => {
                setUnidOptions(response.data);
            })
            .catch((error) => {
                toast.error('Error fetching UNID options');
            });

        // Fetch Project NO options
        axios.get('http://localhost:5000/api/projects')
            .then((response) => {
                setProjectNoOptions(response.data);
            })
            .catch((error) => {
                toast.error('Error fetching Project NO options');
            });

        // Fetch Faulty Cards
        axios.get('http://localhost:5000/api/faultyCards')
            .then((response) => {
                setRows(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }, []);

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

    const handleURLDialogClose = () => {
        setURLDialogOpen(false);

        console.log(editRow);
        isReadyForSubmit = true;
        handleProcessRowUpdate(editRow);
        setNewPhotoFile(null);

    };

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
        try {
            axios.delete(`http://localhost:5000/api/faultyCards/${id}`);
        } catch (error) {
            console.log(error);
            toast.error('Error deleting row');
        }
        toast.success('Row deleted successfully!');
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

    const handleEdit = (params) => {
        setEditRow(rows.find((row) => row.id === params.id));
    };


    const handleEditURLs = (params) => {
        setURLDialogOpen(true);
        handleEdit(params)
    };


    let isReadyForSubmit = true;
    const handleProcessRowUpdate = async (newRow, oldRow) => {
        if (JSON.stringify(newRow) !== JSON.stringify(oldRow) && isReadyForSubmit) {
            try {
                const response = await axios.put(`http://localhost:5000/api/faultyCards/${newRow.id}`, newRow);
                if (response.status === 200) {
                    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
                    setRows(updatedRows);
                    toast.success('Row updated successfully!');
                    return newRow;
                } else {
                    toast.error('Failed to update row');
                    return oldRow;
                }
            } catch (error) {
                toast.error('There was an error updating the row!');
                return oldRow;
            }
        }
        return newRow;
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 100, editable: false },
        {
            field: 'UNID',
            headerName: 'UNID',
            width: 180,
            editable: true,
            renderEditCell: (params) => {
                const currentUNID = unidOptions.find(option => option.UNID === params.value) || {};
                return (
                    <Autocomplete
                        value={currentUNID}
                        onChange={(event, newValue) => {
                            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue.UNID });
                        }}
                        options={unidOptions}
                        getOptionLabel={(option) => option.UNID || ''}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Select UNID" />
                        )}
                        style={{ width: 200 }}
                    />
                );
            },
        },
        {
            field: 'servisDate',
            headerName: 'Servis Tarihi',
            width: 140,
            editable: true,
            renderCell: (params) => new Date(params.value).toLocaleString(),
            renderEditCell: (params) => (
                <TextField
                    style={{ width: 140 }}
                    fullWidth
                    type="datetime-local"
                    name="servisDate"
                    value={params.value ? new Date(params.value).toISOString().slice(0, 16) : ''}
                    onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            ),
        },
        { field: 'status', headerName: 'Durum', width: 110, editable: true },
        { field: 'fault', headerName: 'Arıza', width: 140, editable: true },
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
                            sx={{ display: 'block', cursor: 'pointer', color: '#CEAF03' }}
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
            field: 'projectNO',
            headerName: 'Proje NO',
            width: 180,
            editable: true,
            renderEditCell: (params) => {
                const currentProjectNO = projectNoOptions.find(option => option.projectNO === params.value) || {};
                return (
                    <Autocomplete
                        value={currentProjectNO}
                        onChange={(event, newValue) => {
                            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue.projectNO });
                        }}
                        options={projectNoOptions}
                        getOptionLabel={(option) => option.projectNO || ''}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Select Project NO" />
                        )}
                        style={{ width: 200 }}
                    />
                );
            },
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
            <Button
                onClick={handleModalOpen}
                variant="contained"
                sx={mainButtonStyle}
            >
                YENİ ARIZALI KART EKLE
            </Button>

            <NewFaultyCardModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />

            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
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
                        sx={[modalCloseButtonStyle, { marginBottom: '1rem' }]}
                    >
                        Choose Photo
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setNewPhotoFile(e.target.files[0])}
                            accept="image/*"
                        />
                    </Button>
                    <Button onClick={handleURLSubmit} variant="contained" color="primary"
                        sx={[mainButtonStyle, { marginLeft: '1rem', marginBottom: '1rem' }]}>
                        Upload
                    </Button>

                    <Typography variant="body2" color="textSecondary">
                        {newPhotoFile ? `Current Photo: ${newPhotoFile.name}` : 'No photo selected'}
                    </Typography>

                    <Box>
                        {editRow.photoURL && editRow.photoURL.map((url, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => handleClickOpen(`http://localhost:5000/uploads/${url}`)}
                                    sx={{
                                        color: '#e6c300'
                                    }}
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

export default FaultyCardsTable;
