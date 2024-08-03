import React from 'react'
import FaultyCardsTable from "../components/Tables/FaultyCardTable";
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import { Typography } from '@mui/material';

const FaultyCardPage = () => {


    return (
        <div>
            <TabNavigation tabs={allTabs} />
            
            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Arizali Kart İşlemleri
            </Typography>

            <FaultyCardsTable />

        </div>
    )
};

export default FaultyCardPage;