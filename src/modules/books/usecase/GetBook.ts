import { BookRepository } from '../domain/BookRepository';
import { Book } from '../domain/Book';

export class GetBook {
    constructor(private bookRepository: BookRepository) { }

    async execute(id: number): Promise<Book | null> {
        return this.bookRepository.findById(id);
    }
}
