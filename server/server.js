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
app.get('/api/controlCards', async (req, res) => { // Get all cards
    try {
        const orders = await prisma.controlCard.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/controlCards', async (req, res) => { // Endpoint to create a card
    try {
        const {
            // parameterNO,
            // parameter,
            // value,
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

app.put('/api/controlCards/:id', async (req, res) => { // Updates without creating new 

    const {
        id,
        // parameterNO,
        // parameter,
        // value,
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

// Card Parameters Table
app.get('/api/cardParameters', async (req, res) => { // Get all cards
    try {
        const orders = await prisma.cardParameter.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/cardParameters', async (req, res) => { // Endpoint to create a card
    try {
        const {
            cardID,
            parameterNO,
            parameter,
            value,
        } = req.body;

        const newUser = await prisma.cardParameter.create({
            data: {
                cardID: cardID.trim(),
                parameterNO: parameterNO.trim(),    // Remove extra spaces
                parameter: parameter.trim(),
                value: value.trim(),
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.put('/api/cardParameters/:id', async (req, res) => { // Updates without creating new 

    const {
        id,
        cardID,
        parameterNO,
        parameter,
        value,
    } = req.body;

    try {
        const user = await prisma.cardParameter.update({
            where: {
                id: parseInt(id),
            },
            data: {
                cardID: cardID.trim(),
                parameterNO: parameterNO.trim(),    // Remove extra spaces
                parameter: parameter.trim(),
                value: value.trim(),
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/cardParameters/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.cardParameter.delete({
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

// Card Parameters Table
app.get('/api/faultyCards', async (req, res) => { // Get all cards
    try {
        const orders = await prisma.faultyCard.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/faultyCards', async (req, res) => { // Endpoint to create a card
    try {
        const {
            cardID,
            servisDate,
            status,
            fault,
            photoURL,
            projectNO,
        } = req.body;

        const newUser = await prisma.faultyCard.create({
            data: {
                cardID: cardID.trim(),
                servisDate: new Date(servisDate),    // Remove extra spaces
                status: status.trim(),
                fault: fault.trim(),
                photoURL: photoURL,
                projectNO: projectNO.trim(),

            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.put('/api/faultyCards/:id', async (req, res) => { // Updates without creating new 

    const {
        cardID,
        servisDate,
        status,
        fault,
        photoURL,
        projectNO,
    } = req.body;

    try {
        const user = await prisma.faultyCard.update({
            where: {
                id: parseInt(id),
            },
            data: {
                cardID: cardID.trim(),
                servisDate: new Date(servisDate),    // Remove extra spaces
                status: status.trim(),
                fault: fault.trim(),
                photoURL: photoURL,
                projectNO: projectNO.trim(),
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/faultyCards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.faultyCard.delete({
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

const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadPath = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadPath);

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize upload variable for multiple files
const upload = multer({ storage: storage });

// Upload route for multiple files
app.post('/upload', upload.array('files', 10), (req, res) => { // allow up to 10 files
  try {
    const filePaths = req.files.map(file => file.path);
    res.send({ message: 'Files uploaded successfully', filePaths });
  } catch (error) {
    res.status(400).send({ error: 'Error uploading files' });
  }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
