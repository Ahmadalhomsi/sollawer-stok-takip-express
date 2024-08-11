import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, List, ListItem, Link, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { autocompleteStyle, mainButtonStyle, modalCloseButtonStyle, ModalNewFieldStyle } from '../styles';

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
    const [controlCards, setControlCards] = useState([]);
    const [projects, setProjects] = useState([]);

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
        } else {
            // Fetch control cards and projects when the modal opens
            fetchControlCards();
            fetchProjects();
        }
    }, [open]);

    const fetchControlCards = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/controlCards');
            setControlCards(response.data);
        } catch (error) {
            console.error('Error fetching control cards:', error);
            toast.error('Error fetching control cards');
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Error fetching projects');
        }
    };

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

                const { fileName } = res.data;

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

        const extractedFilenames = newRow.photoURL.map(link => extractFilename(link));

        axios.post('http://localhost:5000/api/faultyCards', {
            ...newRow,
            photoURL: extractedFilenames,
        })
            .then((response) => {
                onRowCreated(response.data);
                onClose();
            })
            .catch((error) => {
                console.log('There was an error creating the new row!', error);
                if (error.response && error.response.data && error.response.data.error) {
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

    function extractFilename(link) {
        return link.split('\\').pop() || link.split('/').pop();
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
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflow: 'auto',
                maxHeight: 'calc(100vh - 100px)',
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    Yeni Arızalı Kart Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Autocomplete
                        options={controlCards.map((card) => card.UNID)}
                        value={newRow.UNID}
                        onChange={(event, newValue) => {
                            setNewRow((prev) => ({ ...prev, UNID: newValue }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                label="UNID"
                            />
                        )}
                        sx={autocompleteStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Servis Tarihi"
                        type="datetime-local"
                        name="servisDate"
                        value={newRow.servisDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Durum"
                        name="status"
                        value={newRow.status}
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Arıza"
                        name="fault"
                        value={newRow.fault}
                        onChange={handleChange}
                        sx={ModalNewFieldStyle}
                    />
                    <Typography variant="body1" sx={{ mt: 1 }}>Uploaded Photos:</Typography>
                    <List>
                        {newRow.photoURL.map((url, index) => (
                            <ListItem key={index}>
                                <Link href={`http://localhost:5000/${url}`} target="_blank" rel="noopener noreferrer" sx={{ color: '#CEAF03' }}>
                                    {url}
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        variant="contained"
                        component="label"
                        sx={mainButtonStyle}
                    >
                        Upload Photos
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Autocomplete
                        options={projects.map((project) => project.projectNO)}
                        value={newRow.projectNO}
                        onChange={(event, newValue) => {
                            setNewRow((prev) => ({ ...prev, projectNO: newValue }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                label="Project NO"
                            />
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

export default NewFaultyCardModal;
