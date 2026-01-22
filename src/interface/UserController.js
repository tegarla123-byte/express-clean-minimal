class UserController {
    constructor(
        getPaginatedUsersUseCase,
        createUserUseCase,
        getUserUseCase,
        updateUserUseCase,
        deleteUserUseCase
    ) {
        this.getPaginatedUsersUseCase = getPaginatedUsersUseCase;
        this.createUserUseCase = createUserUseCase;
        this.getUserUseCase = getUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }

    async getUsers(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await this.getPaginatedUsersUseCase.execute(page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await this.getUserUseCase.execute(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createUser(req, res) {
        try {
            const user = await this.createUserUseCase.execute(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await this.updateUserUseCase.execute(id, req.body);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const success = await this.deleteUserUseCase.execute(id);
            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = UserController;
