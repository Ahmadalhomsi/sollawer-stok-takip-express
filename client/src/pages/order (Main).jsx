// src/pages/OrdersPage.js
import React from 'react';
import TabNavigation from '../components/TabNavigation';
import OrderTrackerTable from '../components/Tables/OrderTrackerTable';
import { allTabs } from '../components/allTabs';
import { Typography } from '@mui/material';
const OrdersPage = () => {

    return (
        <div>
            <TabNavigation tabs={allTabs} />
            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Siparişler
            </Typography>
            <OrderTrackerTable />

        </div>
    );
};

export default OrdersPage;
