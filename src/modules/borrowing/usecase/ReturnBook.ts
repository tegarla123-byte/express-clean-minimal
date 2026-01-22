import { BookRepository } from '../../books/domain/BookRepository';
import { BorrowRepository } from '../domain/BorrowRepository';
import { Borrow } from '../domain/Borrow';

export class ReturnBook {
    constructor(
        private bookRepository: BookRepository,
        private borrowRepository: BorrowRepository
    ) { }

    async execute(borrowId: number): Promise<Borrow> {
        const borrow = await this.borrowRepository.findById(borrowId);
        if (!borrow) throw new Error('Borrow record not found');
        if (borrow.returnedAt) throw new Error('Book already returned');

        // 1. Update borrow record
        const updatedBorrow = await this.borrowRepository.updateReturnDate(borrowId, new Date());
        if (!updatedBorrow) throw new Error('Failed to return book');

        // 2. Increment stock
        await this.bookRepository.incrementStock(borrow.bookId);

        return updatedBorrow;
    }
}
