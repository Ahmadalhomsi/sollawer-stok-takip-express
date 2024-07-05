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
        const orders = await prisma.orderTracker.findMany();
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

        const newUser = await prisma.orderTracker.create({
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
        const user = await prisma.orderTracker.update({
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
        await prisma.orderTracker.delete({
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

//-------------------------------------------------------
// Card Operation Table

// GET route
app.get('/api/controlCards', async (req, res) => { // Get all orders
    try {
        const orders = await prisma.controlCard.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to create a new user
app.post('/api/controlCards', async (req, res) => {
    try {
        const {
            parameterNO,
            parameter,
            value,
            orderNumber,
            UNID,
            revisionNO,
            revisionDate,
            manufacturer,
            isActive,
            depotShelfNo,
            projectNO,
        } = req.body;

        console.log("TAAAAAAABLECOUOUUNND");
        console.log(tableCount);

        const newUser = await prisma.controlCard.create({
            data: {
                parameterNO: parameterNO.trim(),    // Remove extra spaces
                parameter: parameter.trim(), 
                value: value.trim(), 
                orderNumber: parseInt(orderNumber, 10), 
                UNID: UNID.trim(), 
                revisionNO: revisionNO.trim(),          
                revisionDate: new Date(revisionDate),          // Ensure proper Date conversion
                manufacturer: manufacturer.trim(), 
                isActive: Boolean(isActive),
                depotShelfNo: depotShelfNo.trim(), 
                projectNO: projectNO.trim(), 
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

// PUT route
app.put('/api/controlCards/:id', async (req, res) => { // Updates without creating new 

    const {
        id,
        parameterNO,
        parameter,
        value,
        orderNumber,
        UNID,
        revisionNO,
        revisionDate,
        manufacturer,
        isActive,
        depotShelfNo,
        projectNO,
    } = req.body;

    try {
        const user = await prisma.controlCard.update({
            where: {
                id: parseInt(id),
            },
            data: {
                parameterNO: parameterNO.trim(),    // Remove extra spaces
                parameter: parameter.trim(), 
                value: value.trim(), 
                orderNumber: parseInt(orderNumber, 10), 
                UNID: UNID.trim(), 
                revisionNO: revisionNO.trim(),          
                revisionDate: new Date(revisionDate),          // Ensure proper Date conversion
                manufacturer: manufacturer.trim(), 
                isActive: Boolean(isActive),
                depotShelfNo: depotShelfNo.trim(), 
                projectNO: projectNO.trim(), 
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route
app.delete('/api/controlCards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.controlCard.delete({
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















//-------------------------------------------------------

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
