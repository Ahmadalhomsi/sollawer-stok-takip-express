// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';

import StockMovementTable from '../../components/Tables/ERP/StockMovementTable';



const ERPstockMovementPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />
            <h1>Stok Hareketleri İşlemleri</h1>
            <StockMovementTable />

        </div>
    );
};

export default ERPstockMovementPage;
