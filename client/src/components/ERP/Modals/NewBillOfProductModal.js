import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewBillOfProductModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        billName: '',
        billDate: '',
        description: '',
        items: [], // Initialize items as an empty array
    });

    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        // Fetch stocks data from the backend
        axios.get('http://localhost:5000/api/erp/stocks')
            .then((response) => {
                setStocks(response.data);
            })
            .catch((error) => {
                console.log('There was an error fetching the stocks data!', error);
                toast.error('Error fetching stocks data');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleStockChange = (event, value) => {
        const itemsWithQuantities = value.map((stock) => ({
            stock,
            quantity: 1, // Default quantity
        }));
        setNewRow((prev) => ({
            ...prev,
            items: itemsWithQuantities,
        }));
    };

    const handleQuantityChange = (index, event) => {
        const { value } = event.target;
        const updatedItems = [...newRow.items];
        updatedItems[index].quantity = Number(value);
        setNewRow((prev) => ({
            ...prev,
            items: updatedItems,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the payload to match the backend requirements
        const payload = {
            billName: newRow.billName,
            billDate: newRow.billDate,
            description: newRow.description,
            items: newRow.items.map(item => ({
                stockId: item.stock.id,
                quantity: item.quantity,
            })),
        };

        // Send the new row data to the backend
        axios.post('http://localhost:5000/api/erp/billsOfProduct', payload)
            .then((response) => {
                // If the request is successful, call the onRowCreated function to update the table
                onRowCreated(response.data);
                // Close the modal
                onClose();
            })
            .catch((error) => {
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
                width: 400, /* Adjust width as needed */
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4, /* Adjust padding as needed */
                borderRadius: 2,
                overflow: 'auto', /* Enable scrolling */
                maxHeight: 'calc(100vh - 100px)', /* Set max height (adjust as needed) */
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    Yeni Ürün Reçetesi Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Reçete Adı"
                        name="billName"
                        value={newRow.billName}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Reçete Tarihi"
                        type="datetime-local"
                        name="billDate"
                        value={newRow.billDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Ek Bilgi"
                        name="description"
                        value={newRow.description}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        multiple
                        options={stocks}
                        getOptionLabel={(option) => option.stockName}
                        onChange={handleStockChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Stok Seç"
                                margin="normal"
                                placeholder="Stokları seçin"
                            />
                        )}
                    />
                    {newRow.items.map((item, index) => (
                        <Box key={item.stock.id} display="flex" alignItems="center" mt={2}>
                            <Typography sx={{ mr: 2 }}>{item.stock.stockName}</Typography>
                            <TextField
                                type="number"
                                label="Miktar"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(index, e)}
                                sx={{ width: '100px' }}
                            />
                        </Box>
                    ))}
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={onClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Create</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default NewBillOfProductModal;
