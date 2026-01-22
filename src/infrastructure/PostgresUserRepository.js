const UserRepository = require('../domain/UserRepository');
const PaginatedResult = require('../domain/PaginatedResult');
const pool = require('./db');
const User = require('../domain/User');

class PostgresUserRepository extends UserRepository {
    async findMany(page, limit) {
        const offset = (page - 1) * limit;

        const client = await pool.connect();
        try {
            // Transaction-like safety not strictly needed for read, but good practice if more complex
            const countResult = await client.query('SELECT COUNT(*) FROM users');
            const totalItems = parseInt(countResult.rows[0].count);

            const query = 'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2';
            const { rows } = await client.query(query, [limit, offset]);

            const users = rows.map(row => new User(row.id, row.name, row.email));
            const totalPages = Math.ceil(totalItems / limit);

            return new PaginatedResult(users, {
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: limit
            });
        } finally {
            client.release();
        }
    }

    async findById(id) {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new User(row.id, row.name, row.email);
    }

    async create(userData) {
        const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
        try {
            const { rows } = await pool.query(query, [userData.name, userData.email]);
            const row = rows[0];
            return new User(row.id, row.name, row.email);
        } catch (error) {
            // Handle unique constraint violation, etc.
            throw error;
        }
    }

    async update(id, userData) {
        // Dynamic update query builder could be used here, but for simplicity:
        // We'll assume full update or just handle name for now based on previous simple logic
        // But better to check what's passed.

        // Let's implement partial update for name and email
        // A real query builder (like transaction or helper) would be better

        // Fetch current first
        const current = await this.findById(id);
        if (!current) return null;

        const name = userData.name || current.name;
        const email = userData.email || current.email;

        const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
        const { rows } = await pool.query(query, [name, email, id]);
        const row = rows[0];
        return new User(row.id, row.name, row.email);
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}

module.exports = PostgresUserRepository;
