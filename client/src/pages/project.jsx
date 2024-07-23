import React from 'react'
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import ProjectTable from '../components/Tables/ProjectTable';


const ProjectPage = () => {



    return (
        <div>

            <TabNavigation tabs={allTabs} />
            <h1>Proje Islemleri</h1>
            <ProjectTable />

        </div>
    )
};

export default ProjectPage;