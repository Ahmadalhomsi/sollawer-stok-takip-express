import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(res.data.message);
        } catch (err) {
            if (err.response && err.response.data) {
                setMessage(err.response.data.error);
            } else {
                setMessage('Error uploading file');
            }
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
                <Button variant="contained" color="primary" onClick={onSubmit} sx={{ mt: 2 }}>
                    Upload
                </Button>
                {message && (
                    <Typography variant="body1" color="green" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default FileUpload;
