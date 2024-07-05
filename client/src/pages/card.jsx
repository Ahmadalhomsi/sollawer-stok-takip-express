import CardTable from "../components/CardTable";



import React from 'react'
import axios from 'axios';
import toast from "react-hot-toast";

// import { Routes, Route } from 'react-router-dom';

import RedirectButton from "../components/RedirectButton";




const ControlCardPage = () => {




    return (
        <div>


            <RedirectButton to="/" label="Sipariş İşlemleri" />
            <h1>Kart Islemleri</h1>
            <CardTable />




        </div>
    )
};

export default ControlCardPage;