import React from 'react'
import RedirectButton from "../components/RedirectButton";
import CardTable from "../components/CardTable";



const ControlCardPage = () => {




    return (
        <div>

            <RedirectButton to="/" label="Sipariş İşlemleri" />
            <RedirectButton to="/cardParameter" label="Kart Parametre İşlemleri" />
            <h1>Kart Islemleri</h1>
            <CardTable />

        </div>
    )
};

export default ControlCardPage;