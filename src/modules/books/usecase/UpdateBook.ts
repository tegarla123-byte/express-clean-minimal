import { BookRepository } from '../domain/BookRepository';
import { Book } from '../domain/Book';

export class UpdateBook {
    constructor(private bookRepository: BookRepository) { }

    async execute(id: number, bookData: { title?: string; author?: string; stock?: number }): Promise<Book | null> {
        return this.bookRepository.update(id, bookData);
    }
}
