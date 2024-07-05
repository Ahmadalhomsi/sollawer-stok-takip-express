const express = require('express');
const app = express();
const cors = require('cors')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(cors())
app.use(express.json());

// GET route
app.get('/api', (req, res) => { // for test
    //res.send('Hello, world!');
    res.json({ "users": ["userOne", "UserTwo"] });
});




// GET route
app.get('/api/orders', async (req, res) => { // Get all orders
    try {
        const orders = await prisma.trackerOrder.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to create a new user
app.post('/api/orders', async (req, res) => {
    try {
        const {
            orderDate,
            shipmentDate,
            shipmentStatus,
            invoiceStatus,
            invoiceNO,
            projectNO,
            projectName,
            tableCount,
            projectLink,
            company,
            investorName,
            city,
            latitude,
            longitude
        } = req.body;

        console.log("TAAAAAAABLECOUOUUNND");
        console.log(tableCount);

        const newUser = await prisma.trackerOrder.create({
            data: {
                orderDate: new Date(orderDate),          // Ensure proper Date conversion
                shipmentDate: new Date(shipmentDate),    // Ensure proper Date conversion
                shipmentStatus: Boolean(shipmentStatus),
                invoiceStatus: Boolean(invoiceStatus),
                invoiceNO: invoiceNO.trim(),             // Remove extra spaces
                projectNO: projectNO.trim(),
                projectName: projectName.trim(),
                tableCount: parseInt(tableCount, 10),    // Convert tableCount to Integer
                projectLink: projectLink.trim(),         // Remove extra spaces
                company: company.trim(),
                investorName: investorName.trim(),
                city: city.trim(),
                latitude: parseFloat(latitude),          // Convert latitude to Float
                longitude: parseFloat(longitude)         // Convert longitude to Float
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

// PUT route
app.put('/api/orders/:id', async (req, res) => { // Updates without creating new 
    // const { id } = req.params;

    // const id = 0

    // const orderDate = new Date()
    // const shipmentDate = new Date()
    // const shipmentStatus = true
    // const invoiceStatus = false
    // const invoiceNO = "6as854d16asd8"
    // const projectNO = "4A899F1ASWQFQW52"
    // const projectName = "Cupas"
    // const tableCount = 5
    // const projectLink = " https://www.google.com/"
    // const company = "Follsawer"
    // const investorName = "Muhammad"
    // const city = "Damascus"
    // const latitude = 33.5138
    // const longitude = 36.2304

    const {
        id,
        orderDate,
        shipmentDate,
        shipmentStatus,
        invoiceStatus,
        invoiceNO,
        projectNO,
        projectName,
        tableCount,
        projectLink,
        company,
        investorName,
        city,
        latitude,
        longitude
    } = req.body;

    try {
        const user = await prisma.trackerOrder.update({
            where: {
                id: parseInt(id),
            },
            data: {
                orderDate: new Date(orderDate),          // Ensure proper Date conversion
                shipmentDate: new Date(shipmentDate),    // Ensure proper Date conversion
                shipmentStatus: Boolean(shipmentStatus),
                invoiceStatus: Boolean(invoiceStatus),
                invoiceNO: invoiceNO.trim(),             // Remove extra spaces
                projectNO: projectNO.trim(),
                projectName: projectName.trim(),
                tableCount: parseInt(tableCount, 10),    // Convert tableCount to Integer
                projectLink: projectLink.trim(),         // Remove extra spaces
                company: company.trim(),
                investorName: investorName.trim(),
                city: city.trim(),
                latitude: parseFloat(latitude),          // Convert latitude to Float
                longitude: parseFloat(longitude)         // Convert longitude to Float
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route
app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.trackerOrder.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
