// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';
import OrderTrackerTable from '../../components/Tables/OrderTrackerTable';


const ERPstockPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />
            <h1>ERP Stock</h1>
            <OrderTrackerTable />

        </div>
    );
};

export default ERPstockPage;
