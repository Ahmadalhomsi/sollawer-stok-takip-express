const express = require('express');
const app = express();
const cors = require('cors')
const { addDays, isValid, parse } = require('date-fns');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { Prisma } = require('@prisma/client'); // for error handling & Foreign key constraint violation

app.use(cors())
app.use(express.json());

// Orders table

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


//-------------------------------------------------------

// Excel Import
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
                    ...(row['Proje No']?.trim() ? { projectNO: row['Proje No'].trim() } : {})
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

    // Defined outside the loop to pass them to the catch block
    let isUNID = false;
    let UNID = 0;
    let columnsUNID = [];

    try {

        for (let rowIndex = 1; rowIndex < worksheetJson.length; rowIndex++) {
            isUNID = false;
            UNID = 0;
            const row = worksheetJson[rowIndex];

            for (let i = 0; i < row.length; i += 3) { // process each set of 3 columns
                const paramNo = row[i] ? row[i].trim() : '';
                const parameter = row[i + 1] ? row[i + 1].trim() : '';
                const value = row[i + 2] ? row[i + 2].trim() : '';

                const valueCell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: i + 2 })];

                // let UNID = Math.floor(i / 3) + ""; // assign a UNID based on the parameter set index



                if (valueCell && valueCell.s) {
                    console.log("Cell Style Properties:", valueCell.s);

                    if (valueCell.s && valueCell.s.fgColor && valueCell.s.fgColor.rgb) {
                        console.log("Entering color check...");
                        if (valueCell.s.fgColor.rgb === 'FFFF00') { // Yellow color
                            UNID = value + "";
                            isUNID = true;
                            columnsUNID.push(UNID);
                            console.log("Columns Group: " + (i / 3));
                            console.log("UNID set to value due to color match: ", UNID);
                        } else {
                            console.log("Color does not match. fgColor: ", valueCell.s.fgColor.rgb);
                        }
                    } else {
                        console.log("fgColor or fgColor.rgb is undefined");
                    }
                }

                if (paramNo || parameter || value) { // ensure at least one value is present
                    const currentUNID = columnsUNID[Math.floor(i / 3)];

                    console.log(
                        "parameterNO: " + paramNo,
                        "parameter: " + parameter,
                        "value: " + value,
                        "UNID: " + currentUNID
                    );

                    // Upsert to update if exists or create if not
                    await prisma.cardParameter.upsert({
                        where: {
                            UNID_parameter: {
                                UNID: currentUNID,
                                parameter: parameter
                            }
                        },
                        update: {
                            parameterNO: paramNo,
                            value: value
                        },
                        create: {
                            parameterNO: paramNo,
                            parameter: parameter,
                            value: value,
                            UNID: currentUNID
                        }
                    });

                }
            }
        }

        res.status(200).send('File data inserted into database.');
    } catch (err) {
        console.log(err);
        if (isUNID) {
            res.status(400).json({ message: `The provided UNID ${UNID} doesn\'t exist in the referenced table.` });
        }
        else {
            res.status(500).json({ message: `Error inserting data into database. Error: ${err.message}` });
        }

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


//-------------------------------------------------------

// Excel Export
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


//-------------------------------------------------------

// Customers Table
app.get('/api/customers', async (req, res) => { // Get all 
    try {
        const orders = await prisma.customer.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/customers', async (req, res) => { // Endpoint to create a new customer
    try {
        const {
            name,
            companyName,
            email,
            phone,
        } = req.body;

        const newUser = await prisma.customer.create({
            data: {
                name: name.trim(),  // Remove extra spaces
                companyName: companyName.trim(),
                email: email.trim(),
                phone: phone.trim(),
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.put('/api/customers/:id', async (req, res) => { // Updates without creating new 

    const {
        id,
        name,
        companyName,
        email,
        phone,
    } = req.body;

    try {
        const user = await prisma.customer.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: name.trim(),  // Remove extra spaces
                companyName: companyName.trim(),
                email: email.trim(),
                phone: phone.trim(),
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.customer.delete({
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

// Projects Table
app.get('/api/projects', async (req, res) => { // Get all cards
    try {
        const orders = await prisma.project.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/projects', async (req, res) => { // Endpoint to create a card
    console.log("Bingooo");
    try {
        const {
            projectNO,
            tableCount,
            projectLink,
            city,
            latitude,
            longitude,
            EPC,
            customerName,
        } = req.body;

        const newUser = await prisma.project.create({
            data: {
                projectNO: projectNO.trim(),
                tableCount: parseInt(tableCount, 10),
                projectLink: projectLink.trim(),
                city: city.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                EPC: EPC.trim(),
                customerName: customerName.trim(),
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') { // Foreign key constraint violation code in Prisma
                return res.status(400).json({ error: 'Foreign key constraint violation: the referenced key does not exist.' });
            }
        }

        console.log('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.put('/api/projects/:id', async (req, res) => { // Updates without creating new 

    const {
        id,
        projectNO,
        tableCount,
        projectLink,
        city,
        latitude,
        longitude,
        EPC,
        customerName,
    } = req.body;

    try {
        const user = await prisma.project.update({
            where: {
                id: parseInt(id),
            },
            data: {
                projectNO: projectNO.trim(),
                tableCount: parseInt(tableCount, 10),
                projectLink: projectLink.trim(),
                city: city.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                EPC: EPC.trim(),
                customerName: customerName.trim(),
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({
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



// ***** ERP *****

// ERP Stock Table

// id           Int      @id @default(autoincrement())
// stockNO      String   @unique
// stockType    String?
// stockStatus  String?
// stockCount   Int
// stockPrice   Float
// stockComment String?

// stockType String
// requested   Int?
// boxQuantity Int?
// need        Int?

app.get('/api/erp/stocks', async (req, res) => { // Get all cards
    try {
        const orders = await prisma.stock.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/erp/stocks', async (req, res) => { // Endpoint to create a card
    try {
        const {
            stockName,
            stockType,
            quantity,
            duration,
            // inStock,
            cost,
            // deliveryDate,
            company,
            description,
            photoURL

        } = req.body;

        const newUser = await prisma.stock.create({
            data: {
                stockName: stockName.trim(),
                stockType: stockType.trim(),
                quantity: parseInt(quantity),
                duration: duration.trim(),
                // inStock: parseInt(inStock),
                cost: parseFloat(cost),
                // deliveryDate: deliveryDate.trim(),
                company: company.trim(),
                description: description.trim(),
                photoURL: photoURL,
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.put('/api/erp/stocks/:id', async (req, res) => { // Updates without creating new 

    const {
        id,
        stockName,
        stockType,
        quantity,
        duration,
        // inStock,
        cost,
        // deliveryDate,
        company,
        description,
        photoURL
    } = req.body;

    const photoURLArray = Array.isArray(photoURL) ? photoURL : [photoURL]; // Convert photoURL to an array


    try {
        const user = await prisma.stock.update({
            where: {
                id: parseInt(id),
            },
            data: {
                stockName: stockName.trim(),
                stockType: stockType.trim(),
                quantity: parseInt(quantity),
                duration: duration.trim(),
                // inStock: parseInt(inStock),
                cost: parseFloat(cost),
                // deliveryDate: deliveryDate.trim(),
                company: company.trim(),
                description: description.trim(),
                photoURL: photoURLArray,
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/erp/stocks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.stock.delete({
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

// ERP Stock Movement Table

app.get('/api/erp/stockMovements', async (req, res) => { // Get all cards
    try {
        const orders = await prisma.stockMovement.findMany();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/erp/stockMovements', async (req, res) => {
    try {
        const {
            stockName,
            movementType,
            quantity,
            requested,
            movement,
            boxQuantity,
            need,
            date,
            description,
        } = req.body;

        const newUser = await prisma.stockMovement.create({
            data: {
                stockName: stockName.trim(),
                movementType: movementType.trim(),
                quantity: parseInt(quantity),
                requested: parseInt(requested),
                movement: movement.trim(),
                boxQuantity: parseInt(boxQuantity),
                need: parseInt(need),
                date: new Date(date),
                description: description.trim(),
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') { // Foreign key constraint violation code in Prisma
                return res.status(400).json({ error: 'Foreign key constraint violation: the referenced key does not exist.' });
            }
        }

        console.log('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.put('/api/erp/stockMovements/:id', async (req, res) => { // Updates without creating new 

    const {
        id,
        stockName,
        movementType,
        quantity,
        requested,
        movement,
        boxQuantity,
        need,
        date,
        description,
    } = req.body;


    try {
        const user = await prisma.stockMovement.update({
            where: {
                id: parseInt(id),
            },
            data: {
                stockName: stockName.trim(),
                movementType: movementType.trim(),
                quantity: parseInt(quantity),
                requested: parseInt(requested),
                movement: movement.trim(),
                boxQuantity: parseInt(boxQuantity),
                need: parseInt(need),
                date: new Date(date),
                description: description.trim(),
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/erp/stockMovements/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.stockMovement.delete({
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

// ERP Bill Of Product Table

app.get('/api/erp/billsOfProduct', async (req, res) => { // Get all cards
    try {
        const orders = await prisma.billOfProduct.findMany({
            include: {
                items: {
                    include: {
                        stock: true
                    }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/erp/billsOfProduct', async (req, res) => { // Endpoint to create a card
    const { billName, billDate, description, items } = req.body;
    try {
        const billOfProduct = await prisma.billOfProduct.create({
            data: {
                billName,
                billDate: new Date(billDate),
                description,
                items: {
                    create: items.map(item => ({
                        stockId: parseInt(item.stockId),
                        quantity: parseInt(item.quantity),
                    })),
                },
            },
            include: { items: { include: { stock: true } } }, // Include stock information
        });
        res.json(billOfProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create Bill of Product' });
    }
});

app.put('/api/erp/billsOfProduct/:id', async (req, res) => {
    const { id, billName, billDate, description, items } = req.body;
    try {
        // Update the BillOfProduct and delete existing items in a transaction
        const updatedBill = await prisma.$transaction(async (prisma) => {
            const bill = await prisma.billOfProduct.update({
                where: { id: parseInt(id) },
                data: {
                    billName: billName.trim(),
                    billDate: new Date(billDate),
                    description: description.trim(),
                },
                include: { items: { include: { stock: true } } },
            });

            await prisma.billOfProductItem.deleteMany({
                where: { billOfProductId: parseInt(id) },
            });

            const newItems = items.map(item => ({
                quantity: parseInt(item.quantity),
                stockId: item.stock.id,
                billOfProductId: parseInt(id),
            }));

            await prisma.billOfProductItem.createMany({ data: newItems });

            return bill;
        });

        // Fetch updated BillOfProduct with items
        const result = await prisma.billOfProduct.findUnique({
            where: { id: parseInt(id) },
            include: { items: { include: { stock: true } } },
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/erp/billsOfProduct/:id', async (req, res) => {
    const { id } = req.params;
    console.log("-------------------------------");
    console.log("Deleting ID: " + id);
    try {
        // // First, delete the associated items
        // await prisma.billOfProductItem.deleteMany({
        //     where: {
        //         billOfProductId: parseInt(id), // Assuming the foreign key in items is named billOfProductId
        //     },
        // });

        // Then, delete the BillOfProduct
        await prisma.billOfProduct.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.json({ message: 'Bill of Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//-------------------------------------------------------

// // Fetch items for a Bill of Product
// app.get('api/erp/:billOfProductId/items', async (req, res) => {
//     const { billOfProductId } = req.params;
//     try {
//         const items = await prisma.billOfProductItem.findMany({
//             where: { billOfProductId: parseInt(billOfProductId) },
//             include: { stock: true },
//         });
//         res.json(items);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch items' });
//     }
// });




// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
