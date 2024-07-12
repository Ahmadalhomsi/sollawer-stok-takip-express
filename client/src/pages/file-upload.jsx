import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, List, ListItem, IconButton, TextField, Autocomplete } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import toast from "react-hot-toast";
import DeleteIcon from '@mui/icons-material/Delete';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [sheetPage, setSheetPage] = useState(0);
    const [uploadType, setUploadType] = useState('Kontrol Kart Import');

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const fetchUploadedFiles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/uploads');
            setUploadedFiles(res.data);
        } catch (err) {
            toast.error('Error fetching uploaded files');
        }
    };

    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload');
            toast.error('Please select a file to upload');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sheetPage', sheetPage);

        const endpoint = uploadType === 'Kontrol Kart Import' ? '/uploadControlCards' : '/uploadCardParameters';

        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('File uploaded successfully');
            fetchUploadedFiles(); // Refresh the list of uploaded files
        } catch (err) {
            toast.error('Error uploading file');
        }
    };

    const handleDelete = async (filePath) => {
        try {
            await axios.delete('http://localhost:5000/deleteFile', {
                data: { filePath }
            });
            toast.success('File deleted successfully');
            fetchUploadedFiles(); // Refresh the list of uploaded files
        } catch (err) {
            toast.error('Error deleting file');
        }
    };

    return (
        <>
            <TabNavigation tabs={allTabs} />

            <Box sx={{ p: 7 }}>
                <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #cccccc', padding: '120px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    <Typography variant="h6">Drag & drop a file here, or click to select a file</Typography>
                </div>
                {file && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Selected file: {file.name}
                    </Typography>
                )}
                <Autocomplete
                    options={['Kontrol Kart Import', 'Kart Parametresi Import']}
                    value={uploadType}
                    onChange={(event, newValue) => setUploadType(newValue)}
                    renderInput={(params) => <TextField {...params} label="Upload Type" variant="outlined" sx={{ mt: 2 }} />}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Sheet Page"
                    variant="outlined"
                    value={sheetPage}
                    onChange={(e) => setSheetPage(e.target.value)}
                    sx={{ mt: 2, width: '100%' }}
                />
                <Button variant="contained" color="primary" onClick={onSubmit} sx={{ mt: 2 }}>
                    Upload
                </Button>
                {message && (
                    <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Uploaded Files:</Typography>
                    <List>
                        {uploadedFiles.map((uploadedFile, index) => (
                            <ListItem key={index}>
                                {uploadedFile}
                                <IconButton onClick={() => handleDelete(uploadedFile)} aria-label="delete" sx={{ ml: 2 }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </>
    );
};

export default FileUpload;
