class BorrowController {
    constructor(borrowBookUseCase, returnBookUseCase) {
        this.borrowBookUseCase = borrowBookUseCase;
        this.returnBookUseCase = returnBookUseCase;
    }

    async borrowBook(req, res, next) {
        try {
            const { userId, bookId } = req.body;
            const borrow = await this.borrowBookUseCase.execute(userId, bookId);
            res.status(201).json(borrow);
        } catch (error) {
            if (error.message === 'Book not available') {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    }

    async returnBook(req, res, next) {
        try {
            const { id } = req.params; // Borrow ID
            const borrow = await this.returnBookUseCase.execute(id);
            res.json(borrow);
        } catch (error) {
            if (error.message === 'Borrow record not found' || error.message === 'Book already returned') {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    }
}

module.exports = BorrowController;
