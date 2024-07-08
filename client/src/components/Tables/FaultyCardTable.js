// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';


// import NewCardModal from './NewCardModal';
import toast from "react-hot-toast";
import NewFaultyCardModal from '../Modals/NewFaultyCardModal';



const FaultyCardsTable = () => {
    const [rows, setRows] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        axios.get('http://localhost:5000/api/faultyCards')
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
            servisDate: new Date(editRow.revisionDate).toISOString(),  // Ensure proper Date conversion
        };

        try {
            // Await the Axios PUT request
            const response = await axios.put(`http://localhost:5000/api/faultyCards/${editIdx}`, dataToUpdate);

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
            axios.delete(`http://localhost:5000/api/faultyCards/${id}`);
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
            field: 'servisDate',
            headerName: 'Servis Tarih',
            width: 140,
            renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    fullWidth
                    type="datetime-local"
                    name="servisDate"
                    value={new Date(editRow.servisDate).toISOString().slice(0, 16)}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            ) : new Date(params.value).toLocaleString()
        },
        {
            field: 'status', headerName: 'Durum', width: 110, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="status"
                    value={editRow.status}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'fault', headerName: 'Arıza', width: 140, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="fault"
                    value={editRow.fault}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'photoURL', headerName: 'Photo URL', width: 300, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="photoURL"
                    value={editRow.photoURL}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'projectNO', headerName: 'Proje NO', width: 120, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="projectNO"
                    value={editRow.projectNO}
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
                Yeni Arızalı Kart Ekle
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
            <NewFaultyCardModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />
        </Box>
    );
};

export default FaultyCardsTable;
