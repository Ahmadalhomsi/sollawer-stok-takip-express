// src/pages/OrdersPage.js
import React from 'react';
import TabNavigation from '../components/TabNavigation';
import OrderTrackerTable from '../components/Tables/OrderTrackerTable';
import { allTabs } from '../components/allTabs';

const OrdersPage = () => {

    return (
        <div>
            <TabNavigation tabs={allTabs} />
            <h1>Siparişler</h1>
            <OrderTrackerTable />

        </div>
    );
};

export default OrdersPage;
