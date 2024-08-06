import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewCardParameterModal = ({ open, onClose, onRowCreated, selectedUNID }) => {
    const [newRow, setNewRow] = useState({
        UNID: '',
        parameterNO: '',
        parameter: '',
        value: '',
    });

    const [unidList, setUnidList] = useState([]);

    useEffect(() => {
        if (open) {
            axios.get('http://localhost:5000/api/controlCards')
                .then((response) => {
                    setUnidList(response.data.map((card) => card.UNID));
                })
                .catch((error) => {
                    console.error('There was an error fetching the UNID list!', error);
                });
        }
    }, [open]);

    useEffect(() => {
        if (selectedUNID) {
            setNewRow((prev) => ({
                ...prev,
                UNID: selectedUNID, // Automatically set parameter field with selected UNID
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

    const handleAutocompleteChange = (event, value) => {
        setNewRow((prev) => ({
            ...prev,
            UNID: value || '', // Use the selected value or an empty string if none selected
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
                console.error('There was an error creating the new row!', error);
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
                    Yeni Kart Parametresi Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Autocomplete
                        fullWidth
                        margin="normal"
                        options={unidList}
                        value={newRow.UNID}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Kart ID (UNID)" />
                        )}
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
