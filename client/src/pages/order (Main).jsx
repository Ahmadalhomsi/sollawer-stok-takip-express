import React from 'react'
import RedirectButton from "../components/RedirectButton";
import OrderTrackerTable from '../components/OrderTrackerTable';


const OrdersPage = () => {

    return (
        <div>
            <RedirectButton to="/card" label="Kart İşlemleri" />
            <RedirectButton to="/cardParameter" label="Kart Parametre İşlemleri" />
            <h1>Siparisler</h1>
            <OrderTrackerTable />
        </div>
    )
};

export default OrdersPage;