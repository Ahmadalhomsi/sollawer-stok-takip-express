import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Typography, Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { autocompleteStyle, mainButtonStyle, modalButtonStyle, modalCloseButtonStyle } from '../../styles';

const EditStockModal = ({ open, onClose, item, onSave }) => {
    const [localItem, setLocalItem] = useState(item);
    const [bills, setBills] = useState([]);

    useEffect(() => {
        // Fetch bills data on mount
        axios.get('http://localhost:5000/api/erp/billsOfProduct')
            .then((response) => {
                setBills(response.data);
            })
            .catch((error) => {
                console.log('There was an error fetching the bills!', error);
            });
    }, []);

    // Synchronize localItem with the incoming item prop
    useEffect(() => {
        setLocalItem(item);
    }, [item]);

    const handleBillChange = (event, value) => {
        setLocalItem({ ...localItem, bill: value });
    };

    const handleSave = () => {
        onSave(localItem);  // Pass updated item to the parent
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="edit-stock-modal-title"
            aria-describedby="edit-stock-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflow: 'auto',
                maxHeight: 'calc(100vh - 100px)',
            }}>
                <Typography id="edit-stock-modal-title" variant="h6" component="h2" mb={2}>
                    Edit Bill
                </Typography>
                <Autocomplete
                    disablePortal
                    options={bills}
                    getOptionLabel={(option) => option.billName}
                    value={localItem.bill}
                    onChange={handleBillChange}
                    sx={[autocompleteStyle, { width: 300, marginBottom: 2 }]}
                    renderInput={(params) => <TextField {...params} label="Bill" />}
                />
                <Box mt={2}>
                    <Button onClick={handleSave} color="primary" variant="contained" sx={modalButtonStyle}>Save</Button>
                    <Button onClick={onClose} color="secondary" variant="contained" sx={[modalCloseButtonStyle, { marginLeft: 2 }]}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditStockModal;
