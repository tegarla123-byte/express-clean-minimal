const BookRepository = require('../domain/BookRepository');
const PaginatedResult = require('../../../shared/domain/PaginatedResult');
const db = require('../../../shared/infrastructure/db');
const Book = require('../domain/Book');

class KnexBookRepository extends BookRepository {
    async findMany(page, limit) {
        const offset = (page - 1) * limit;

        const countResult = await db('books').count('id as count').first();
        const totalItems = parseInt(countResult.count);

        const rows = await db('books')
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy('id', 'asc');

        const books = rows.map(row => new Book(row.id, row.title, row.author, row.stock));
        const totalPages = Math.ceil(totalItems / limit);

        return new PaginatedResult(books, {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit
        });
    }

    async findById(id) {
        const row = await db('books').where({ id }).first();
        if (!row) return null;
        return new Book(row.id, row.title, row.author, row.stock);
    }

    async create(bookData) {
        const [row] = await db('books')
            .insert({
                title: bookData.title,
                author: bookData.author,
                stock: bookData.stock
            })
            .returning('*');
        return new Book(row.id, row.title, row.author, row.stock);
    }

    async update(id, bookData) {
        const [row] = await db('books')
            .where({ id })
            .update(bookData)
            .returning('*');

        if (!row) return null;
        return new Book(row.id, row.title, row.author, row.stock);
    }

    async delete(id) {
        const deletedCount = await db('books').where({ id }).del();
        return deletedCount > 0;
    }

    async decrementStock(id) {
        // Atomic update to prevent race conditions
        const count = await db('books')
            .where({ id })
            .andWhere('stock', '>', 0)
            .decrement('stock', 1);
        return count > 0;
    }

    async incrementStock(id) {
        const count = await db('books')
            .where({ id })
            .increment('stock', 1);
        return count > 0;
    }
}

module.exports = KnexBookRepository;
