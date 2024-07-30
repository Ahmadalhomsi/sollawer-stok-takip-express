// src/pages/OrdersPage.js

import React from 'react';

import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';
import StockMovementAnalytics from '../../components/ERP/StockAnalytics';









const ERPanalyticsPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />
            <StockMovementAnalytics />
        </div>
    );
};

export default ERPanalyticsPage;
