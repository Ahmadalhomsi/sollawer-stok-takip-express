import React from 'react'
import CardTable from "../components/Tables/CardTable";
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import { Typography } from '@mui/material';

const ControlCardPage = () => {



    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Kart İşlemleri
            </Typography>
            <CardTable />

        </div>
    )
};

export default ControlCardPage;