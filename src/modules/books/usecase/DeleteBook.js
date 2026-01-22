class DeleteBook {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(id) {
        return await this.bookRepository.delete(id);
    }
}

module.exports = DeleteBook;
