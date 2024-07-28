// src/pages/OrdersPage.js

import React from 'react';
import StockAnalytics from '../../components/Tables/ERP/StockAnalytics';
import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';









const ERPanalyticsPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />
            <StockAnalytics />
        </div>
    );
};

export default ERPanalyticsPage;
