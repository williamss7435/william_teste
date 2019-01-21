const mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'sql10.freemysqlhosting.net',
    user: 'sql10275139',
    password: 'v7nxdwf97q',
    database: 'sql10275139'
});

module.exports = conn;