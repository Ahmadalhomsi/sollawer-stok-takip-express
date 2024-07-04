// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import NewRowModal from './NewRowModal';

const EditableTable = () => {
  const [rows, setRows] = useState([]);
  const [editIdx, setEditIdx] = useState(-1);
  const [editRow, setEditRow] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then((response) => {
        setRows(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (params) => {
    setEditIdx(params.id);
    setEditRow(rows.find((row) => row.id === params.id));
  };

  const handleSave = () => {
    const updatedRows = rows.map((row) => (row.id === editIdx ? editRow : row));
    setRows(updatedRows);
    setEditIdx(-1);
  };

  const handleCancel = () => {
    setEditIdx(-1);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
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
    { field: 'orderDate', headerName: 'Sipariş Tarih', width: 100, renderCell: (params) => new Date(params.value).toLocaleString() },
    { field: 'shipmentDate', headerName: 'Kargo Tarih', width: 100, renderCell: (params) => new Date(params.value).toLocaleString() },
    {
      field: 'shipmentStatus', headerName: 'Kargo Durumu', width: 120, renderCell: (params) => params.row.id === editIdx ? (
        <Checkbox
          name="shipmentStatus"
          checked={editRow.shipmentStatus}
          onChange={handleChange}
        />
      ) : params.value ? 'Yes' : 'No'
    },
    {
      field: 'invoiceStatus', headerName: 'Fatura Durumu', width: 110, renderCell: (params) => params.row.id === editIdx ? (
        <Checkbox
          name="invoiceStatus"
          checked={editRow.invoiceStatus}
          onChange={handleChange}
        />
      ) : params.value ? 'Yes' : 'No'
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
        Add New Row
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
      <NewRowModal
        open={isModalOpen}
        onClose={handleModalClose}
        onRowCreated={handleRowCreated}
      />
    </Box>
  );
};

export default EditableTable;
