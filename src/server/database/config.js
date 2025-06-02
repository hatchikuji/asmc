import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'site_streamingSwann',
    waitForConnections: true,
    enableKeepAlive: true,
    password: 'password',
    database: 'site_streamingSwann',
});

export const accessSecret = 'projetpersosecret';

export default { db, accessSecret };

