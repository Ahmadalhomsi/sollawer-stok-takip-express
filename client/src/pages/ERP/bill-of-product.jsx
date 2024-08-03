// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';

import BillOfProductTable from '../../components/ERP/Tables/BillOfProductTable';
import { Typography } from '@mui/material';




const ERPbillOfProductPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />

            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Urun Recetesi islemleri
            </Typography>

            <BillOfProductTable />

        </div>
    );
};

export default ERPbillOfProductPage;
