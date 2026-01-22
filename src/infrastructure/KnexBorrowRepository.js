const BorrowRepository = require('../domain/BorrowRepository');
const db = require('./db');
const Borrow = require('../domain/Borrow');

class KnexBorrowRepository extends BorrowRepository {
    async create(borrowData) {
        // We expect borrowed_at to be handled by DB default or passed in
        const [row] = await db('borrows')
            .insert({
                user_id: borrowData.userId,
                book_id: borrowData.bookId,
                borrowed_at: borrowData.borrowedAt || new Date()
            })
            .returning('*');

        return new Borrow(row.id, row.user_id, row.book_id, row.borrowed_at, row.returned_at);
    }

    async findById(id) {
        const row = await db('borrows').where({ id }).first();
        if (!row) return null;
        return new Borrow(row.id, row.user_id, row.book_id, row.borrowed_at, row.returned_at);
    }

    async updateReturnDate(id, date) {
        const [row] = await db('borrows')
            .where({ id })
            .update({ returned_at: date })
            .returning('*');

        if (!row) return null;
        return new Borrow(row.id, row.user_id, row.book_id, row.borrowed_at, row.returned_at);
    }

    async findActiveBorrowByUserAndBook(userId, bookId) {
        const row = await db('borrows')
            .where({ user_id: userId, book_id: bookId })
            .whereNull('returned_at')
            .first();

        if (!row) return null;
        return new Borrow(row.id, row.user_id, row.book_id, row.borrowed_at, row.returned_at);
    }
}

module.exports = KnexBorrowRepository;
