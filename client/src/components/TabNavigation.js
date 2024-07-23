// src/components/TabNavigation.js

import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabNavigation = ({ tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Tabs
      value={location.pathname}
      onChange={handleChange}
      aria-label="navigation tabs"
    >
      {tabs.map((tab) => (
        <Tab key={tab.path} label={tab.label} value={tab.path}
        sx={{
          ...tab.sx, // Apply custom sx if provided
          '&.Mui-selected': {
            color: tab.sx?.['&.Mui-selected']?.color || '#ffd800', // Change selected tab text color, // Change selected tab text color
          },
          '&:hover': {
            color: tab.sx?.['&:hover']?.color || "#B3B304", // Change text color on hover
          },
        }}
        />
      ))}
    </Tabs>
  );
};

export default TabNavigation;
