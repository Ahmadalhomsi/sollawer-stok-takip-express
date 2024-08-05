import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewProductionOrderModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        orderNO: '',
        quantity: 0,
        orderDate: '',
        description: '',
        billOfProductId: null,
        totalCost: 0,
    });

    const [bills, setBills] = useState([]);

    useEffect(() => {
        // Fetch bills data from the backend
        axios.get('http://localhost:5000/api/erp/billsOfProduct')
            .then((response) => {
                setBills(response.data);
                console.log('Bills data:', response.data);
            })
            .catch((error) => {
                console.log('There was an error fetching the bills data!', error);
                toast.error('Error fetching bills data');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleBillChange = (event, value) => {
        setNewRow((prev) => ({
            ...prev,
            billOfProductId: value ? value.id : null,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the payload to match the backend requirements
        const payload = {
            orderNO: newRow.orderNO,
            quantity: newRow.quantity,
            orderDate: newRow.orderDate,
            description: newRow.description,
            billOfProductId: newRow.billOfProductId,
        };

        // Send the new row data to the backend
        axios.post('http://localhost:5000/api/erp/productionOrders', payload)
            .then((response) => {
                onRowCreated(response.data);
                onClose();
            })
            .catch((error) => {
                console.log('There was an error creating the new row!', error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
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
                    Yeni Üretim Emri Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Emir NO"
                        name="orderNO"
                        value={newRow.orderNO}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Miktar"
                        type="number"
                        name="quantity"
                        value={newRow.quantity}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Emir Tarihi"
                        type="datetime-local"
                        name="orderDate"
                        value={newRow.orderDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Açıklama"
                        name="description"
                        value={newRow.description}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        options={bills}
                        getOptionLabel={(option) => option.billName}
                        onChange={handleBillChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Reçete Seç"
                                margin="normal"
                                placeholder="Reçeteyi seçin"
                            />
                        )}
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={onClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Create</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default NewProductionOrderModal;
