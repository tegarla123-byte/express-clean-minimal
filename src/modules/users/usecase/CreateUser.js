class CreateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userData) {
        // Business validation can go here (e.g., check if email exists)
        return await this.userRepository.create(userData);
    }
}

module.exports = CreateUser;
