const express = require('express');
const app = express();

const cors = require('cors')

app.use(cors())

// GET route
app.get('/api', (req, res) => {
    //res.send('Hello, world!');
    res.json({ "users": ["userOne", "UserTwo"] });
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
