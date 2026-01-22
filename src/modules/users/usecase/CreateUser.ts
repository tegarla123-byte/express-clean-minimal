import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/User';

export class CreateUser {
    constructor(private userRepository: UserRepository) { }

    async execute(userData: { name: string; email: string }): Promise<User> {
        // Business validation can go here (e.g., check if email exists)
        return this.userRepository.create(userData);
    }
}
