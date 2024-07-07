// src/pages/OrdersPage.js

import React from 'react';
import TabNavigation from '../components/TabNavigation';
import OrderTrackerTable from '../components/OrderTrackerTable';

const OrdersPage = () => {
    const tabs = [
        { label: 'Siparişler', path: '/' },
        { label: 'Kart İşlemleri', path: '/card' },
        { label: 'Kart Parametre İşlemleri', path: '/cardParameter' },
        // Add more tabs as needed
    ];

    return (
        <div>
            <TabNavigation tabs={tabs} />
            <h1>Siparişler</h1>
            <OrderTrackerTable />
        </div>
    );
};

export default OrdersPage;
