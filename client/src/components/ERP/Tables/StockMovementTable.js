import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton, TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewStockMovementModal from '../../ERP/Modals/NewStockMovementModal';
import DeleteIcon from '@mui/icons-material/Delete';
import { mainButtonStyle } from '../../styles';

const StockMovementTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [stockOptions, setStockOptions] = useState([]);

  useEffect(() => {
    // Fetch stock movements data
    axios.get('http://localhost:5000/api/erp/stockMovements')
      .then((response) => {
        setRows(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log('There was an error fetching the data!', error);
        setLoading(false);
      });

    // Fetch stock names for autocomplete options
    axios.get('http://localhost:5000/api/erp/stocks')
      .then((response) => {
        setStockOptions(response.data.map(stock => stock.stockName));
      })
      .catch((error) => {
        toast.error('Error fetching stock names!');
        console.log('There was an error fetching stock names!', error);
      });
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleRowCreated = (newRow) => {
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      try {
        const response = await axios.put(`http://localhost:5000/api/erp/stockMovements/${newRow.id}`, newRow);
        if (response.status === 200) {
          const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
          setRows(updatedRows);
          toast.success('Row updated successfully!');
          return newRow;
        } else {
          console.log(`Failed to update row: ${response.statusText}`);
        }
      } catch (error) {
        console.log('There was an error updating the row!', error);
        if (error.response && error.response.data && error.response.data.error) {
          if (error.response.data.error.includes('Foreign key constraint violation')) {
            toast.error('Foreign key constraint violation: the referenced key does not exist.');
          } else {
            toast.error(error.response.data.error);
          }
        } else {
          toast.error('There was an error updating the row!');
        }
      }
    }
    return oldRow;
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
    try {
      axios.delete(`http://localhost:5000/api/erp/stockMovements/${id}`);
    } catch (error) {
      console.log(error);
      toast.error('Error deleting row')
    }
    toast.success('Row deleted successfully!');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, editable: false },
    {
      field: 'stockName',
      headerName: 'Parça Adı',
      width: 120,
      editable: true,
      renderEditCell: (params) => (
        <Autocomplete
          options={stockOptions}
          value={params.value || ''}
          onChange={(event, newValue) => params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue })}
          renderInput={(params) => <TextField {...params} />}
          style={{ width: 200 }}
        />
      ),
    },
    {
      field: 'movementType',
      headerName: 'Hareket Tipi',
      width: 150,
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Adet',
      width: 100,
      editable: true,
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
      field: 'requested',
      headerName: 'Talep Edilen',
      width: 100,
      editable: true,
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
      field: 'movement',
      headerName: 'Hareket',
      width: 120,
      editable: true,
    },
    {
      field: 'boxQuantity',
      headerName: 'Kutu Adet',
      width: 100,
      editable: true,
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
      field: 'need',
      headerName: 'İhtiyaç',
      width: 100,
      editable: true,
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
      field: 'date',
      headerName: 'Tarih',
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
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Button
        onClick={handleModalOpen}
        variant="contained"
        sx={mainButtonStyle}
      >
        YENİ STOK HAREKETİ EKLE
      </Button>

      <NewStockMovementModal
        open={isModalOpen}
        onClose={handleModalClose}
        onRowCreated={handleRowCreated}
      />

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        loading={loading}
        getRowId={(row) => row.id}
        processRowUpdate={handleProcessRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}  // Enable the new editing API
      />
    </Box>
  );
};

export default StockMovementTable;
