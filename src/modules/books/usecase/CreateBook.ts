import { BookRepository } from '../domain/BookRepository';
import { Book } from '../domain/Book';

export class CreateBook {
    constructor(private bookRepository: BookRepository) { }

    async execute(bookData: { title: string; author: string; stock: number }): Promise<Book> {
        return this.bookRepository.create(bookData);
    }
}
