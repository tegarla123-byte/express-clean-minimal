import { UserRepository } from '../domain/UserRepository';
import { PaginatedResult } from '../../../shared/domain/PaginatedResult';
import db from '../../../shared/infrastructure/db';
import { User } from '../domain/User';

export class KnexUserRepository extends UserRepository {
    async findMany(page: number, limit: number): Promise<PaginatedResult<User>> {
        const offset = (page - 1) * limit;

        const countResult = await db('users').count('id as count').first();
        const totalItems = parseInt(countResult?.count as string || '0');

        const rows = await db('users')
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy('id', 'asc');

        const users = rows.map((row: any) => new User(row.id, row.name, row.email));
        const totalPages = Math.ceil(totalItems / limit);

        return new PaginatedResult(users, {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit
        });
    }

    async findById(id: number): Promise<User | null> {
        const row = await db('users').where({ id }).first();
        if (!row) return null;
        return new User(row.id, row.name, row.email);
    }

    async create(userData: { name: string; email: string }): Promise<User> {
        const [row] = await db('users')
            .insert({
                name: userData.name,
                email: userData.email
            })
            .returning('*');
        return new User(row.id, row.name, row.email);
    }

    async update(id: number, userData: { name: string }): Promise<User | null> {
        const [row] = await db('users')
            .where({ id })
            .update(userData)
            .returning('*');

        if (!row) return null;
        return new User(row.id, row.name, row.email);
    }

    async delete(id: number): Promise<boolean> {
        const deletedCount = await db('users').where({ id }).del();
        return deletedCount > 0;
    }
}
