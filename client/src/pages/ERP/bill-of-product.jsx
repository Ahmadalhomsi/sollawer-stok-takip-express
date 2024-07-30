// src/pages/OrdersPage.js

import React from 'react';



import { ERPallTabs } from '../../components/ERP/ERPallTabs';
import TabNavigation from '../../components/TabNavigation';

import BillOfProductTable from '../../components/ERP/Tables/BillOfProductTable';





const ERPbillOfProductPage = () => {

    return (
        <div>
            <TabNavigation tabs={ERPallTabs} />

                <h1>Urun Recetesi islemleri</h1>

            <BillOfProductTable />

        </div>
    );
};

export default ERPbillOfProductPage;
