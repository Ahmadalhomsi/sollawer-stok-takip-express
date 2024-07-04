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
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.trackerOrder.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST route
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await prisma.trackerOrder.create({
            data: {
                name,
                email,
            },
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT route
app.put('/api/users/:id', async (req, res) => { // Updates without creating new 
    // const { id } = req.params;
    const { name, email } = req.body;
    const id = 0

    const orderDate = new Date()
    const shipmentDate = new Date()
    const shipmentStatus = true
    const invoiceStatus = false
    const invoiceNO = "6as854d16asd8"
    const projectNO = "4A899F1ASWQFQW52"
    const projectName = "Cupas"
    const tableCount = 5
    const projectLink=" https://www.google.com/"
    const company = "Follsawer"
    const investorName = "Muhammad"
    const city = "Damascus"
    const latitude = 33.5138
    const longitude = 36.2304
    



    try {
        const user = await prisma.trackerOrder.update({
            where: {
                id: parseInt(id),
            },
            data: {
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
                longitude,
            },
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route
app.delete('/api/users/:id', async (req, res) => {
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
