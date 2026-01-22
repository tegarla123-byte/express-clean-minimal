class ReturnBook {
    constructor(bookRepository, borrowRepository) {
        this.bookRepository = bookRepository;
        this.borrowRepository = borrowRepository;
    }

    async execute(borrowId) {
        const borrow = await this.borrowRepository.findById(borrowId);
        if (!borrow) throw new Error('Borrow record not found');
        if (borrow.returnedAt) throw new Error('Book already returned');

        // Update return date
        const updatedBorrow = await this.borrowRepository.updateReturnDate(borrowId, new Date());

        // Increment stock
        await this.bookRepository.incrementStock(borrow.bookId);

        return updatedBorrow;
    }
}

module.exports = ReturnBook;
