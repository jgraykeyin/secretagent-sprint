const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'topsecret',
    password: 'keyinclass',
    port: 5433,
});


const getMessages = (request, response) => {

    console.log("Normal");

    // Select the most recent message from the database
    pool.query('SELECT * FROM messages ORDER BY id DESC LIMIT 1', (error, results) => {
        if (error) {
            throw error
        }

        if (results.rows[0]) {

            // Delete the selected message from the database
            pool.query('DELETE FROM messages WHERE id=$1', [results.rows[0]["id"]], (error, results) => {
                if (error) {
                    throw error;
                }
                console.log("Deleted the message!");
            });

            // Display the message
            console.log(results.rows);
            response.status(200).json(results.rows);
        } else {
            let errmsg = {
                "message":"No Messages Left",
                "agent_id":99
            }
            response.status(200).json(errmsg);
        }

    });
}

// TODO: Combine this with previous getMessage by using a prop variable
const getMessagesReverse = (request, response) => {
    console.log("Reverse")

    // Select the oldest message from the database
    pool.query('SELECT * FROM messages ORDER BY id ASC LIMIT 1', (error, results) => {
        if (error) {
            throw error;
        }
        
        if (results.rows[0]) {

            // Delete the selected message from the database
            pool.query('DELETE FROM messages WHERE id=$1', [results.rows[0]["id"]], (error, results) => {
                if (error) {
                    throw error;
                }
                console.log("Deleted the message!");
            });

            // Display the message
            console.log(results.rows);
            response.status(200).json(results.rows);
        } else {
            let errmsg = {
                "message":"No Messages Left",
                "agent_id":99
            }
            response.status(200).json(errmsg);
        }
    });
}


const createMessage = (request, response) => {
    const { agent, message } = request.body;

    if (agent && message) {
        pool.query('INSERT INTO messages (message,agent_id) VALUES ($1,$2)', [message, agent], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send('Message added');
        });
    }

}


module.exports = {
    createMessage,
    getMessages,
    getMessagesReverse
}