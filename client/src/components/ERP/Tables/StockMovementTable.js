import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewStockMovementModal from '../../ERP/Modals/NewStockMovementModal';
import DeleteIcon from '@mui/icons-material/Delete';

const StockMovementTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/erp/stockMovements')
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

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleRowCreated = (newRow) => {
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleProcessRowUpdate = async (newRow) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/erp/stockMovements/${newRow.id}`, newRow);
      if (response.status === 200) {
        const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
        setRows(updatedRows);
        toast.success('Row updated successfully!');
        return newRow;
      } else {
        console.error(`Failed to update row: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating row:', error);
    }
    return newRow;
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
    try {
        axios.delete(`http://localhost:5000/api/erp/stockMovements/${id}`);
    } catch (error) {
        console.log(error);
    }
};

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, editable: false },
    {
      field: 'stockName',
      headerName: 'Parça Adı',
      width: 120,
      editable: true,
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
      <Button onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
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
