export class Borrow {
    public id: number | null;
    public userId: number;
    public bookId: number;
    public borrowedAt: Date;
    public returnedAt: Date | null;

    constructor(id: number | null, userId: number, bookId: number, borrowedAt: Date, returnedAt: Date | null) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.borrowedAt = borrowedAt;
        this.returnedAt = returnedAt;
    }
}
