import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/User';

export class UpdateUser {
    constructor(private userRepository: UserRepository) { }

    async execute(id: number, userData: { name: string }): Promise<User | null> {
        return this.userRepository.update(id, userData);
    }
}
