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
                console.error('There was an error fetching the stocks!', error);
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
    const [editIdx, setEditIdx] = useState(-1);
    const [editRow, setEditRow] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);

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

    const handleItemsClick = (items) => {
        setModalItems(items);
        setItemsModalOpen(true);
    };


    // Stock Edit Modal state

    const [isStockModalOpen, setStockModalOpen] = useState(false);
    const [editingStockItems, setEditingStockItems] = useState([]);

    const handleStockEdit = (row) => {
        setEditingStockItems(row.items);
        setStockModalOpen(true);
    };

    const handleStockSave = (newItems) => {
        const updatedRows = rows.map(row =>
            row.id === editIdx ? { ...row, items: newItems } : row
        );
        setRows(updatedRows);
    };




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
            billDate: new Date(editRow.billDate).toISOString(),  // Ensure proper Date conversion
            items: outLocalItems,  // Add updated items here
        };
    
        console.log("Data to Update:", dataToUpdate);  // Check if items are updated
    
        try {
            const response = await axios.put(`http://localhost:5000/api/erp/billsOfProduct/${editIdx}`, dataToUpdate);
    
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
            width: 300,
            renderCell: (params) => {
                // Check if the row is in edit mode
                if (params.row.id === editIdx) {
                    return (
                        <Button onClick={() => handleStockEdit(editRow)} variant="contained" color="primary" size="small">
                            Edit Stock Items
                        </Button>
                    );
                }

                // Check if items is an array and has elements
                if (Array.isArray(params.value) && params.value.length > 0) {
                    // Convert the array of objects to a string
                    const itemsString = params.value.map(item => {
                        return `${item.stock.stockName},Q: ${item.quantity}, C: ${item.stock.cost}`;
                    }).join(' | ');

                    return (
                        <Button onClick={() => handleItemsClick(params.value)}>
                            {itemsString}
                        </Button>
                    );
                }

                return params.value;
            }
        },
        {
            field: 'totalCost',
            headerName: 'Toplam Maliyet',
            width: 150,
            renderCell: (params) => {
                if (Array.isArray(params.row.items) && params.row.items.length > 0) {
                    let totalCost = 0;
                    params.row.items.forEach(item => {
                        // Customize this part based on the structure of your item object
                        totalCost += item.stock.cost * item.quantity;
                    });
                    return totalCost.toFixed(2); // Adjust the decimal places as needed
                }
                return 0;
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

            <ItemsModal
                open={isItemsModalOpen}
                onClose={() => setItemsModalOpen(false)}
                items={modalItems}
            />

            <EditStockModal
                open={isStockModalOpen}
                onClose={() => setStockModalOpen(false)}
                items={editingStockItems}
                onSave={handleStockSave}
            />
        </Box>


    );
};

export default BillOfProductTable;
