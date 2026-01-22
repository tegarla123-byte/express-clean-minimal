import { UserRepository } from '../domain/UserRepository';
import { PaginatedResult } from '../../../shared/domain/PaginatedResult';
import { User } from '../domain/User';

export class GetPaginatedUsers {
    constructor(private userRepository: UserRepository) { }

    async execute(page: number, limit: number): Promise<PaginatedResult<User>> {
        return this.userRepository.findMany(page, limit);
    }
}


