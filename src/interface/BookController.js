class BookController {
    constructor(
        getPaginatedBooksUseCase,
        createBookUseCase,
        getBookUseCase,
        updateBookUseCase,
        deleteBookUseCase
    ) {
        this.getPaginatedBooksUseCase = getPaginatedBooksUseCase;
        this.createBookUseCase = createBookUseCase;
        this.getBookUseCase = getBookUseCase;
        this.updateBookUseCase = updateBookUseCase;
        this.deleteBookUseCase = deleteBookUseCase;
    }

    async getBooks(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await this.getPaginatedBooksUseCase.execute(page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getBook(req, res, next) {
        try {
            const { id } = req.params;
            const book = await this.getBookUseCase.execute(id);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async createBook(req, res, next) {
        try {
            const book = await this.createBookUseCase.execute(req.body);
            res.status(201).json(book);
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id } = req.params;
            const book = await this.updateBookUseCase.execute(id, req.body);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            const success = await this.deleteBookUseCase.execute(id);
            if (!success) return res.status(404).json({ error: 'Book not found' });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BookController;
