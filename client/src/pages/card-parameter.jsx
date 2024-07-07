import React from 'react'
import RedirectButton from "../components/RedirectButton";
import CardParametersTable from '../components/CardParametersTable';
import TabNavigation from '../components/TabNavigation';


const CardParameterPage = () => {
    const tabs = [
        { label: 'Siparişler', path: '/' },
        { label: 'Kart İşlemleri', path: '/card' },
        { label: 'Kart Parametre İşlemleri', path: '/cardParameter' },

        // Add more tabs as needed
    ];
    return (
        <div>

            <TabNavigation tabs={tabs} />
            <h1>Kart Parametre Islemleri</h1>
            <CardParametersTable />

        </div>
    )
};

export default CardParameterPage;