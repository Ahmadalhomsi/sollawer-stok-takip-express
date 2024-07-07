import React from 'react'
import RedirectButton from "../components/RedirectButton";
import CardTable from "../components/CardTable";
import TabNavigation from '../components/TabNavigation';


const ControlCardPage = () => {


        const tabs = [
            { label: 'Siparişler', path: '/' },
            { label: 'Kart İşlemleri', path: '/card' },
            { label: 'Kart Parametre İşlemleri', path: '/cardParameter' },

            // Add more tabs as needed
        ];


        return (
            <div>

                <TabNavigation tabs={tabs} />
                <h1>Kart Islemleri</h1>
                <CardTable />

            </div>
        )
    };

    export default ControlCardPage;