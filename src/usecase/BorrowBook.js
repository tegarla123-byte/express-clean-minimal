class BorrowBook {
    constructor(bookRepository, borrowRepository) {
        this.bookRepository = bookRepository;
        this.borrowRepository = borrowRepository;
    }

    async execute(userId, bookId) {
        // Business Logic: Check if book is available and decrement stock atomically
        const success = await this.bookRepository.decrementStock(bookId);
        if (!success) {
            throw new Error('Book not available');
        }

        try {
            return await this.borrowRepository.create({
                userId,
                bookId,
                borrowedAt: new Date()
            });
        } catch (error) {
            // Rollback stock if borrowing fails (simplified manual rollback)
            await this.bookRepository.incrementStock(bookId);
            throw error;
        }
    }
}

module.exports = BorrowBook;
