import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from "react-hot-toast";
import NewProjectModal from '../Modals/NewProjectModal';

const ProjectTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [epcFilter, setEpcFilter] = useState(''); // State for EPC filter

    useEffect(() => {
        axios.get('http://localhost:5000/api/projects')
            .then((response) => {
                setRows(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message)
                console.error('There was an error fetching the data!', error);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
        try {
            axios.delete(`http://localhost:5000/api/projects/${id}`);
        } catch (error) {
            console.log(error);
        }
    };


    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleRowCreated = (newRow) => {
        setRows((prevRows) => [...prevRows, newRow]);
    };

    const handleFilterChange = (e) => {
        setEpcFilter(e.target.value); // Update EPC filter state
    };

    const filteredRows = rows.filter((row) =>
        row.EPC.toLowerCase().includes(epcFilter.toLowerCase())
    );

    const handleRowUpdate = async (newRow, oldRow) => {
        if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
            try {
                await axios.put(`http://localhost:5000/api/projects/${newRow.id}`, newRow);
                toast.success("Row updated successfully");
                setRows((prevRows) =>
                    prevRows.map((row) => (row.id === newRow.id ? newRow : row))
                ); // Update local state
                return newRow;
            } catch (error) {
                toast.error("Failed to update row");
                console.error('Error updating row:', error);
                return oldRow;
            }
        }
        return oldRow;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },

        {
            field: 'projectNO', headerName: 'Proje NO', width: 140, editable: true
        },
        {
            field: 'tableCount', headerName: 'Masa Sayısı', width: 140, editable: true, type: 'number'
        },
        {
            field: 'projectLink', headerName: 'Proje Linki', width: 200, editable: true,
            renderCell: (params) => (
                <Link href={params.value} target="_blank" rel="noopener noreferrer">
                    {params.value}
                </Link>
            ),
            renderEditCell: (params) => (
                <>
                    {params.value}
                </>

            )
        },
        {
            field: 'city', headerName: 'Şehir', width: 140, editable: true
        },
        {
            field: 'latitude', headerName: 'Enlem', width: 140, editable: true, type: 'number'
        },
        {
            field: 'longitude', headerName: 'Boylam', width: 140, editable: true, type: 'number'
        },
        {
            field: 'EPC', headerName: 'EPC', width: 140, editable: true
        },
        {
            field: 'customerName', headerName: 'Müşteri Adı', width: 140, editable: true
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 164,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleDelete(params.id)} color="error" size="small">
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
                YENİ PROJE EKLE
            </Button>

            <TextField
                label="EPC Filter"
                value={epcFilter}
                onChange={handleFilterChange}
                variant="outlined"
                size='small'
                style={{ marginBottom: 16, marginRight: 35, marginLeft: 10 }}
            />

            <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                loading={loading}
                getRowId={(row) => row.id}
                processRowUpdate={handleRowUpdate}
                onProcessRowUpdateError={(error) => {
                    toast.error("Error updating row");
                    console.error('Error updating row:', error);
                }}
            />
            <NewProjectModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />
        </Box>
    );
};

export default ProjectTable;
