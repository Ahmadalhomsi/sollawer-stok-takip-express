// src/NewRowModal.js
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const NewRowModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        orderDate: '',
        shipmentDate: '',
        shipmentStatus: false,
        invoiceStatus: false,
        invoiceNO: '',
        projectNO: '',
        projectName: '',
        tableCount: 0,
        projectLink: '',
        company: '',
        investorName: '',
        city: '',
        latitude: 0,
        longitude: 0,
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
        axios.post('http://localhost:5000/api/orders', newRow)
            .then((response) => {
                // If the request is successful, call the onRowCreated function to update the table
                onRowCreated(response.data);
                // Close the modal
                onClose();
            })
            .catch((error) => {
                console.error('There was an error creating the new row!', error);
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
                    Create New Row
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Order Date"
                        type="datetime-local"
                        name="orderDate"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Shipment Date"
                        type="datetime-local"
                        name="shipmentDate"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox name="shipmentStatus" checked={newRow.shipmentStatus} onChange={handleChange} />}
                        label="Shipment Status"
                    />
                    <FormControlLabel
                        control={<Checkbox name="invoiceStatus" checked={newRow.invoiceStatus} onChange={handleChange} />}
                        label="Invoice Status"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Invoice No"
                        name="invoiceNO"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project No"
                        name="projectNO"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Name"
                        name="projectName"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Table Count"
                        name="tableCount"
                        type="number"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Link"
                        name="projectLink"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Company"
                        name="company"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Investor Name"
                        name="investorName"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="City"
                        name="city"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Latitude"
                        name="latitude"
                        type="number"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Longitude"
                        name="longitude"
                        type="number"
                        onChange={handleChange}
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

export default NewRowModal;
