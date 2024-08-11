import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { autocompleteStyle, mainButtonStyle, modalCloseButtonStyle, ModalNewFieldStyle } from '../../styles';

const NewStockMovementModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        stockName: '',
        movementType: '',
        quantity: 0,
        requested: 0,
        movement: '',
        boxQuantity: 0,
        need: 0,
        date: '',
        description: '',
    });

    const [stockOptions, setStockOptions] = useState([]);

    useEffect(() => {
        // Fetch stock names for the autocomplete options
        axios.get('http://localhost:5000/api/erp/stocks')
            .then((response) => {
                setStockOptions(response.data.map(stock => stock.stockName));
            })
            .catch((error) => {
                toast.error('Error fetching stock names!');
                console.log('There was an error fetching stock names!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleStockNameChange = (event, newValue) => {
        setNewRow((prev) => ({
            ...prev,
            stockName: newValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Created Row:");
        console.log(newRow);

        // Send the new row data to the backend
        axios.post('http://localhost:5000/api/erp/stockMovements', newRow)
            .then((response) => {
                onRowCreated(response.data); // Update the table with the new row
                onClose(); // Close the modal
            })
            .catch((error) => {
                console.log('There was an error creating the new row!', error);
                if (error.response && error.response.data && error.response.data.error) {
                    if (error.response.data.error.includes('Foreign key constraint violation')) {
                        toast.error('Foreign key constraint violation: the referenced key does not exist.');
                    } else {
                        toast.error(error.response.data.error);
                    }
                } else {
                    toast.error('There was an error creating the new row!');
                }
            });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflow: 'auto',
                maxHeight: 'calc(100vh - 100px)',
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    Yeni Stok Hareketi Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Autocomplete
                        fullWidth
                        margin="normal"
                        options={stockOptions}
                        value={newRow.stockName}
                        onChange={handleStockNameChange}
                        renderInput={(params) => <TextField {...params} label="Parça Adı" />}
                        sx={autocompleteStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Hareket Tipi"
                        name="movementType"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Adet"
                        name="quantity"
                        type="number"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Talep Edilen"
                        name="requested"
                        type="number"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Hareket"
                        name="movement"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="KUTU ADET"
                        name="boxQuantity"
                        type="number"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="İhtiyaç"
                        name="need"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Tarih"
                        type="datetime-local"
                        name="date"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Ek Bilgi"
                        name="description"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />

                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={onClose} variant="contained" sx={modalCloseButtonStyle}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={mainButtonStyle}>Create</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default NewStockMovementModal;
