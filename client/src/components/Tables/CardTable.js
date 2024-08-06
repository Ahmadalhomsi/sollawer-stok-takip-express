import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewCardModal from '../Modals/NewCardModal';

const CardTable = () => {
  const [rows, setRows] = useState([]);
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
        console.log('There was an error fetching the data!', error);
        setLoading(false);
      });
  }, []);

  const handleRowUpdate = async (newRow, oldRow) => {
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      const dataToUpdate = {
        ...newRow,
        orderNumber: parseInt(newRow.orderNumber, 10),
        revisionDate: new Date(newRow.revisionDate).toISOString(),
      };

      try {
        const response = await axios.put(`http://localhost:5000/api/controlCards/${newRow.id}`, dataToUpdate);
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
      axios.delete(`http://localhost:5000/api/controlCards/${id}`);
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
    { field: 'id', headerName: 'ID', width: 10, editable: false },
    { field: 'orderNumber', headerName: 'Sıra NO', width: 70, editable: true, type: 'number' },
    { field: 'UNID', headerName: 'UNID', width: 100, editable: true },
    { field: 'revisionNO', headerName: 'Revizyon NO', width: 110, editable: true },
    {
      field: 'revisionDate',
      headerName: 'Revizyon Tarihi',
      width: 140,
      editable: true,
      renderCell: (params) => new Date(params.value).toLocaleString(),
      renderEditCell: (params) => (
        <TextField
          style={{ width: 140 }}
          fullWidth
          type="datetime-local"
          name="revisionDate"
          value={params.value ? new Date(params.value).toISOString().slice(0, 16) : ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ),
    },
    { field: 'manufacturer', headerName: 'Üretici', width: 100, editable: true },
    {
      field: 'isActive',
      headerName: 'Aktif/Pasif',
      width: 120,
      editable: true,
      renderCell: (params) => params.value ? 'Aktif' : 'Pasif',
      renderEditCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.checked })}
        />
      ),
    },
    { field: 'depotShelfNo', headerName: 'Depo Raf No', width: 110, editable: true },
    { field: 'projectNO', headerName: 'Proje NO', width: 110, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 164,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.id)} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>

      <Button onClick={handleModalOpen} variant="contained" color="primary" sx={{ marginBottom: 2 }}>
        YENİ KONTROL KARTI EKLE
      </Button>
      <TextField
        label="UNID Filter"
        variant="outlined"
        value={unidFilter}
        onChange={handleUnidFilterChange}
        size='small'
        sx={{ marginBottom: 2, marginRight: 2, marginLeft: 2 }}
      />
      <TextField
        label="Proje NO Filter"
        variant="outlined"
        value={projectNoFilter}
        onChange={handleProjectNoFilterChange}
        size='small'
        sx={{ marginBottom: 2, marginRight: 2 }}
      />


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

      <NewCardModal
        open={isModalOpen}
        onClose={handleModalClose}
        onRowCreated={handleRowCreated}
      />
    </Box>
  );
};

export default CardTable;
