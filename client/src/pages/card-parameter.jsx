import React from 'react'
import CardParametersTable from '../components/Tables/CardParametersTable';
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';



const CardParameterPage = () => {


    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <h1>Kart Parametre Islemleri</h1>
            <CardParametersTable />

        </div>
    )
};

export default CardParameterPage;