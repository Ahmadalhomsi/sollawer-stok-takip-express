import React, { useState } from 'react';
import { Container, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';

const ExcelExport = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [sheetPage, setSheetPage] = useState(0);
    const [exportTable, setExportTable] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('sheetPage', sheetPage);

        try {
            const response = await axios.post('/uploadCardParameters', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data);
        } catch (error) {
            console.error(error);
            alert('Error uploading file.');
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/exportData?table=${exportTable}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${exportTable}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            // alert('Error exporting data.');
            toast.error('Error exporting data.');
        }
    };

    return (
        <>
            <TabNavigation tabs={allTabs} />
            <Container>


                <h1>Excel File Export</h1>




                <FormControl fullWidth margin="normal">
                    <InputLabel>Export Table</InputLabel>
                    <Select
                        value={exportTable}
                        onChange={(e) => setExportTable(e.target.value)}
                        label="Export Table"
                    >
                        <MenuItem value="Siparişler">Siparişler</MenuItem>
                        <MenuItem value="Kontrol kartlar">Kontrol kartlar</MenuItem>
                        <MenuItem value="Kart parametreler">Kart parametreler</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExport}
                    fullWidth
                    margin="normal"
                    disabled={!exportTable}
                >
                    Export Data
                </Button>
            </Container>
        </>
    );
};

export default ExcelExport;
