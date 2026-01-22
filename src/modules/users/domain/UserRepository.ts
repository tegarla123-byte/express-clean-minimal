import { User } from './User';
import { PaginatedResult } from '../../../shared/domain/PaginatedResult';

export abstract class UserRepository {
    abstract findMany(page: number, limit: number): Promise<PaginatedResult<User>>;
    abstract findById(id: number): Promise<User | null>;
    abstract create(userData: { name: string; email: string }): Promise<User>;
    abstract update(id: number, userData: { name: string }): Promise<User | null>;
    abstract delete(id: number): Promise<boolean>;
}
