import knex from 'knex';
import dotenv from 'dotenv';
const knexConfig = require('../../../knexfile');
import logger from './Logger';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const connectionConfig = knexConfig[environment];

const db = knex(connectionConfig);

db.on('query', (query) => {
    logger.info('SQL Query', {
        sql: query.sql,
        bindings: query.bindings
    });
});

db.on('query-error', (error, obj) => {
    logger.error('SQL Error', {
        error: error.message,
        sql: obj.sql,
        bindings: obj.bindings
    });
});

export default db;
