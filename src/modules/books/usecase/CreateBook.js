class CreateBook {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(bookData) {
        return await this.bookRepository.create(bookData);
    }
}

module.exports = CreateBook;
