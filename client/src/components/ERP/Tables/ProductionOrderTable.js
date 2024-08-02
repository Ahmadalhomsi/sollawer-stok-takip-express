import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Link, Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from 'react-hot-toast';
import EditStockModal from '../Modals/EditStockModal'; // Ensure the correct import path
import NewProductionOrderModal from '../Modals/NewProductionOrderModal';


let outLocalItems = [];

const ProductionOrderTable = () => {
    const [rows, setRows] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isBillModalOpen, setBillModalOpen] = useState(false);
    const [editingBillItem, setEditingBillItem] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/api/erp/productionOrders')
            .then((response) => {
                setRows(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                console.error('There was an error fetching the data!', error);
                setLoading(false);
            });
    }, []);

    const handleEdit = (params) => {
        setEditIdx(params.id);
        setEditRow(rows.find((row) => row.id === params.id));
    };

    const handleSave = async () => {
        const dataToUpdate = {
            ...editRow,
            orderDate: new Date(editRow.orderDate).toISOString(),
            items: outLocalItems,
        };

        try {
            const response = await axios.put(`http://localhost:5000/api/erp/productionOrders/${editIdx}`, dataToUpdate);

            if (response.status === 200) {
                const updatedRows = rows.map((row) => (row.id === editIdx ? response.data : row));
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
            axios.delete(`http://localhost:5000/api/erp/productionOrders/${id}`);
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

    const handleBillEdit = (row) => {
        console.log("Editing Bill for row:", row.BillOfProduct.billName);
        setEditingBillItem(row.BillOfProduct); // Assume there's only one item for simplification
        setBillModalOpen(true);
    };

    const handleBillSave = (newItem) => {
        // Update the editRow with the new bill information
        setEditRow((prev) => ({
            ...prev,
            BillOfProduct: newItem.bill,
            billOfProductId: newItem.bill.id,
        }));
        setBillModalOpen(false);
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
            field: 'id', headerName: 'ID', width: 100, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="id"
                    value={editRow.id}
                    disabled
                />
            ) : params.value
        },
        {
            field: 'orderNO', headerName: 'Order NO', width: 180, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="orderNO"
                    value={editRow.orderNO}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'quantity', headerName: 'Quantity', width: 180, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    name="quantity"
                    value={editRow.quantity}
                    onChange={handleChange}
                    type='number'
                />
            ) : params.value
        },
        {
            field: 'orderDate',
            headerName: 'Order Date',
            width: 180,
            renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    fullWidth
                    type="datetime-local"
                    name="orderDate"
                    value={new Date(editRow.orderDate).toISOString().slice(0, 16)}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            ) : new Date(params.value).toLocaleString()
        },
        {
            field: 'BillOfProduct.billName',
            headerName: 'Reçete',
            width: 150,
            renderCell: (params) => params.row.id === editIdx ? (
                <Button onClick={() => handleBillEdit(editRow)} variant="contained" color="primary" size="small">
                    Edit Bill
                </Button>
            ) : (
                <span>{params.row.BillOfProduct.billName || "Default Bill Name"}</span>
            )
        },
        {
            field: 'totalCost', headerName: 'Toplam Maliyet', width: 100, renderCell: (params) => params.row.id === editIdx ? (
                <TextField
                    type="number"
                    name="totalCost"
                    value={editRow.totalCost}
                    onChange={handleChange}
                />
            ) : params.value
        },
        {
            field: 'description', headerName: 'Description', width: 150, renderCell: (params) => params.row.id === editIdx ? (
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
                ADD NEW PRODUCTION ORDER
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

            <NewProductionOrderModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />

            <EditStockModal
                open={isBillModalOpen}
                onClose={() => setBillModalOpen(false)}
                item={editingBillItem}
                onSave={handleBillSave}
            />
        </Box>
    );
};

export default ProductionOrderTable;
