import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewCardParameterModal from '../Modals/NewCardParameterModal';
import UNIDSearchModal from '../Modals/UNIDSearchModal';

const CardParametersTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [unidSearchModalOpen, setUNIDSearchModalOpen] = useState(false);
    const [selectedUNID, setSelectedUNID] = useState(null);
    const [isCartSelected, setShowLabel] = useState(false);
    const [unidFilter, setUnidFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, [unidFilter]);

    const fetchData = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/cardParameters')
            .then((response) => {
                let filteredRows = response.data;
                if (unidFilter) {
                    filteredRows = filteredRows.filter(row => row.UNID.includes(unidFilter));
                }
                setRows(filteredRows);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                console.log('There was an error fetching the data!', error);
                setLoading(false);
            });
    };

    const handleRowUpdate = async (newRow, oldRow) => {
        if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
            try {
                await axios.put(`http://localhost:5000/api/cardParameters/${newRow.id}`, newRow);
                toast.success("Row updated successfully");
                return newRow;
            } catch (error) {
                console.log('There was an error creating the new row!', error);
                if (error.response && error.response.data && error.response.data.error) {
                    // Check for specific foreign key constraint error
                    if (error.response.data.error.includes('Foreign key constraint violation')) {
                        toast.error('Foreign key constraint violation: the referenced key does not exist.');
                    } else {
                        toast.error(error.response.data.error);
                    }
                } else {
                    toast.error('There was an error creating the new row!');
                }
            }
        }
        return oldRow;
    };

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
        try {
            axios.delete(`http://localhost:5000/api/cardParameters/${id}`);
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
        setShowLabel(false); // Hide the label after creating a new row
        setSelectedUNID(null); // Clear the selected UNID
    };

    const handleUNIDSelect = (selectedUNID) => {
        setSelectedUNID(selectedUNID);
        setShowLabel(true);
        setUNIDSearchModalOpen(false); // Close the modal after selecting
    };

    const handleFilterChange = (event) => {
        setUnidFilter(event.target.value);
    };

    const filteredRows = rows.filter(row =>
        row.UNID.toLowerCase().includes(unidFilter.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },
        { field: 'UNID', headerName: 'UNID', width: 120, editable: true },
        { field: 'parameterNO', headerName: 'Parametre NO', width: 110, editable: true },
        { field: 'parameter', headerName: 'Parametre', width: 110, editable: true },
        { field: 'value', headerName: 'Değer', width: 120, editable: true },
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
        }
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button disabled={!isCartSelected} onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
                YENİ KART PARAMETRESİ EKLE
            </Button>

            <TextField
                label="UNID Filter"
                value={unidFilter}
                onChange={handleFilterChange}
                variant="outlined"
                size='small'
                style={{ marginBottom: 16, marginRight: 10, marginLeft: 15 }}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={() => setUNIDSearchModalOpen(true)}
                style={{ marginBottom: 20, marginTop: 2 }}
            >
                UNID İLE KART SEÇ
            </Button>

            {isCartSelected && (
                <Box sx={{ marginBottom: 2 }}>
                    <strong>Selected UNID: {selectedUNID}</strong>
                </Box>
            )}

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
                    console.log('Error updating row:', error);
                }}
                experimentalFeatures={{ newEditingApi: true }}
            />
            <NewCardParameterModal
                open={isModalOpen}
                onClose={handleModalClose}
                onRowCreated={handleRowCreated}
                selectedUNID={selectedUNID} // Pass selected UNID to the modal
            />

            <UNIDSearchModal
                open={unidSearchModalOpen}
                onClose={() => setUNIDSearchModalOpen(false)}
                onSelect={handleUNIDSelect} // Adjust 'Card Name' to be the actual card name
            />
        </Box>
    );
};

export default CardParametersTable;
