import React from 'react'
import "./App.css";
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import ControlCardPage from './pages/card';
import CardParameterPage from './pages/card-parameter';
import OrdersPage from './pages/order (Main)';
import FaultyCardPage from './pages/faulty-card';
import FileUpload from './pages/excel-import';



export default function App() {

    return (
        <div>

            <Routes>
                <Route path='/' element={<OrdersPage />} />
                <Route path='/card' element={<ControlCardPage />} />
                <Route path='/cardParameter' element={<CardParameterPage />} />
                <Route path='/faultyCard' element={<FaultyCardPage />} />
                <Route path='/fileUpload' element={<FileUpload />} />

            </Routes>

            <Toaster
                position="top-center"
                reverseOrder={true}
            />

        </div>
    )
}
