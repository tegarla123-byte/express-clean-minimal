import { Borrow } from './Borrow';

export abstract class BorrowRepository {
    abstract create(userId: number, bookId: number): Promise<Borrow>;
    abstract findById(id: number): Promise<Borrow | null>;
    abstract updateReturnDate(id: number, returnDate: Date): Promise<Borrow | null>;

    // Additional helpful methods
    abstract findActiveBorrowByUserAndBook(userId: number, bookId: number): Promise<Borrow | null>;
}
