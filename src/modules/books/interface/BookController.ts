import { Request, Response, NextFunction } from 'express';
import { GetPaginatedBooks } from '../usecase/GetPaginatedBooks';
import { CreateBook } from '../usecase/CreateBook';
import { GetBook } from '../usecase/GetBook';
import { UpdateBook } from '../usecase/UpdateBook';
import { DeleteBook } from '../usecase/DeleteBook';

export class BookController {
    constructor(
        private getPaginatedBooksUseCase: GetPaginatedBooks,
        private createBookUseCase: CreateBook,
        private getBookUseCase: GetBook,
        private updateBookUseCase: UpdateBook,
        private deleteBookUseCase: DeleteBook
    ) { }

    async getBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(String(req.query.page || '1'));
            const limit = parseInt(String(req.query.limit || '10'));
            const result = await this.getPaginatedBooksUseCase.execute(page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getBook(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(String(req.params.id));
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid book ID format' });
                return;
            }
            const book = await this.getBookUseCase.execute(id);
            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await this.createBookUseCase.execute(req.body);
            res.status(201).json(book);
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(String(req.params.id));
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid book ID format' });
                return;
            }
            const book = await this.updateBookUseCase.execute(id, req.body);
            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            const success = await this.deleteBookUseCase.execute(parseInt(String(req.params.id)));
            if (!success) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
