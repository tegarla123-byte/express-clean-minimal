import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/User';

export class GetUser {
    constructor(private userRepository: UserRepository) { }

    async execute(id: number): Promise<User | null> {
        return this.userRepository.findById(id);
    }
}
