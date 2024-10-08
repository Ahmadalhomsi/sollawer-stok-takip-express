import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { autocompleteStyle, mainButtonStyle, modalCloseButtonStyle, ModalNewFieldStyle } from '../styles';

const NewProjectModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        projectNO: '',
        tableCount: 0,
        projectLink: '',
        city: '',
        manufacturer: '',
        latitude: 0,
        longitude: 0,
        EPC: '',
        customerName: '',
    });

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        if (open) {
            axios.get('http://localhost:5000/api/customers')
                .then((response) => {
                    setCustomers(response.data);
                })
                .catch((error) => {
                    console.error('There was an error fetching the customers!', error);
                });
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAutocompleteChange = (event, value) => {
        setNewRow((prev) => ({
            ...prev,
            customerName: value || '', // Use the selected value or an empty string if none selected
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Created Row:");
        console.log(newRow);
        // Send the new row data to the backend
        axios.post('http://localhost:5000/api/projects', newRow)
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
                    Yeni Proje Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project NO"
                        name="projectNO"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type='number'
                        label="Masa sayısı"
                        name="tableCount"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Proje Linki"
                        name="projectLink"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Şehir"
                        name="city"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type='number'
                        label="Enlem"
                        name="latitude"
                        inputProps={{ step: "any" }} // Allow any step for float numbers
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type='number'
                        label="Boylam"
                        name="longitude"
                        inputProps={{ step: "any" }} // Allow any step for float numbers
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="EPC"
                        name="EPC"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <Autocomplete
                        fullWidth
                        margin="normal"
                        options={customers.map((customer) => customer.name)}
                        value={newRow.customerName}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Müşteri Adı" />
                        )}
                        sx={autocompleteStyle}
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

export default NewProjectModal;
