import { BookRepository } from '../domain/BookRepository';
import { PaginatedResult } from '../../../shared/domain/PaginatedResult';
import db from '../../../shared/infrastructure/db';
import { Book } from '../domain/Book';

export class KnexBookRepository extends BookRepository {
    async findMany(page: number, limit: number): Promise<PaginatedResult<Book>> {
        const offset = (page - 1) * limit;

        const countResult = await db('books').count('id as count').first();
        const totalItems = parseInt(countResult?.count as string || '0');

        const rows = await db('books')
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy('id', 'asc');

        const books = rows.map((row: any) => new Book(row.id, row.title, row.author, row.stock));
        const totalPages = Math.ceil(totalItems / limit);

        return new PaginatedResult(books, {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit
        });
    }

    async findById(id: number): Promise<Book | null> {
        const row = await db('books').where({ id }).first();
        if (!row) return null;
        return new Book(row.id, row.title, row.author, row.stock);
    }

    async create(bookData: { title: string; author: string; stock: number }): Promise<Book> {
        const [row] = await db('books')
            .insert(bookData)
            .returning('*');
        return new Book(row.id, row.title, row.author, row.stock);
    }

    async update(id: number, bookData: { title?: string; author?: string; stock?: number }): Promise<Book | null> {
        const [row] = await db('books')
            .where({ id })
            .update(bookData)
            .returning('*');

        if (!row) return null;
        return new Book(row.id, row.title, row.author, row.stock);
    }

    async delete(id: number): Promise<boolean> {
        const deletedCount = await db('books').where({ id }).del();
        return deletedCount > 0;
    }

    async decrementStock(id: number): Promise<boolean> {
        const result = await db('books')
            .where({ id })
            .andWhere('stock', '>', 0)
            .decrement('stock', 1);
        return result > 0;
    }

    async incrementStock(id: number): Promise<boolean> {
        const result = await db('books')
            .where({ id })
            .increment('stock', 1);
        return result > 0;
    }
}
