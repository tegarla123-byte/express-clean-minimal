import { Request, Response, NextFunction } from 'express';
import { BorrowBook } from '../usecase/BorrowBook';
import { ReturnBook } from '../usecase/ReturnBook';

export class BorrowController {
    constructor(
        private borrowBookUseCase: BorrowBook,
        private returnBookUseCase: ReturnBook
    ) { }

    async borrowBook(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, bookId } = req.body;
            const borrow = await this.borrowBookUseCase.execute(userId, bookId);
            res.status(201).json(borrow);
        } catch (error: any) {
            if (error.message === 'Book not found' || error.message === 'Book out of stock' || error.message === 'User already has this book borrowed') {
                res.status(400).json({ error: error.message });
            } else {
                next(error);
            }
        }
    }

    async returnBook(req: Request, res: Response, next: NextFunction) {
        try {
            const borrowId = parseInt(String(req.params.id));
            if (isNaN(borrowId)) {
                res.status(400).json({ error: 'Invalid borrow ID' });
                return;
            }
            const borrow = await this.returnBookUseCase.execute(borrowId);
            res.json(borrow);
        } catch (error: any) {
            if (error.message === 'Borrow record not found' || error.message === 'Book already returned') {
                res.status(400).json({ error: error.message });
            } else {
                next(error);
            }
        }
    }
}
