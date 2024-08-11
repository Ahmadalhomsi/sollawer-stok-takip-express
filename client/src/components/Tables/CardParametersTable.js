import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Box, IconButton, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewCardParameterModal from '../Modals/NewCardParameterModal';
import { filterStyle, mainButtonStyle } from '../styles';

const CardParametersTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [unidOptions, setUnidOptions] = useState([]); // For storing UNID options
    const [unidFilter, setUnidFilter] = useState('');

    useEffect(() => {
        fetchData();
        fetchUnidOptions(); // Fetch UNID options on component mount
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

    const fetchUnidOptions = () => {
        axios.get('http://localhost:5000/api/controlCards') // Assuming UNID options come from this endpoint
            .then((response) => {
                const options = response.data.map(card => card.UNID);
                setUnidOptions(options);
            })
            .catch((error) => {
                toast.error('Error fetching UNID options');
                console.log('There was an error fetching UNID options!', error);
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
            toast.error('Error deleting row')
        }
        toast.success('Row deleted successfully!');
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

    const handleFilterChange = (event) => {
        setUnidFilter(event.target.value);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 10, editable: false },
        {
            field: 'UNID',
            headerName: 'UNID',
            width: 120,
            editable: true,
            renderEditCell: (params) => (
                <Autocomplete
                    options={unidOptions}
                    value={params.value || ''}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    style={{ width: 200 }}
                />
            ),
        },
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
            ),
        },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button
                onClick={handleModalOpen}
                variant="contained"
                sx={mainButtonStyle}
            >
                YENİ KART PARAMETRESİ EKLE
            </Button>

            <TextField
                label="UNID Filter"
                value={unidFilter}
                onChange={handleFilterChange}
                variant="outlined"
                size='small'
                sx={filterStyle}
            />

            <DataGrid
                rows={rows}
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
            />
        </Box>
    );
};

export default CardParametersTable;
