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
        <Tab key={tab.path} label={tab.label} value={tab.path} />
      ))}
    </Tabs>
  );
};

export default TabNavigation;
