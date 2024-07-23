import React from 'react'
import FaultyCardsTable from "../components/Tables/FaultyCardTable";
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';


const FaultyCardPage = () => {


    return (
        <div>
            <TabNavigation tabs={allTabs} />
            <h1>Arizali Kart Islemleri</h1>
            <FaultyCardsTable />

        </div>
    )
};

export default FaultyCardPage;