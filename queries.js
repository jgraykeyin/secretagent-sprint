const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'topsecret',
    password: 'keyinclass',
    port: 5433,
});

const getUsers = (request, response) => {
    pool.query('SELECT * FROM agents ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        console.log('Show all users');
        response.status(200).json(results.rows);
    });
}

const getUserById = (request, response) => {
    console.log("Getting USER");
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM agents WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).json(results.rows);
    });
}

const createMessage = (request, response) => {
    const { agent, message } = request.body;

    pool.query('INSERT INTO messages (message,agent_id) VALUES ($1,$2)', [message, agent], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send('Message added');
    });
}

const createUser = (request, response) => {
    const { codename } = request.body;

    pool.query('INSERT INTO agents (codename) VALUES ($1)', [codename], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    createMessage
}