import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewCardModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        orderNumber: 0,
        UNID: '',
        revisionNO: '',
        revisionDate: '',
        manufacturer: '',
        isActive: true,
        depotShelfNo: '',
        projectNO: '',
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
        axios.post('http://localhost:5000/api/controlCards', newRow)
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
                    Yeni Kart Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        type='number'
                        label="Sıra NO"
                        name="orderNumber"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="UNID"
                        name="UNID"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Revizyon NO"
                        name="revisionNO"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Revizyon Tarihi"
                        type="datetime-local"
                        name="revisionDate"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Üretici"
                        name="manufacturer"
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox name="isActive" checked={newRow.isActive} onChange={handleChange} />}
                        label="Aktif/Pasif"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Depo Raf No"
                        name="depotShelfNo"
                        onChange={handleChange}
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

export default NewCardModal;
