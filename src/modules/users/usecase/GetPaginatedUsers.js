class GetPaginatedUsers {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(page, limit) {
        // Basic validation or default values can be here or in controller
        // Clean Architecture prefers business validation here
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);

        return await this.userRepository.findMany(pageNum, limitNum);
    }
}

module.exports = GetPaginatedUsers;
