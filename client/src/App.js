import React from 'react'



export default function App() {



    const handleClick = () => {
        fetch('http://localhost:5000/api') // Replace '/api/data' with your server endpoint
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



    return (
        <div>App
            <input type="text" placeholder='Message' />
            <button onClick={handleClick}>
                Click Me!
            </button>
        </div>
    )
}
