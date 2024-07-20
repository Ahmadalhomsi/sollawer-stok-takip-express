import React from 'react'
import RedirectButton from "../components/RedirectButton";
import CardTable from "../components/Tables/CardTable";
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';


const ProjectPage = () => {



    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <h1>Proje Islemleri</h1>
            <CardTable />

        </div>
    )
};

export default ProjectPage;