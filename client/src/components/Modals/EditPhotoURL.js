import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Link, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from 'react-hot-toast';
import { mainButtonStyle, modalCloseButtonStyle } from '../styles';

const EditPhotoDialog = ({ isOpen, onClose, editRow, setEditRow }) => {
    const [newPhotoFile, setNewPhotoFile] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState('');

    const handleClickOpen = (url) => {
        setSelectedPhoto(url);
    };

    const handleDeleteURL = async (urlToDelete) => {
        const updatedPhotoURLs = editRow.photoURL.filter((url) => url !== urlToDelete);
        setEditRow((prev) => ({
            ...prev,
            photoURL: updatedPhotoURLs
        }));

        try {
            await axios.delete('http://localhost:5000/deleteFile', {
                data: { filePath: urlToDelete }
            });
        } catch (err) {
            toast.error('Error deleting file');
        }

        toast.success('Photo deleted successfully!');
    };

    const handleURLSubmit = async () => {
        if (newPhotoFile) {
            const formData = new FormData();
            formData.append('file', newPhotoFile);

            try {
                const response = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const photoName = response.data.fileName;
                const updatedPhotoURLs = [...editRow.photoURL, photoName];
                setEditRow((prev) => ({
                    ...prev,
                    photoURL: updatedPhotoURLs
                }));

                toast.success('Photo uploaded successfully!');
            } catch (error) {
                console.log('Error uploading photo:', error);
                toast.error('Error uploading photo');
            }
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Edit Photo URLs</DialogTitle>
            <DialogContent>
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={[modalCloseButtonStyle, { marginBottom: '1rem' }]}
                >
                    Choose Photo
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setNewPhotoFile(e.target.files[0])}
                        accept="image/*"
                    />
                </Button>
                <Button onClick={handleURLSubmit} variant="contained" color="primary"
                    sx={[mainButtonStyle, { marginLeft: '1rem', marginBottom: '1rem' }]}>
                    Upload
                </Button>

                <Typography variant="body2" color="textSecondary">
                    {newPhotoFile ? `Current Photo: ${newPhotoFile.name}` : 'No photo selected'}
                </Typography>

                <Box>
                    {editRow.photoURL && editRow.photoURL.map((url, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => handleClickOpen(`http://localhost:5000/uploads/${url}`)}
                                sx={{
                                    color: '#e6c300'
                                }}
                            >
                                {url}
                            </Link>
                            <IconButton onClick={() => handleDeleteURL(url)} color="error" size="small">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPhotoDialog;
