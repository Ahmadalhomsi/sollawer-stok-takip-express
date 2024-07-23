// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import NewOrderModal from '../Modals/NewOrderModal';
import toast from "react-hot-toast";


const OrderTrackerTable = () => {
  const [rows, setRows] = useState([]);
  const [editIdx, setEditIdx] = useState(-1);
  const [editRow, setEditRow] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then((response) => {
        setRows(response.data);
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
      tableCount: parseInt(editRow.tableCount, 10),   // Convert tableCount to Integer
      orderDate: new Date(editRow.orderDate).toISOString(),  // Ensure proper Date conversion
      shipmentDate: new Date(editRow.shipmentDate).toISOString()  // Ensure proper Date conversion
    };

    try {
      // Await the Axios PUT request
      const response = await axios.put(`http://localhost:5000/api/orders/${editIdx}`, dataToUpdate);

      // Update rows state only if the request is successful
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
      axios.delete(`http://localhost:5000/api/orders/${id}`);
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
      field: 'orderDate',
      headerName: 'Sipariş Tarih',
      width: 140,
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
      field: 'shipmentDate',
      headerName: 'Kargo Tarih',
      width: 140,
      renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          fullWidth
          type="datetime-local"
          name="shipmentDate"
          value={new Date(editRow.shipmentDate).toISOString().slice(0, 16)}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ) : new Date(params.value).toLocaleString()
    },
    {
      field: 'shipmentStatus', headerName: 'Kargo Durumu', width: 120, renderCell: (params) => params.row.id === editIdx ? (
        <Checkbox
          name="shipmentStatus"
          checked={editRow.shipmentStatus}
          onChange={handleChange}
        />
      ) : params.value ? 'Yollandı' : 'Yollanmadı'
    },
    {
      field: 'invoiceStatus', headerName: 'Fatura Durumu', width: 110, renderCell: (params) => params.row.id === editIdx ? (
        <Checkbox
          name="invoiceStatus"
          checked={editRow.invoiceStatus}
          onChange={handleChange}
        />
      ) : params.value ? 'Kesildi' : 'Kesilmedi'
    },
    {
      field: 'invoiceNO', headerName: 'Fatura NO', width: 120, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="invoiceNO"
          value={editRow.invoiceNO}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'projectNO', headerName: 'Proje NO', width: 150, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="projectNO"
          value={editRow.projectNO}
          onChange={handleChange}
        />
      ) : params.value
    },

    {
      field: 'company', headerName: 'Firma', width: 120, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="company"
          value={editRow.company}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'projectName', headerName: 'Proje', width: 110, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="projectName"
          value={editRow.projectName}
          onChange={handleChange}
        />
      ) : params.value
    },

    {
      field: 'tableCount', headerName: 'Masa Sayısı', width: 100, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          type="number"
          name="tableCount"
          value={editRow.tableCount}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'city', headerName: 'Şehir', width: 100, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="city"
          value={editRow.city}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'latitude', headerName: 'Enlem', width: 80, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          type="number"
          name="latitude"
          value={editRow.latitude}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'longitude', headerName: 'Boylam', width: 80, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          type="number"
          name="longitude"
          value={editRow.longitude}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'investorName', headerName: 'Yatırımcı İsmi', width: 150, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="investorName"
          value={editRow.investorName}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'projectLink', headerName: 'Proje Linki', width: 200, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="projectLink"
          value={editRow.projectLink}
          onChange={handleChange}
        />
      ) : (
        <Link href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </Link>
      )
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
        YENİ SİPARİŞ EKLE
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
      <NewOrderModal
        open={isModalOpen}
        onClose={handleModalClose}
        onRowCreated={handleRowCreated}
      />
    </Box>
  );
};

export default OrderTrackerTable;
