const { Client } = require('pg');
require('dotenv').config();

async function manageDB() {
    const currentUrl = process.env.DATABASE_URL;
    if (!currentUrl) {
        console.error('DATABASE_URL not found');
        return;
    }

    // Parse URL to connect to 'postgres' db for administrative tasks
    let adminUrl;
    try {
        const url = new URL(currentUrl);
        // Keep credentials and host, switch DB to 'postgres'
        url.pathname = '/postgres';
        adminUrl = url.toString();
        console.log(`Connecting to admin DB at ${url.host}...`);
    } catch (e) {
        console.error('Invalid URL');
        return;
    }

    const client = new Client({
        connectionString: adminUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to admin DB.');

        // Check if Sermonia2026 exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'Sermonia2026'");
        if (res.rows.length > 0) {
            console.log('Database "Sermonia2026" already exists.');
        } else {
            console.log('Database "Sermonia2026" does not exist. Creating...');
            try {
                await client.query('CREATE DATABASE "Sermonia2026"');
                console.log('Database "Sermonia2026" created successfully.');
            } catch (createError) {
                console.error('Failed to create database:', createError.message);
                // Fallback: maybe we can't create DBs here.
            }
        }
    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await client.end();
    }
}

manageDB();
