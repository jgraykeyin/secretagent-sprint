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
        response.status(200).json(results.row);
    });
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM agents WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).json(results.rows);
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
    createUser
}