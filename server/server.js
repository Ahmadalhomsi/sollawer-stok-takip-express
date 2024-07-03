const express = require('express');
const app = express();

// GET route
app.get('/', (req, res) => {
    //res.send('Hello, world!');
    res.json({ "users": ["userOne", "UserTwo"] });
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
