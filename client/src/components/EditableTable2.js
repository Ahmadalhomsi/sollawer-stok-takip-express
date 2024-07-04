// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Link, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const EditableTable = () => {
  const [rows, setRows] = useState([]);
  const [editIdx, setEditIdx] = useState(-1);
  const [editRow, setEditRow] = useState({});
  const [loading, setLoading] = useState(true);

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

  const columns = [
    { field: 'orderDate', headerName: 'Order Date', width: 180, renderCell: (params) => new Date(params.value).toLocaleString() },
    { field: 'shipmentDate', headerName: 'Shipment Date', width: 180, renderCell: (params) => new Date(params.value).toLocaleString() },
    { field: 'shipmentStatus', headerName: 'Shipment Status', width: 150, renderCell: (params) => params.row.id === editIdx ? (
      <Checkbox
        name="shipmentStatus"
        checked={editRow.shipmentStatus}
        onChange={handleChange}
      />
    ) : params.value ? 'Yes' : 'No' },
    { field: 'invoiceStatus', headerName: 'Invoice Status', width: 150, renderCell: (params) => params.row.id === editIdx ? (
      <Checkbox
        name="invoiceStatus"
        checked={editRow.invoiceStatus}
        onChange={handleChange}
      />
    ) : params.value ? 'Yes' : 'No' },
    { field: 'invoiceNO', headerName: 'Invoice No', width: 150, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="invoiceNO"
        value={editRow.invoiceNO}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'projectNO', headerName: 'Project No', width: 150, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="projectNO"
        value={editRow.projectNO}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'projectName', headerName: 'Project Name', width: 150, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="projectName"
        value={editRow.projectName}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'tableCount', headerName: 'Table Count', width: 130, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="tableCount"
        value={editRow.tableCount}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'projectLink', headerName: 'Project Link', width: 200, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="projectLink"
        value={editRow.projectLink}
        onChange={handleChange}
      />
    ) : (
      <Link href={params.value} target="_blank" rel="noopener noreferrer">
        {params.value}
      </Link>
    )},
    { field: 'company', headerName: 'Company', width: 150, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="company"
        value={editRow.company}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'investorName', headerName: 'Investor Name', width: 150, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="investorName"
        value={editRow.investorName}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'city', headerName: 'City', width: 120, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        name="city"
        value={editRow.city}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'latitude', headerName: 'Latitude', width: 130, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        type="number"
        name="latitude"
        value={editRow.latitude}
        onChange={handleChange}
      />
    ) : params.value },
    { field: 'longitude', headerName: 'Longitude', width: 130, renderCell: (params) => params.row.id === editIdx ? (
      <TextField
        type="number"
        name="longitude"
        value={editRow.longitude}
        onChange={handleChange}
      />
    ) : params.value },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
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
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        loading={loading}
        getRowId={(row) => row.id}
        
      />
    </Box>
  );
};

export default EditableTable;
