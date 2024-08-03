import React from 'react'
import CardParametersTable from '../components/Tables/CardParametersTable';
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import { Typography } from '@mui/material';


const CardParameterPage = () => {


    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Kart Parametre İşlemleri
            </Typography>
            <CardParametersTable />

        </div>
    )
};

export default CardParameterPage;