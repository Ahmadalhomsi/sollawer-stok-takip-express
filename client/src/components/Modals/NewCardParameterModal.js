import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';


const NewCardParameterModal = ({ open, onClose, onRowCreated, selectedUNID }) => {
    const [newRow, setNewRow] = useState({
        cardID: '',
        parameterNO: '',
        parameter: '',
        value: '',
    });

    useEffect(() => {
        if (selectedUNID) {
            setNewRow((prev) => ({
                ...prev,
                cardID: selectedUNID, // Automatically set parameter field with selected UNID
            }));
        }
    }, [selectedUNID]);

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
        axios.post('http://localhost:5000/api/cardParameters', newRow)
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
                    Yeni Kart Parametresi Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Kart ID"
                        value={newRow.cardID} // Set value from state
                        name="cardID"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Parametre NO"
                        name="parameterNO"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Parametre"
                        name="parameter"
                        // value={newRow.parameter} // Set value from state
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Değer"
                        name="value"
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

export default NewCardParameterModal;
