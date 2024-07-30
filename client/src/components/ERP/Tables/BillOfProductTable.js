// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from "react-hot-toast";
import NewBillOfProductModal from '../Modals/NewBillOfProductModal';


const BillOfProductTable = () => {
    const [rows, setRows] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        axios.get('http://localhost:5000/api/erp/billsOfProduct')
            .then((response) => {
                setRows(response.data);
                console.log(response.data);
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
            quantity: parseInt(editRow.quantity),
            requested: parseInt(editRow.requested),
            boxQuantity: parseInt(editRow.boxQuantity),
            need: parseInt(editRow.need),
            date: new Date(editRow.date).toISOString(),
        };

        try {
            // Await the Axios PUT request
            const response = await axios.put(`http://localhost:5000/api/erp/billsOfProduct/${editIdx}`, dataToUpdate);

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
            axios.delete(`http://localhost:5000/api/erp/billsOfProduct/${id}`);
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
            field: 'billName', headerName: 'Reçete Adı', width: 180, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="billName"
                    value={editRow.billName}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'billDate',
            headerName: 'Reçete Tarihi',
            width: 140,
            renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    fullWidth

                    type="datetime-local"
                    name="billDate"
                    value={new Date(editRow.billDate).toISOString().slice(0, 16)}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            ) : new Date(params.value).toLocaleString()
        },
        
        {
            field: 'items',
            headerName: 'Stoklar',
            width: 150,
            renderCell: (params) => {
                // Check if the row is in edit mode
                if (params.row.id === editIdx) {
                    return (
                        editRow.items && (
                            <TextField
                                name="items"
                                value={editRow.items}
                                onChange={handleChange}
                            />
                        )
                    );
                }

                // Check if items is an array and has elements
                if (Array.isArray(params.value) && params.value.length > 0) {
                    // Convert the array of objects to a string
                    const itemsString = params.value.map(item => {
                        // Customize this part based on the structure of your item object
                        return `Stock ID: ${item.stockId}, Quantity: ${item.quantity}`;
                    }).join('; ');
                    return itemsString;
                }

                return params.value;
            }
        },
        
        {
            field: 'description', headerName: 'Ek Bilgi', width: 150, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="description"
                    value={editRow.description}
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
                YENİ ÜRÜN REÇETESİ EKLE
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
            <NewBillOfProductModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />
        </Box>
    );
};

export default BillOfProductTable;
