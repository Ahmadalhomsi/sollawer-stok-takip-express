// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';
import StockTable from '../../components/ERP/Tables/StockTable';
import { Typography } from '@mui/material';




const ERPstockPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />

            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Stok İşlemleri
            </Typography>
            
            <StockTable />

        </div>
    );
};

export default ERPstockPage;
