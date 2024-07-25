import React from 'react'
import "./App.css";
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import ControlCardPage from './pages/card';
import CardParameterPage from './pages/card-parameter';
import OrdersPage from './pages/order (Main)';
import FaultyCardPage from './pages/faulty-card';
import ExcelImport from './pages/excel-import';
import ExcelExport from './pages/excel-export';
import CustomerPage from './pages/customer';
import ProjectPage from './pages/project';
import ERPstockPage from './pages/ERP/stock';
import ERPstockMovementPage from './pages/ERP/stock-movement';




export default function App() {

    return (
        <div>

            <Routes>
                <Route path='/' element={<OrdersPage />} />
                <Route path='/card' element={<ControlCardPage />} />
                <Route path='/cardParameter' element={<CardParameterPage />} />
                <Route path='/faultyCard' element={<FaultyCardPage />} />
                <Route path='/excelImport' element={<ExcelImport />} />
                <Route path='/excelExport' element={<ExcelExport />} />
                <Route path='/customer' element={<CustomerPage />} />
                <Route path='/project' element={<ProjectPage />} />

                {/* ERP Routes */}
                <Route path='/erp/stock' element={<ERPstockPage />} />
                <Route path='/erp/stockMovement' element={<ERPstockMovementPage />} />

            </Routes>

            <Toaster
                position="top-center"
                reverseOrder={true}
            />

        </div>
    )
}
