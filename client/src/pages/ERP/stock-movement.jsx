// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';
import StockMovementTable from '../../components/ERP/Tables/StockMovementTable';
import { Typography } from '@mui/material';


const ERPstockMovementPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />
            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Stok Hareketleri İşlemleri
            </Typography>
            <StockMovementTable />

        </div>
    );
};

export default ERPstockMovementPage;
