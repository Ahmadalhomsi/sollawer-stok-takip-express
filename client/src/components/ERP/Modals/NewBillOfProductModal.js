import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';

const NewBillOfProductModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        billName: '',
        billDate: '',
        description: '',
        items: [{ stockId: '', quantity: '' }],
    });

    const handleChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        if (name === 'stockId' || name === 'quantity') {
            const newItems = [...newRow.items];
            newItems[index][name] = type === 'checkbox' ? checked : value;
            setNewRow((prev) => ({
                ...prev,
                items: newItems,
            }));
        } else {
            setNewRow((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleAddItem = () => {
        setNewRow((prev) => ({
            ...prev,
            items: [...prev.items, { stockId: '', quantity: '' }],
        }));
    };

    const handleRemoveItem = (index) => {
        const newItems = newRow.items.filter((_, i) => i !== index);
        setNewRow((prev) => ({
            ...prev,
            items: newItems,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Created Row:", newRow);

        axios.post('http://localhost:5000/api/erp/billsOfProduct', newRow)
            .then((response) => {
                onRowCreated(response.data);
                onClose();
            })
            .catch((error) => {
                console.error('There was an error creating the new row!', error);
                toast.error('There was an error creating the new row!');
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
                    Yeni Ürün Reçetesi Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Reçete Adı"
                        name="billName"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Reçete Tarihi"
                        type="datetime-local"
                        name="billDate"
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
                        onChange={handleChange}
                    />

                    {newRow.items.map((item, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Stock ID"
                                name="stockId"
                                value={item.stockId}
                                onChange={(e) => handleChange(e, index)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleChange(e, index)}
                            />
                            <IconButton onClick={() => handleRemoveItem(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}

                    <Button onClick={handleAddItem} color="primary">Add Item</Button>

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
