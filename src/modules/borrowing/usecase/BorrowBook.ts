import { BookRepository } from '../../books/domain/BookRepository';
import { BorrowRepository } from '../domain/BorrowRepository';
import { Borrow } from '../domain/Borrow';

export class BorrowBook {
    constructor(
        private bookRepository: BookRepository,
        private borrowRepository: BorrowRepository
    ) { }

    async execute(userId: number, bookId: number): Promise<Borrow> {
        // 1. Check if book exists and has stock
        const book = await this.bookRepository.findById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }
        if (book.stock <= 0) {
            throw new Error('Book out of stock');
        }

        // 2. Check if user already has an active borrow for this book
        const existingBorrow = await this.borrowRepository.findActiveBorrowByUserAndBook(userId, bookId);
        if (existingBorrow) {
            throw new Error('User already has this book borrowed');
        }

        // 3. Decrement stock (Atomic)
        const stockDecremented = await this.bookRepository.decrementStock(bookId);
        if (!stockDecremented) {
            throw new Error('Failed to borrow book (Concurrent update or out of stock)');
        }

        // 4. Create borrow record
        try {
            return await this.borrowRepository.create(userId, bookId);
        } catch (error) {
            // Rollback stock decrement if borrow creation fails
            await this.bookRepository.incrementStock(bookId);
            throw error;
        }
    }
}
