const Pool = require('pg').Pool;
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'topsecret',
    password: 'keyinclass',
    port: 5433,
});

fs.readFile('names.json', (err, data) => {
    if (err) throw err;
    let namelist = JSON.parse(data);
    console.log(namelist.data.length);
    
    for (let n=1; n < namelist.data.length; n++) {
        pool.query('INSERT INTO agents (id,codename) VALUES($1, $2)',[n,namelist["data"][n]], (error, results) => {
            if (error) {
                throw error
            }
            // console.log(`${namelist["data"][n]} added`);
        })
    }
    
});

