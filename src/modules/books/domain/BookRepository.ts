import { Book } from './Book';
import { PaginatedResult } from '../../../shared/domain/PaginatedResult';

export abstract class BookRepository {
    abstract findMany(page: number, limit: number): Promise<PaginatedResult<Book>>;
    abstract findById(id: number): Promise<Book | null>;
    abstract create(bookData: { title: string; author: string; stock: number }): Promise<Book>;
    abstract update(id: number, bookData: { title?: string; author?: string; stock?: number }): Promise<Book | null>;
    abstract delete(id: number): Promise<boolean>;
    abstract decrementStock(id: number): Promise<boolean>;
    abstract incrementStock(id: number): Promise<boolean>;
}
