import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, IconButton, TextField, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import NewOrderModal from '../Modals/NewOrderModal';
import toast from "react-hot-toast";
import { useTheme } from '@emotion/react';


const OrderTrackerTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [projectNos, setProjectNos] = useState([]); // State to store project numbers

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then((response) => {
        setRows(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log('There was an error fetching the data!', error);
        setLoading(false);
      });

    // Fetch the list of project numbers
    axios.get('http://localhost:5000/api/projects')
      .then((response) => {
        const projectNumbers = response.data.map((project) => project.projectNO);
        setProjectNos(projectNumbers);
      })
      .catch((error) => {
        toast.error('Failed to fetch project numbers');
        console.log('Error fetching project numbers:', error);
      });
  }, []);

  const handleRowUpdate = async (newRow, oldRow) => {
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      const dataToUpdate = {
        ...newRow,
        orderDate: new Date(newRow.orderDate).toISOString(),
        shipmentDate: new Date(newRow.shipmentDate).toISOString(),
      };

      try {
        const response = await axios.put(`http://localhost:5000/api/orders/${newRow.id}`, dataToUpdate);
        if (response.status === 200) {
          toast.success("Row updated successfully");
          return dataToUpdate;
        } else {
          toast.error(`Failed to update row: ${response.statusText}`);
          return oldRow;
        }
      } catch (error) {
        console.log('There was an error creating the new row!', error);
        if (error.response && error.response.data && error.response.data.error) {
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


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      setRows(rows.filter((row) => row.id !== id));
      toast.success('Row deleted successfully!');
    } catch (error) {
      console.log('Error deleting row:', error);
      toast.error('Error deleting row');
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
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'orderDate',
      headerName: 'Sipariş Tarih',
      width: 140,
      editable: true,
      renderCell: (params) => new Date(params.value).toLocaleString(),
      renderEditCell: (params) => (
        <TextField
          style={{ width: 140 }}
          fullWidth
          type="datetime-local"
          name="orderDate"
          value={params.value ? new Date(params.value).toISOString().slice(0, 16) : ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ),
    },
    {
      field: 'shipmentDate',
      headerName: 'Kargo Tarih',
      width: 140,
      editable: true,
      renderCell: (params) => new Date(params.value).toLocaleString(),
      renderEditCell: (params) => (
        <TextField
          style={{ width: 140 }}
          fullWidth
          type="datetime-local"
          name="shipmentDate"
          value={params.value ? new Date(params.value).toISOString().slice(0, 16) : ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ),
    },
    { field: 'shipmentStatus', headerName: 'Yollanma Durumu', width: 110, editable: true, type: 'boolean' },
    { field: 'invoiceStatus', headerName: 'Fatura Durumu', width: 110, editable: true, type: 'boolean' },
    { field: 'invoiceNO', headerName: 'Fatura NO', width: 120, editable: true },
    {
      field: 'projectNO',
      headerName: 'Proje NO',
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <Autocomplete
          value={params.value || ''}
          onChange={(event, newValue) => params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue })}
          options={projectNos}
          renderInput={(params) => <TextField {...params} />}
          style={{ width: 200 }}
        />
      ),
    },
    { field: 'company', headerName: 'Firma', width: 120, editable: true },
    { field: 'projectName', headerName: 'Proje', width: 110, editable: true },
    { field: 'tableCount', headerName: 'Masa Sayısı', width: 100, editable: true, type: 'number' },
    { field: 'city', headerName: 'Şehir', width: 100, editable: true },
    { field: 'latitude', headerName: 'Enlem', width: 80, editable: true, type: 'number' },
    { field: 'longitude', headerName: 'Boylam', width: 80, editable: true, type: 'number' },
    { field: 'investorName', headerName: 'Yatırımcı İsmi', width: 150, editable: true },
    {
      field: 'projectLink',
      headerName: 'Proje Linki',
      width: 200,
      editable: true,
      renderCell: (params) => {
        const theme = useTheme();
        const linkColor = theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'; // Use a lighter color for dark mode

        return (
          <a href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: linkColor }}>
            {params.value}
          </a>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 164,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.id)} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Button onClick={handleModalOpen} variant="contained" color="primary" style={{ marginBottom: 16 }}>
        YENİ SİPARİŞ EKLE
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        loading={loading}
        getRowId={(row) => row.id}
        processRowUpdate={handleRowUpdate}  // Handle updates
        experimentalFeatures={{ newEditingApi: true }}  // Enable the new editing API
      />
      <NewOrderModal
        open={isModalOpen}
        onClose={handleModalClose}
        onRowCreated={handleRowCreated}
      />
    </Box>
  );
};

export default OrderTrackerTable;
