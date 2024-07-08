import React from 'react'
import RedirectButton from "../components/RedirectButton";
import CardTable from "../components/CardTable";
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';


const ControlCardPage = () => {



    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <h1>Kart Islemleri</h1>
            <CardTable />

        </div>
    )
};

export default ControlCardPage;