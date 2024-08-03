import React from 'react'
import TabNavigation from '../components/TabNavigation';
import { allTabs } from '../components/allTabs';
import ProjectTable from '../components/Tables/ProjectTable';
import { Typography } from '@mui/material';

const ProjectPage = () => {



    return (
        <div>
            <TabNavigation tabs={allTabs} />

            <Typography variant="h4" fontWeight="bold" style={{ padding: 5 }}>
                Proje İşlemleri
            </Typography>

            <ProjectTable />

        </div>
    )
};

export default ProjectPage;