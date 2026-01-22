import { BorrowRepository } from '../domain/BorrowRepository';
import db from '../../../shared/infrastructure/db';
import { Borrow } from '../domain/Borrow';

export class KnexBorrowRepository extends BorrowRepository {
    async create(userId: number, bookId: number): Promise<Borrow> {
        const [row] = await db('borrows')
            .insert({
                user_id: userId,
                book_id: bookId,
                borrowed_at: new Date()
            })
            .returning('*');
        return this.mapToEntity(row);
    }

    async findById(id: number): Promise<Borrow | null> {
        const row = await db('borrows').where({ id }).first();
        if (!row) return null;
        return this.mapToEntity(row);
    }

    async updateReturnDate(id: number, returnDate: Date): Promise<Borrow | null> {
        const [row] = await db('borrows')
            .where({ id })
            .update({ returned_at: returnDate })
            .returning('*');

        if (!row) return null;
        return this.mapToEntity(row);
    }

    async findActiveBorrowByUserAndBook(userId: number, bookId: number): Promise<Borrow | null> {
        const row = await db('borrows')
            .where({ user_id: userId, book_id: bookId, returned_at: null })
            .first();

        if (!row) return null;
        return this.mapToEntity(row);
    }

    private mapToEntity(row: any): Borrow {
        return new Borrow(
            row.id,
            row.user_id,
            row.book_id,
            row.borrowed_at,
            row.returned_at
        );
    }
}
