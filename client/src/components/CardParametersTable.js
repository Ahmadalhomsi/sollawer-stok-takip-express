// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';


// import NewCardModal from './NewCardModal';
import toast from "react-hot-toast";
import NewCardParameterModal from './NewCardParameterModal';


const CardParametersTable = () => {
    const [rows, setRows] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        axios.get('http://localhost:5000/api/cardParameters')
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

    const handleEdit = (params) => {
        setEditIdx(params.id);
        setEditRow(rows.find((row) => row.id === params.id));
    };

    const handleSave = async () => {
        // Convert necessary fields to the appropriate types
        const dataToUpdate = {
            ...editRow,
        };

        try {
            // Await the Axios PUT request
            const response = await axios.put(`http://localhost:5000/api/cardParameters/${editIdx}`, dataToUpdate);

            // Update rows state only if the request is successful
            if (response.status === 200) {
                const updatedRows = rows.map((row) => (row.id === editIdx ? dataToUpdate : row));
                setRows(updatedRows);
                setEditIdx(-1);
            } else {
                console.error(`Failed to update row: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating row:', error);
        }
    };


    const handleCancel = () => {
        setEditIdx(-1);
    };

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
        try {
            axios.delete(`http://localhost:5000/api/cardParameters/${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditRow((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const columns = [

        {
            field: 'id', headerName: 'ID', width: 10, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="id"
                    value={editRow.id}
                // onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'cardID', headerName: 'Kart ID', width: 120, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="cardID"
                    value={editRow.cardID}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'parameterNO', headerName: 'Parametre NO', width: 110, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="parameterNO"
                    value={editRow.parameterNO}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'parameter', headerName: 'Parametre', width: 110, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="parameter"
                    value={editRow.parameter}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'value', headerName: 'Değer', width: 80, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="value"
                    value={editRow.value}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 164,
            renderCell: (params) => (
                params.row.id === editIdx ? (
                    <>
                        <Button onClick={handleSave} variant="contained" color="primary" size="small" style={{ marginRight: 8 }}>
                            Save
                        </Button>
                        <Button onClick={handleCancel} variant="contained" color="secondary" size="small">
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => handleEdit(params)} variant="contained" size="small" style={{ marginRight: 8 }}>
                            Edit
                        </Button>
                        <IconButton onClick={() => handleDelete(params.id)} color="error" size="small">
                            <DeleteIcon />
                        </IconButton>
                    </>
                )
            )
        }
    ];


    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
                Yeni Kontrol Kartı Ekle
            </Button>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                // checkboxSelection
                disableSelectionOnClick
                loading={loading}
                getRowId={(row) => row.id}

            />
            <NewCardParameterModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />
        </Box>
    );
};

export default CardParametersTable;
