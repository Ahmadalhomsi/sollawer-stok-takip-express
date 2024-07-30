// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';
import StockTable from '../../components/ERP/Tables/StockTable';





const ERPstockPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />
            <h1>Stok İşlemleri</h1>
            <StockTable />

        </div>
    );
};

export default ERPstockPage;
