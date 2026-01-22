import fs from 'fs';
import path from 'path';
import db from './db';
import dotenv from 'dotenv';

dotenv.config();

async function setup() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql...');
        await db.raw(schemaSql);
        console.log('Schema setup completed successfully.');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await db.destroy();
    }
}

setup();
