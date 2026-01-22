class UpdateBook {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(id, bookData) {
        return await this.bookRepository.update(id, bookData);
    }
}

module.exports = UpdateBook;
