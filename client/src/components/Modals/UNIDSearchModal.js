import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

// src/Modals/UNIDSearchModal.js
const UNIDSearchModal = ({ open, onClose, onSelect }) => {
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open) {
            axios.get('http://localhost:5000/api/controlCards')
                .then((response) => {
                    setCards(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching cards:', error);
                    toast.error('Error fetching cards!');
                });
        }
    }, [open]);

    const handleSelectUNID = (card) => {
        onSelect(card.UNID, card.UNID); // Assuming the card object has a 'name' property
        onClose();
    };

    const filteredCards = cards.filter(card =>
        card.UNID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
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
                <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
                    Select a card by UNID
                </Typography>
                <TextField
                    label="Search UNID"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                {filteredCards.map((card) => (
                    <Button
                        key={card.id}
                        onClick={() => handleSelectUNID(card)}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 1 }}
                    >
                        {card.UNID}
                    </Button>
                ))}
            </Box>
        </Modal>
    );
};

export default UNIDSearchModal;

