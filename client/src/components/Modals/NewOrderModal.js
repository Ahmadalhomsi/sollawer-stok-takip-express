import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { autocompleteStyle, checkboxStyle, mainButtonStyle, modalCloseButtonStyle, ModalNewFieldStyle } from '../styles';

const NewOrderModal = ({ open, onClose, onRowCreated }) => {
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

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (open) {
            axios.get('http://localhost:5000/api/projects')
                .then((response) => {
                    setProjects(response.data);
                })
                .catch((error) => {
                    console.error('There was an error fetching the projects!', error);
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
            projectNO: value || '', // Use the selected value or an empty string if none selected
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
                    Yeni Sipariş Oluştur
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
                        sx={ModalNewFieldStyle}
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
                        sx={ModalNewFieldStyle}
                    />
                    <FormControlLabel
                        control={<Checkbox name="shipmentStatus" checked={newRow.shipmentStatus} onChange={handleChange} sx={checkboxStyle} />}
                        label="Shipment Status"
                    />
                    <FormControlLabel
                        control={<Checkbox name="invoiceStatus" checked={newRow.invoiceStatus} onChange={handleChange} sx={checkboxStyle} />}
                        label="Invoice Status"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Invoice No"
                        name="invoiceNO"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <Autocomplete
                        fullWidth
                        margin="normal"
                        options={projects.map((project) => project.projectNO)}
                        value={newRow.projectNO}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Project No" />
                        )}
                        sx={autocompleteStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Name"
                        name="projectName"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Table Count"
                        name="tableCount"
                        type="number"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Link"
                        name="projectLink"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Company"
                        name="company"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Investor Name"
                        name="investorName"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="City"
                        name="city"
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Latitude"
                        name="latitude"
                        type="number"
                        inputProps={{ step: "any" }} // Allow any step for float numbers
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Longitude"
                        name="longitude"
                        type="number"
                        inputProps={{ step: "any" }} // Allow any step for float numbers
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

export default NewOrderModal;
