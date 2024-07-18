const express = require('express');
const app = express();
const cors = require('cors')
const { addDays, isValid } = require('date-fns');

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


// Control Cards Table
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
            orderNumber,
            UNID,
            revisionNO,
            revisionDate,
            manufacturer,
            isActive,
            depotShelfNo,
            projectNO,
        } = req.body;

        const newUser = await prisma.controlCard.create({
            data: {
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
            UNID,
            parameterNO,
            parameter,
            value,
        } = req.body;

        const newUser = await prisma.cardParameter.create({
            data: {
                UNID: UNID.trim(),
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
        UNID,
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
                UNID: UNID.trim(),
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

// Faulty Cards Table
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
            UNID,
            servisDate,
            status,
            fault,
            photoURL,
            projectNO,
        } = req.body;

        const newUser = await prisma.faultyCard.create({
            data: {
                UNID: UNID.trim(),
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
        id,
        UNID,
        servisDate,
        status,
        fault,
        photoURL,
        projectNO,
    } = req.body;

    const photoURLArray = Array.isArray(photoURL) ? photoURL : [photoURL]; // Convert photoURL to an array

    try {
        const user = await prisma.faultyCard.update({
            where: {
                id: parseInt(id),
            },
            data: {
                UNID: UNID.trim(),
                servisDate: new Date(servisDate),    // Remove extra spaces
                status: status.trim(),
                fault: fault.trim(),
                photoURL: photoURLArray,
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
app.post('/uploadMulti', upload.array('files', 10), (req, res) => { // allow up to 10 files
    try {
        const filePaths = req.files.map(file => file.path);
        res.send({ message: 'Files uploaded successfully', filePaths });
    } catch (error) {
        res.status(400).send({ error: 'Error uploading files' });
    }
});

const XLSX = require('xlsx');

app.post('/api/upload', upload.single('file'), (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const fileName = file.filename;

    const filePath = path.join('uploads', file.filename);

    fs.renameSync(file.path, filePath);


    console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");

    console.log(fileName);

    res.json({ fileName });
});


app.post('/uploadControlCards', upload.single('file'), async (req, res) => { // xlsx file upload

    console.log("Uploading...");

    const { sheetPage } = req.body;

    console.log("SHEET PAGE: " + sheetPage);


    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[sheetPage];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("*******************************************");
    console.log(worksheet);
    console.log("END OF TOTAL");


    // Function to convert Excel serial number to JavaScript Date
    const excelSerialToDate = (serial) => {
        const excelEpoch = new Date(1899, 11, 30); // Excel epoch starts at 1899-12-30
        return addDays(excelEpoch, serial);
    };


    try {
        for (const row of worksheet) {

            const revisionDate = excelSerialToDate(row['Revizyon Tarihi']);

            if (!isValid(revisionDate)) {
                console.error(`Invalid date format for row: ${JSON.stringify(row)}`);
                continue; // Skip this row if the date is invalid
            }

            await prisma.controlCard.create({
                data: {
                    orderNumber: parseInt(row['Sıra No'], 10),
                    UNID: row['UNID'].trim(),
                    revisionNO: row['Revizyon No'].trim(),
                    revisionDate: revisionDate,
                    manufacturer: row['Üretici'].trim(),
                    isActive: Boolean(row['Aktif/Pasif']),
                    depotShelfNo: row['Depor Raf No'].trim(),
                    projectNO: row['Proje No']?.trim() || "",
                }
            });

            console.log("orderNumber: " + parseInt(row['Sıra No'], 10),
                "UNID: " + row["UNID"].trim(),
                "revisionNO: " + row['Revizyon No'].trim(),
                "revisionDate: " + revisionDate,
                "manufacturer: " + row['Üretici'].trim(),
                "isActive: " + Boolean(row['Aktif/Pasif']),
                "depotShelfNo: " + row['Depor Raf No'].trim(),
                "projectNO: " + row['Proje No']?.trim());
        }

        res.status(200).send('File data inserted into database.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error inserting data into database.');
    }
});

app.post('/uploadCardParameters', upload.single('file'), async (req, res) => {
    console.log("Uploading...");

    const { sheetPage } = req.body;
    console.log("SHEET PAGE: " + sheetPage);

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const workbook = XLSX.readFile(req.file.path, { cellStyles: true });
    const sheetName = workbook.SheetNames[sheetPage];
    const worksheet = workbook.Sheets[sheetName];

    const worksheetJson = XLSX.utils.sheet_to_json(worksheet, { raw: false, header: 1 });
    console.log("*******************************************");
    console.log(worksheetJson);
    console.log("END OF TOTAL");

    try {
        for (let rowIndex = 1; rowIndex < worksheetJson.length; rowIndex++) {
            const row = worksheetJson[rowIndex];

            for (let i = 0; i < row.length; i += 3) { // process each set of 3 columns
                const paramNo = row[i] ? row[i].trim() : '';
                const parameter = row[i + 1] ? row[i + 1].trim() : '';
                const value = row[i + 2] ? row[i + 2].trim() : '';

                const valueCell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: i + 2 })];

                // let UNID = Math.floor(i / 3) + ""; // assign a UNID based on the parameter set index
                let UNID = 0;

                if (valueCell && valueCell.s) {
                    console.log("Cell Style Properties:", valueCell.s);

                    if (valueCell.s && valueCell.s.fgColor && valueCell.s.fgColor.rgb) {
                        console.log("Entering color check...");
                        if (valueCell.s.fgColor.rgb === 'FFFF00') { // Yellow color
                            UNID = value + "";
                            console.log("UNID set to value due to color match: ", UNID);
                        } else {
                            console.log("Color does not match. fgColor: ", valueCell.s.fgColor.rgb);
                        }
                    } else {
                        console.log("fgColor or fgColor.rgb is undefined");
                    }
                }

                if (paramNo || parameter || value) { // ensure at least one value is present
                    console.log(
                        "parameterNO: " + paramNo,
                        "parameter: " + parameter,
                        "value: " + value,
                        "UNID: " + UNID
                    );

                    // Create the data object conditionally
                    const data = {
                        parameterNO: paramNo,
                        parameter: parameter,
                        value: value,
                        ...(UNID !== 0 && { UNID: UNID }) // Only include UNID if it is not zero
                    };

                    await prisma.cardParameter.create({
                        data: data
                    });
                }
            }
        }

        res.status(200).send('File data inserted into database.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error inserting data into database.');
    }
});

const uploadsDir = path.join(__dirname, 'uploads'); // Define the uploads directory

app.get('/uploads', (req, res) => { // Get all uploaded files
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        res.send(files);
    });
});

app.delete('/deleteFile', async (req, res) => {
    try {

        var { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({ error: 'Filename is required' });
        }


        filePath = "uploads/" + filePath


        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(200).json({ message: 'File deleted successfully' });

        }

        // Remove the file
        await fs.remove(filePath);

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'File deletion failed' });
    }
});




app.get('/exportData', async (req, res) => {
    const { table } = req.query;

    if (!table) {
        return res.status(400).send('Table name is required.');
    }

    let data;
    try {
        if (table === 'Siparişler') {
            data = await prisma.OrderTracker.findMany();
        } else if (table === 'Kontrol kartlar') {
            data = await prisma.ControlCard.findMany();
            data = data.map(item => ({
                'Sıra No': item.orderNumber,
                'UNID': item.UNID,
                'Revizyon No': item.revisionNO,
                'Revizyon Tarihi': item.revisionDate.toISOString().split('T')[0],
                'Üretici': item.manufacturer,
                'Aktif/Pasif': item.isActive ? 'Aktif' : 'Pasif',
                'Depo Raf No': item.depotShelfNo,
                'Proje No': item.projectNO
            }));
        } else if (table === 'Kart parametreler') {
            data = await prisma.CardParameter.findMany();
            data = data.map(item => ({
                'Parametre No': item.parameterNO,
                'Parametre': item.parameter,
                'Değer': item.value
            }));
        } else {
            return res.status(400).send('Invalid table name.');
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, table);

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Sanitize filename to avoid invalid characters
        const sanitizedTable = table.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        res.setHeader('Content-Disposition', `attachment; filename=${sanitizedTable}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error exporting data.');
    }
});









// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
