import { Request, Response, NextFunction } from 'express';
import { GetPaginatedUsers } from '../usecase/GetPaginatedUsers';
import { CreateUser } from '../usecase/CreateUser';
import { GetUser } from '../usecase/GetUser';
import { UpdateUser } from '../usecase/UpdateUser';
import { DeleteUser } from '../usecase/DeleteUser';

export class UserController {
    constructor(
        private getPaginatedUsersUseCase: GetPaginatedUsers,
        private createUserUseCase: CreateUser,
        private getUserUseCase: GetUser,
        private updateUserUseCase: UpdateUser,
        private deleteUserUseCase: DeleteUser
    ) { }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(String(req.query.page || '1'));
            const limit = parseInt(String(req.query.limit || '10'));
            const result = await this.getPaginatedUsersUseCase.execute(page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(String(req.params.id));
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }
            const user = await this.getUserUseCase.execute(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.createUserUseCase.execute(req.body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(String(req.params.id));
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }
            const user = await this.updateUserUseCase.execute(id, req.body);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const success = await this.deleteUserUseCase.execute(parseInt(String(req.params.id)));
            if (!success) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
