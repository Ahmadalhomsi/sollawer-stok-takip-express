import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, List, ListItem, Link } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewFaultyCardModal = ({ open, onClose, onRowCreated }) => {
    const [newRow, setNewRow] = useState({
        UNID: '',
        servisDate: '',
        status: '',
        fault: '',
        photoURL: [],
        projectNO: '',
    });
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!open) {
            // Reset the form and files when the modal is closed
            setNewRow({
                UNID: '',
                servisDate: '',
                status: '',
                fault: '',
                photoURL: [],
                projectNO: '',
            });
            setFiles([]);
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
        handleFileUpload(e.target.files);
    };

    const handleFileUpload = async (files) => {
        if (files.length === 0) return;

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file); 

            try {
                const res = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Extract filename from response
                const { fileName } = res.data;

                // Update photoURL state with filenames
                setNewRow((prev) => ({
                    ...prev,
                    photoURL: [...prev.photoURL, fileName]
                }));
            } catch (err) {
                console.log('Error uploading files', err);
                toast.error('Error uploading files');
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Loop through each link in the photoURL array
        const extractedFilenames = newRow.photoURL.map(link => {
            // Use either Method 1 or Method 2 (explained below) to extract the filename
            const filename = extractFilename(link); // Replace with your chosen method
            return filename;
        });

        // Send the data with extracted filenames
        axios.post('http://localhost:5000/api/faultyCards', {
            ...newRow,
            photoURL: extractedFilenames,
        })
            .then((response) => {
                // If successful, update table and close modal
                onRowCreated(response.data);
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

    // Function to extract the filename (choose either method)

    // Method 1: Using split() and pop()
    function extractFilename(link) {
        return link.split('\\').pop() || link.split('/').pop(); // Handle both backslashes and forward slashes
    }

    // Method 2: Using lastIndexOf() and substring()
    function extractFilename(link) {
        const lastSeparatorIndex = Math.max(link.lastIndexOf('\\'), link.lastIndexOf('/'));
        return lastSeparatorIndex !== -1 ? link.substring(lastSeparatorIndex + 1) : link;
    }




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
                        label="UNID"
                        name="UNID"
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
                    <Typography variant="body1" sx={{ mt: 2 }}>Uploaded Photos:</Typography>
                    <List>
                        {newRow.photoURL.map((url, index) => (
                            <ListItem key={index}>
                                <Link href={`http://localhost:5000/${url}`} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                    >
                        Upload Photos
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
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
