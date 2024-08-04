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

    let isReadyForSubmit = true;
    const processRowUpdate = async (newRow, oldRow) => {
        if ((newRow !== oldRow) && isReadyForSubmit) {
            await handleSave(newRow);
        }
        return newRow;
    };


    const handleSave = async (updatedRow) => {
        console.log("Updated Row:", updatedRow);
        const dataToUpdate = {
            ...updatedRow,
            orderDate: new Date(updatedRow.orderDate).toISOString(),
            items: outLocalItems,
        };

        try {
            const response = await axios.put(`http://localhost:5000/api/erp/productionOrders/${updatedRow.id}`, dataToUpdate);

            if (response.status === 200) {
                const updatedRows = rows.map((row) => (row.id === updatedRow.id ? response.data : row));
                setRows(updatedRows);
                toast.success('Row updated successfully!');
                return updatedRow;
            } else {
                console.error(`Failed to update row: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating row:', error);
        }
        return updatedRow;
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
        setEditIdx(row.id); // Ensure editIdx is set

        setBillModalOpen(true);
    };

    const handleBillSave = (newItem) => {

        // Find the row being edited and update its items
        const updatedRows = rows.map(row =>
            row.id === editIdx ? {
                ...row,
                BillOfProduct: newItem.bill,
                billOfProductId: newItem.bill.id,
            } : row
        );

        // Find the row with the updated items
        const updatedRow = updatedRows.find(row => row.id === editIdx);

        setBillModalOpen(false);
        isReadyForSubmit = true;

        handleSave(updatedRow);
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
        { field: 'id', headerName: 'ID', width: 100, editable: false },
        { field: 'orderNO', headerName: 'Order NO', width: 180, editable: true },
        { field: 'quantity', headerName: 'Quantity', width: 180, editable: true, type: 'number' },
        {
            field: 'orderDate',
            headerName: 'Order Date',
            width: 180,
            editable: true,
            renderEditCell: (params) => (
                <TextField
                    fullWidth
                    type="datetime-local"
                    value={params.value ? new Date(params.value).toISOString().slice(0, 16) : ''}
                    onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                />
            ),
        },
        {
            field: 'BillOfProduct.billName',
            headerName: 'Reçete',
            width: 150,
            editable: true,

            renderCell: (params) => (
                <span>{params.row.BillOfProduct.billName || "Default Bill Name"}</span>
            ),
            renderEditCell: (params) => (
                <>
                    {isReadyForSubmit = false}
                    {handleBillEdit(params.row)}
                </>

            )
        },
        { field: 'totalCost', headerName: 'Toplam Maliyet', width: 100, editable: false, type: 'number' },
        { field: 'description', headerName: 'Description', width: 150, editable: true },
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
            )
            // renderEditCell: (params) => (
            //     <Button onClick={() => handleStockEdit(params)} variant="contained" size="small" style={{ marginRight: 8 }}>
            //         Edit Stock Items URL
            //     </Button>
            // )
        },
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
                processRowUpdate={processRowUpdate}
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
