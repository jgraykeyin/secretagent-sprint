const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
let path = require('path')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Make sure the public folder can be accessed for HTML & CSS
app.use('/public', express.static('public'));

// Main route to display the frontend
app.get('/', (request, response) => {
    response.sendFile('index.html', { root: path.join(__dirname, './public/') });
});

// Create a new message
app.post('/send', db.createMessage);

app.get('/read', db.getMessages);

app.get('/old', db.getMessagesReverse);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});