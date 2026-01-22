import { BookRepository } from '../domain/BookRepository';

export class DeleteBook {
    constructor(private bookRepository: BookRepository) { }

    async execute(id: number): Promise<boolean> {
        return this.bookRepository.delete(id);
    }
}
