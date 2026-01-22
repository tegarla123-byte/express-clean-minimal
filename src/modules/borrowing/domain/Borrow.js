class Borrow {
    constructor(id, userId, bookId, borrowedAt, returnedAt) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.borrowedAt = borrowedAt;
        this.returnedAt = returnedAt;
    }
}

module.exports = Borrow;
