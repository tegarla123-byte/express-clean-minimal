const UserRepository = require('../domain/UserRepository');
const User = require('../domain/User');
const PaginatedResult = require('../domain/PaginatedResult');

class InMemoryUserRepository extends UserRepository {
    constructor() {
        super();
        this.users = [];
        this.nextId = 1;
        // Seed some data
        for (let i = 1; i <= 50; i++) {
            this.users.push(new User(this.nextId++, `User ${i}`, `user${i}@example.com`));
        }
    }

    async findMany(page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedUsers = this.users.slice(startIndex, endIndex);
        const totalItems = this.users.length;
        const totalPages = Math.ceil(totalItems / limit);

        return new PaginatedResult(paginatedUsers, {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit
        });
    }

    async findById(id) {
        return this.users.find(user => user.id === parseInt(id)) || null;
    }

    async create(userData) {
        const newUser = new User(this.nextId++, userData.name, userData.email);
        this.users.push(newUser);
        return newUser;
    }

    async update(id, userData) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index === -1) return null;

        const updatedUser = { ...this.users[index], ...userData, id: parseInt(id) };
        this.users[index] = updatedUser;
        return updatedUser;
    }

    async delete(id) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index === -1) return false;

        this.users.splice(index, 1);
        return true;
    }
}

module.exports = InMemoryUserRepository;
