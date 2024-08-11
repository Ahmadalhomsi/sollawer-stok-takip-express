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
import ERPanalyticsPage from './pages/ERP/analytics';
import ERPbillOfProductPage from './pages/ERP/bill-of-product';
import ERPproductionOrderPage from './pages/ERP/production-order';

import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import logoBlack from './sollawer-logo-black.png';
import logoWhite from './sollawer-logo-white.png';


import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo, useState } from 'react';

function DarkModeToggle({ darkMode, toggleDarkMode }) {
    return (
        <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
    );
}

export default function App() {

    const [darkMode, setDarkMode] = useState(false);
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    // primary: {
                    //     main: darkMode ? '#bb86fc' : '#6200ea',
                    // },
                    secondary: {
                        main: darkMode ? '#481d7b' : '#03a9f4',
                    },
                    background: {
                        default: darkMode ? '#001626' : '#ffffff',
                        paper: darkMode ? '#1e1e1e' : '#ffffff',
                    },
                    text: {
                        primary: darkMode ? '#ffffff' : '#000000',
                    },
                },
            }),
        [darkMode]
    );

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    

    const logo = darkMode ? logoWhite : logoBlack;



    return (
        <div>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <img src={logo} alt="Sollawer Logo" style={{ paddingLeft: 5, width: 120 }} />
                </div>

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
                    <Route path='/erp/billOfProduct' element={<ERPbillOfProductPage />} />
                    <Route path='/erp/productionOrder' element={<ERPproductionOrderPage />} />
                    <Route path='/erp/analytics' element={<ERPanalyticsPage />} />
                </Routes>



                <Toaster
                    position="top-center"
                    reverseOrder={true}
                />


            </ThemeProvider>

        </div>
    )
}
