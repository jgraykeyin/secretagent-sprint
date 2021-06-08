const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Main route
app.get('/', (request, response) => {
    response.json({
        info: 'Secret agent stuff'
    })
});

// Show all users route
app.get('/users', db.getUsers);

// Show specific user based on ID
app.get('/user:id', db,db.getUserById);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});