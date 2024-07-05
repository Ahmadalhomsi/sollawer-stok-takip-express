import React from 'react'
import axios from 'axios';
import EditableTable from './components/OrderTrackerTable';
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import { Routes, Route } from 'react-router-dom';
import ControlCardPage from './pages/card';
import RedirectButton from './components/RedirectButton';





export default function App() {

    // const success = () =>
    //     toast.success("Successfully registered");

    const handleClick = () => {
        fetch('http://localhost:5000/api') // Replace '/api/data' with your server endpoint
            .then(response => response.json())
            .then(data => {
                // Handle the fetched data here
                console.log('Data from serverXX:');
                console.log(data);
            })
            .catch(error => {
                toast.error(error.message);
                console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                // Handle any errors that occur during the fetch request
                console.log('Error fetching data from serverZZ:');
                console.error(error);
            });
    }

    const getUsers = () => {
        fetch('http://localhost:5000/api/orders') // Replace '/api/data' with your server endpoint
            .then(response => response.json())
            .then(data => {
                // Handle the fetched data here
                console.log('Data from serverXX:');
                console.log(data);
            })
            .catch(error => {
                // Handle any errors that occur during the fetch request
                console.log('Error fetching data from serverZZ:');
                console.error(error);
            });
    }



    const updateUser = async (id, userData) => {
        const url = `http://localhost:5000/api/orders/${id}`;
        try {
            const response = await axios.put(url, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error; // Rethrow for further error handling
        }
    };


    function hangleUpdateUserButton() {
        updateUser(1, { name: 'John Doe', email: '@example.com' });
    }


    const OrdersPage = () => {
        return (
            <>
                <RedirectButton to="/card" label="Kart İşlemleri" />
                <h1>Siparisler</h1>
                <EditableTable />
            </>
        )
    }


    return (
        <div>
            {/* <input type="text" placeholder='Message' /> */}

            {/* <button onClick={handleClick}>
                Click Me!
            </button>

            <button onClick={getUsers}>
                Get users
            </button>


            <button onClick={hangleUpdateUserButton}>
                Update user
            </button> */}




            <Routes>
                <Route path='/card' element={<ControlCardPage />} />
                <Route path='/' element={<OrdersPage />} />


            </Routes>

            <Toaster
                position="top-center"
                reverseOrder={true}
            />



        </div>
    )
}
