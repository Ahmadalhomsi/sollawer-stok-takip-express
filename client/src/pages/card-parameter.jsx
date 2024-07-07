import React from 'react'
import RedirectButton from "../components/RedirectButton";
import CardParametersTable from '../components/CardParametersTable';



const CardParameterPage = () => {

    return (
        <div>

            <RedirectButton to="/" label="Sipariş İşlemleri" />
            <RedirectButton to="/card" label="Kart İşlemleri" />
            <h1>Kart Parametre Islemleri</h1>
            <CardParametersTable />

        </div>
    )
};

export default CardParameterPage;