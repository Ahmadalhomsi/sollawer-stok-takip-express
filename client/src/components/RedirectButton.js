// src/components/RedirectButton.js

import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RedirectButton = ({ to, label }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(to)}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '8px',
        textTransform: 'none',
        margin: '6px',
      }}
    >
      {label}
    </Button>
  );
};

export default RedirectButton;
