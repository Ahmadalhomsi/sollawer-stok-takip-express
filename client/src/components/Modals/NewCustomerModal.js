import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { mainButtonStyle, modalCloseButtonStyle, ModalNewFieldStyle } from '../styles';

const NewCustomerModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Created Row:");
        console.log(newRow);
        // Send the new row data to the backend
        axios.post('http://localhost:5000/api/customers', newRow)
            .then((response) => {
                // If the request is successful, call the onRowCreated function to update the table
                onRowCreated(response.data);
                // Close the modal
                onClose();
            })
            .catch((error) => {
                console.log('There was an error creating the new row!', error);
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
                width: 400, /* Adjust width as needed */
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4, /* Adjust padding as needed */
                borderRadius: 2,
                overflow: 'auto', /* Enable scrolling */
                maxHeight: 'calc(100vh - 100px)', /* Set max height (adjust as needed) */
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    Yeni Müşteri Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Müşteri İsmi"
                        name="name"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Firma"
                        name="companyName"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Telefon Numarası"
                        name="phone"
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

export default NewCustomerModal;
