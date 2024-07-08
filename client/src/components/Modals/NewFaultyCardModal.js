import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const NewFaultyCardModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        cardID: '',
        servisDate: '',
        status: '',
        fault: '',
        photoURL: '',
        projectNO: '',
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
        axios.post('http://localhost:5000/api/faultyCards', newRow)
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
                    Yeni Arızalı Kart Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Kart ID"
                        name="cardID"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Servis Tarihi"
                        type="datetime-local"
                        name="servisDate"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Durum"
                        name="status"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Arıza"
                        name="fault"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Photo URL"
                        name="photoURL"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project NO"
                        name="projectNO"
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

export default NewFaultyCardModal;
