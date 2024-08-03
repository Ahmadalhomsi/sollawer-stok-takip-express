import React from 'react'
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import CustomerTable from '../components/Tables/CustomerTable';
import { Typography } from '@mui/material';

const CustomerPage = () => {



    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Müşteri İşlemleri
            </Typography>
            <CustomerTable />

        </div>
    )
};

export default CustomerPage;