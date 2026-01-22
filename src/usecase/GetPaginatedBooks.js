class GetPaginatedBooks {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(page, limit) {
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        return await this.bookRepository.findMany(pageNum, limitNum);
    }
}

module.exports = GetPaginatedBooks;
