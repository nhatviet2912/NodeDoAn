var mysql = require('mysql2/promise');
var connection = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '12345678',
        database: 'qlns'
    }
);

// connection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL');
//     // Your code here
//   });

module.exports = connection;