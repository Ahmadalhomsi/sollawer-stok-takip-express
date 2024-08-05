import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from
  "react-hot-toast";
import NewCustomerModal from '../Modals/NewCustomerModal';

const CustomerTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/customers')
      .then((response) => {
        setRows(response.data.map((row) => ({ ...row, emailLink: `mailto:${row.email}` }))); // Add emailLink property
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log('There was an error fetching the data!', error);
        setLoading(false);
      });
  }, []);

  const handleRowUpdate = async (newRow, oldRow) => {
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      try {
        await axios.put(`http://localhost:5000/api/customers/${newRow.id}`, newRow);
        toast.success("Row updated successfully");
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? newRow : row))
        ); // Update local state
        return newRow;
      } catch (error) {
        toast.error("Failed to update row");
        console.log('Error updating row:', error);

      }
    }
    return oldRow;
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
    try {
      axios.delete(`http://localhost:5000/api/customers/${id}`);
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

  const handleRowCreated
    = (newRow) => {
      setRows((prevRows) => [...prevRows, { ...newRow, emailLink: `mailto:${newRow.email}` }]); // Add emailLink during creation
    };

  const columns = [
    { field: 'id', headerName: 'ID', width: 10, editable: false },
    { field: 'name', headerName: 'Müşteri Adı', width: 220, editable: true },
    { field: 'companyName', headerName: 'Firma', width: 180, editable: true },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      editable: true,
      renderCell: (params) => (
        <Typography component="a" href={params.row.emailLink} target="_blank" rel="noopener noreferrer" variant="body2" underlineColor="none">
          {params.row.email}
        </Typography>
      ),
    },
    { field: 'phone', headerName: 'Telefon Numarası', width: 180, editable: true },
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
      <Button onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
        YENİ MÜŞTERİ EKLE
      </Button>
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

      />
      <NewCustomerModal
        open={isModalOpen}
        onClose={handleModalClose}
        onRowCreated={handleRowCreated}
      />
    </Box>
  );
};

export default CustomerTable;
