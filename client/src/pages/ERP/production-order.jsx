// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';

import ProductionOrderTable from '../../components/ERP/Tables/ProductionOrderTable';





const ERPproductionOrderPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />

                <h1>Uretim Emri islemleri</h1>

            <ProductionOrderTable />

        </div>
    );
};

export default ERPproductionOrderPage;
