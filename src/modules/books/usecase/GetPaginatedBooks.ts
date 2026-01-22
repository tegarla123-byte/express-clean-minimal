import { BookRepository } from '../domain/BookRepository';
import { PaginatedResult } from '../../../shared/domain/PaginatedResult';
import { Book } from '../domain/Book';

export class GetPaginatedBooks {
    constructor(private bookRepository: BookRepository) { }

    async execute(page: number, limit: number): Promise<PaginatedResult<Book>> {
        return this.bookRepository.findMany(page, limit);
    }
}
