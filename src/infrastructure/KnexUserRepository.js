const UserRepository = require('../domain/UserRepository');
const PaginatedResult = require('../domain/PaginatedResult');
const db = require('./db');
const User = require('../domain/User');

class KnexUserRepository extends UserRepository {
    async findMany(page, limit) {
        const offset = (page - 1) * limit;

        const countResult = await db('users').count('id as count').first();
        const totalItems = parseInt(countResult.count);

        const rows = await db('users')
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy('id', 'asc');

        const users = rows.map(row => new User(row.id, row.name, row.email));
        const totalPages = Math.ceil(totalItems / limit);

        return new PaginatedResult(users, {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit
        });
    }

    async findById(id) {
        const row = await db('users').where({ id }).first();
        if (!row) return null;
        return new User(row.id, row.name, row.email);
    }

    async create(userData) {
        const [row] = await db('users')
            .insert({
                name: userData.name,
                email: userData.email
            })
            .returning('*');
        return new User(row.id, row.name, row.email);
    }

    async update(id, userData) {
        const [row] = await db('users')
            .where({ id })
            .update(userData)
            .returning('*');

        if (!row) return null;
        return new User(row.id, row.name, row.email);
    }

    async delete(id) {
        const deletedCount = await db('users').where({ id }).del();
        return deletedCount > 0;
    }
}

module.exports = KnexUserRepository;
