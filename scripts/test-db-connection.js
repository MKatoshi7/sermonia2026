const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
    console.log('Testing database connection...');
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ DATABASE_URL is not defined in .env');
        return;
    }

    console.log(`URL found (starts with): ${connectionString.substring(0, 10)}...`);

    try {
        const url = new URL(connectionString);
        console.log(`Protocol: ${url.protocol}`);
        console.log(`Host: ${url.hostname}`);
        console.log(`Port: ${url.port}`);
        console.log(`User: ${url.username}`);
        console.log(`Database: ${url.pathname}`);
        console.log(`Params: ${url.search}`);
    } catch (e) {
        console.error('Invalid URL format');
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false } // Force SSL with rejectUnauthorized: false
    });

    try {
        const client = await pool.connect();
        console.log('✅ Successfully connected to PostgreSQL via pg driver');
        const res = await client.query('SELECT NOW()');
        console.log('Time from DB:', res.rows[0].now);
        client.release();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        if (err.code) console.error('Error code:', err.code);
    } finally {
        await pool.end();
    }
}

testConnection();
