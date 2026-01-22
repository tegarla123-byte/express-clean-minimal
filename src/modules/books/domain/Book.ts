export class Book {
    public id: number | null;
    public title: string;
    public author: string;
    public stock: number;

    constructor(id: number | null, title: string, author: string, stock: number) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.stock = stock;
    }
}
