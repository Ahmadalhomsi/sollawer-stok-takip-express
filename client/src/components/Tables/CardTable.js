import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewCardModal from '../Modals/NewCardModal';

const CardTable = () => {
  const [rows, setRows] = useState([]);
  const [editIdx, setEditIdx] = useState(-1);
  const [editRow, setEditRow] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [unidFilter, setUnidFilter] = useState('');
  const [projectNoFilter, setProjectNoFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/controlCards')
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

  const handleEdit = (params) => {
    setEditIdx(params.id);
    setEditRow(rows.find((row) => row.id === params.id));
  };

  const handleSave = async () => {
    const dataToUpdate = {
      ...editRow,
      orderNumber: parseInt(editRow.orderNumber, 10),
      revisionDate: new Date(editRow.revisionDate).toISOString(),
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/controlCards/${editIdx}`, dataToUpdate);

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
      axios.delete(`http://localhost:5000/api/controlCards/${id}`);
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

  const handleUnidFilterChange = (e) => {
    setUnidFilter(e.target.value);
  };

  const handleProjectNoFilterChange = (e) => {
    setProjectNoFilter(e.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row.UNID?.toLowerCase().includes(unidFilter.toLowerCase()) &&
    row.projectNO?.toLowerCase().includes(projectNoFilter.toLowerCase())
  );

  const columns = [
    {
      field: 'id', headerName: 'ID', width: 10, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="id"
          value={editRow.id}
        />
      ) : params.value
    },
    {
      field: 'orderNumber', headerName: 'Sıra NO', width: 70, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          type='number'
          name="orderNumber"
          value={editRow.orderNumber}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'UNID', headerName: 'UNID', width: 100, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="UNID"
          value={editRow.UNID}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'revisionNO', headerName: 'Revizyon NO', width: 110, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="revisionNO"
          value={editRow.revisionNO}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'revisionDate',
      headerName: 'Revizyon Tarihi',
      width: 140,
      renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          fullWidth
          type="datetime-local"
          name="revisionDate"
          value={new Date(editRow.revisionDate).toISOString().slice(0, 16)}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ) : new Date(params.value).toLocaleString()
    },
    {
      field: 'manufacturer', headerName: 'Üretici', width: 100, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="manufacturer"
          value={editRow.manufacturer}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'isActive', headerName: 'Aktif/Pasif', width: 120, renderCell: (params) => params.row.id === editIdx ? (
        <Checkbox
          name="isActive"
          checked={editRow.isActive}
          onChange={handleChange}
        />
      ) : params.value ? 'Aktif' : 'Pasif'
    },
    {
      field: 'depotShelfNo', headerName: 'Depo Raf No', width: 110, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="depotShelfNo"
          value={editRow.depotShelfNo}
          onChange={handleChange}
        />
      ) : params.value
    },
    {
      field: 'projectNO', headerName: 'Proje NO', width: 110, renderCell: (params) => params.row.id === editIdx ? (
        <TextField
          name="projectNO"
          value={editRow.projectNO}
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
        YENİ KONTROL KARTI EKLE
      </Button>

      <TextField
        label="UNID Filter"
        variant="outlined"
        value={unidFilter}
        onChange={handleUnidFilterChange}
        size='small'
        style={{ marginBottom: 16, marginRight: 25, marginLeft: 10 }}
      />
      <TextField
        label="Proje NO Filter"
        variant="outlined"
        value={projectNoFilter}
        onChange={handleProjectNoFilterChange}
        size='small'
        style={{ marginBottom: 16, marginRight: 35 }}
      />




      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        loading={loading}
        getRowId={(row) => row.id}
      />
      <NewCardModal
        open={isModalOpen}
        onClose={handleModalClose}
        onRowCreated={handleRowCreated}
      />
    </Box>
  );
};

export default CardTable;
