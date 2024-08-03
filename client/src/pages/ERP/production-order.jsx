// src/pages/OrdersPage.js

import React from 'react';
import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';

import ProductionOrderTable from '../../components/ERP/Tables/ProductionOrderTable';
import { Typography } from '@mui/material';


const ERPproductionOrderPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />

            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Üretim Emri işlemleri
            </Typography>

            <ProductionOrderTable />

        </div>
    );
};

export default ERPproductionOrderPage;
