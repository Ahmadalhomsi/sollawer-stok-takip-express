import React from 'react'
import RedirectButton from "../components/RedirectButton";
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import CustomerTable from '../components/Tables/CustomerTable';


const CustomerPage = () => {



    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <h1>Musteri Islemleri</h1>
            <CustomerTable />

        </div>
    )
};

export default CustomerPage;