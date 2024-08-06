// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton, Modal, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from "react-hot-toast";
import NewBillOfProductModal from '../Modals/NewBillOfProductModal';
import { Autocomplete } from '@mui/material';

let outLocalItems = [];
const EditStockModal = ({ open, onClose, items, onSave }) => {
    const [localItems, setLocalItems] = useState(items);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        // Fetch stocks data on mount
        axios.get('http://localhost:5000/api/erp/stocks')
            .then((response) => {
                setStocks(response.data);
            })
            .catch((error) => {
                console.log('There was an error fetching the stocks!', error);
            });
    }, []);

    // Synchronize localItems with the incoming items prop
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleAddItem = () => {
        setLocalItems([...localItems, { stock: null, quantity: 0 }]);
    };

    const handleDeleteItem = (index) => {
        setLocalItems(localItems.filter((_, idx) => idx !== index));
    };

    const handleStockChange = (index, value) => {
        const newItems = [...localItems];
        newItems[index].stock = value;
        setLocalItems(newItems);
    };

    const handleQuantityChange = (index, event) => {
        const newItems = [...localItems];
        newItems[index].quantity = event.target.value;
        setLocalItems(newItems);
    };

    const handleSave = () => {
        console.log("Saving items:", localItems);  // Check if items are updated
        outLocalItems = localItems;
        onSave(localItems);  // Pass updated items to the parent
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="edit-stock-modal-title"
            aria-describedby="edit-stock-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflow: 'auto',
                maxHeight: 'calc(100vh - 100px)',
            }}>
                <Typography id="edit-stock-modal-title" variant="h6" component="h2" mb={2}>
                    Edit Stock Items
                </Typography>
                {localItems.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                        <Autocomplete
                            disablePortal
                            options={stocks}
                            getOptionLabel={(option) => option.stockName}
                            value={item.stock}
                            onChange={(event, value) => handleStockChange(index, value)}
                            sx={{ width: 300, marginRight: 2 }}
                            renderInput={(params) => <TextField {...params} label="Stock" />}
                        />
                        <TextField
                            label="Quantity"
                            type="number"
                            value={item.quantity}
                            onChange={(event) => handleQuantityChange(index, event)}
                            sx={{ width: 100, marginRight: 2 }}
                        />
                        <IconButton onClick={() => handleDeleteItem(index)} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
                <Button onClick={handleAddItem} color="primary">Add Item</Button>
                <Box mt={2}>
                    <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
                    <Button onClick={onClose} color="secondary" variant="contained" sx={{ marginLeft: 2 }}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
};


const BillOfProductTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});

    // Show Items Modal state
    const [isItemsModalOpen, setItemsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);

    const ItemsModal = ({ open, onClose, items }) => {
        return (
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="items-modal-title"
                aria-describedby="items-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600, // Adjust width as needed
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4, // Adjust padding as needed
                    borderRadius: 2,
                    overflow: 'auto', // Enable scrolling
                    maxHeight: 'calc(100vh - 100px)', // Set max height (adjust as needed)
                }}>
                    <Typography id="items-modal-title" variant="h6" component="h2" mb={2}>
                        Items
                    </Typography>
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                Stock Name: {item.stock.stockName} <br />
                                Quantity: {item.quantity} <br />
                                Cost: ${item.stock.cost}  <br />
                                ----
                            </li>
                        ))}
                    </ul>
                    <Button onClick={onClose} color="primary">Close</Button>
                </Box>
            </Modal>
        );
    };


    // Stock Edit Modal state

    const [isEditStockModalOpen, setEditStockModalOpen] = useState(false);
    const [editingStockItems, setEditingStockItems] = useState([]);

    const handleStockEdit = (params) => {
        const row = rows.find((row) => row.id === params.id);
        setEditingStockItems(row.items);
        setEditIdx(params.id); // Ensure editIdx is set
        setEditStockModalOpen(true);
    };

    let isReadyForSubmit = true;
    const handleStockSave = (newItems) => {

        // Find the row being edited and update its items
        const updatedRows = rows.map(row =>
            row.id === editIdx ? { ...row, items: newItems } : row
        );

        // Find the row with the updated items
        const updatedRow = updatedRows.find(row => row.id === editIdx);

        isReadyForSubmit = true
        handleProcessRowUpdate(updatedRow)

    };


    useEffect(() => {
        axios.get('http://localhost:5000/api/erp/billsOfProduct')
            .then((response) => {
                setRows(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                console.log('There was an error fetching the data!', error);
                setLoading(false);
            });
    }, []);

    const handleEdit = (params) => {
        console.log(params);
        setEditIdx(params.id);
        setEditRow(rows.find((row) => row.id === params.id));
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

    const handleItemsClick = (items) => {
        setModalItems(items);
        setItemsModalOpen(true);
    };

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
        try {
            axios.delete(`http://localhost:5000/api/erp/billsOfProduct/${id}`);
        } catch (error) {
            console.log(error);
            toast.error('Error deleting row')
        }
        toast.success('Row deleted successfully!');
    };

    const handleProcessRowUpdate = async (newRow, oldRow) => {
        if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
            const totalCost = newRow.items.reduce((acc, item) => acc + item.quantity * item.stock.cost, 0);
            newRow.totalCost = totalCost;

            if (isReadyForSubmit) {
                try {
                    const response = await axios.put(`http://localhost:5000/api/erp/billsOfProduct/${newRow.id}`, newRow);
                    if (response.status === 200) {
                        const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
                        setRows(updatedRows);
                        toast.success('Row updated successfully!');
                        return newRow;
                    } else {
                        console.log(`Failed to update row: ${response.statusText}`);
                    }
                } catch (error) {
                    console.log('Error updating row:', error);
                }
                return oldRow;
            }
        }
        return oldRow;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100, editable: false },
        {
            field: 'billName',
            headerName: 'Reçete Adı',
            width: 180,
            editable: true,
        },
        {
            field: 'billDate',
            headerName: 'Reçete Tarihi',
            width: 140,
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
            field: 'items',
            headerName: 'Stoklar',
            width: 300,
            editable: true,
            renderEditCell: (params) => (
                <>
                    <Box style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 80,
                    }}>
                        {isReadyForSubmit = false}
                        {handleStockEdit(params)}
                    </Box>
                </>
            ),

            renderCell: (params) => {
                if (Array.isArray(params.value) && params.value.length > 0) {
                    const itemsString = params.value.map(item => {
                        return `${item.stock.stockName}, Q: ${item.quantity}, C: ${item.stock.cost}`;
                    }).join(' | ');
                    return (
                        <Button onClick={() => handleItemsClick(params.value)}>
                            {itemsString}
                        </Button>
                    );
                }
                return params.value;
            },
        },
        {
            field: 'totalCost',
            headerName: 'Toplam Maliyet',
            width: 100,
            editable: false,
            renderEditCell: (params) => (
                <TextField
                    type="number"
                    fullWidth
                    value={params.value || ''}
                    onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
                />
            ),
        },
        {
            field: 'description',
            headerName: 'Ek Bilgi',
            width: 150,
            editable: true,
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
                YENİ ÜRÜN REÇETESİ EKLE
            </Button>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                loading={loading}
                getRowId={(row) => row.id}
                processRowUpdate={handleProcessRowUpdate}
            />
            <NewBillOfProductModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
            />
            <ItemsModal
                open={isItemsModalOpen}
                onClose={() => setItemsModalOpen(false)}
                items={modalItems}
            />

            <EditStockModal
                open={isEditStockModalOpen}
                onClose={() => setEditStockModalOpen(false)}
                items={editingStockItems}
                onSave={handleStockSave}
            />
        </Box>
    );
};

export default BillOfProductTable;