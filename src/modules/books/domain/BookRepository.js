class BookRepository {
    async findMany(page, limit) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async create(bookData) {
        throw new Error('Method not implemented');
    }

    async update(id, bookData) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async decrementStock(id) {
        throw new Error('Method not implemented');
    }

    async incrementStock(id) {
        throw new Error('Method not implemented');
    }
}

module.exports = BookRepository;
