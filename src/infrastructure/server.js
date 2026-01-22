const express = require('express');
// const InMemoryUserRepository = require('./InMemoryUserRepository');
// const PostgresUserRepository = require('./PostgresUserRepository');
const KnexUserRepository = require('./KnexUserRepository');
const KnexBookRepository = require('./KnexBookRepository');
const KnexBorrowRepository = require('./KnexBorrowRepository');
const logger = require('./Logger');

// Use Cases - User
const GetPaginatedUsers = require('../usecase/GetPaginatedUsers');
const CreateUser = require('../usecase/CreateUser');
const GetUser = require('../usecase/GetUser');
const UpdateUser = require('../usecase/UpdateUser');
const DeleteUser = require('../usecase/DeleteUser');

// Use Cases - Book
const GetPaginatedBooks = require('../usecase/GetPaginatedBooks');
const CreateBook = require('../usecase/CreateBook');
const GetBook = require('../usecase/GetBook');
const UpdateBook = require('../usecase/UpdateBook');
const DeleteBook = require('../usecase/DeleteBook');

// Use Cases - Borrow
const BorrowBook = require('../usecase/BorrowBook');
const ReturnBook = require('../usecase/ReturnBook');

// Interface
const UserController = require('../interface/UserController');
const BookController = require('../interface/BookController');
const BorrowController = require('../interface/BorrowController');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON bodies

// Request Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`HTTP Request`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent'),
            ip: req.ip
        });
    });
    next();
});

// Dependency Injection
// Repositories
const userRepository = new KnexUserRepository();
const bookRepository = new KnexBookRepository();
const borrowRepository = new KnexBorrowRepository();

// Use Case Instantiation - User
const getPaginatedUsersUseCase = new GetPaginatedUsers(userRepository);
const createUserUseCase = new CreateUser(userRepository);
const getUserUseCase = new GetUser(userRepository);
const updateUserUseCase = new UpdateUser(userRepository);
const deleteUserUseCase = new DeleteUser(userRepository);

// Use Case Instantiation - Book
const getPaginatedBooksUseCase = new GetPaginatedBooks(bookRepository);
const createBookUseCase = new CreateBook(bookRepository);
const getBookUseCase = new GetBook(bookRepository);
const updateBookUseCase = new UpdateBook(bookRepository);
const deleteBookUseCase = new DeleteBook(bookRepository);

// Use Case Instantiation - Borrow
const borrowBookUseCase = new BorrowBook(bookRepository, borrowRepository);
const returnBookUseCase = new ReturnBook(bookRepository, borrowRepository);

// Controller Instantiation
const userController = new UserController(
    getPaginatedUsersUseCase,
    createUserUseCase,
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase
);

const bookController = new BookController(
    getPaginatedBooksUseCase,
    createBookUseCase,
    getBookUseCase,
    updateBookUseCase,
    deleteBookUseCase
);

const borrowController = new BorrowController(
    borrowBookUseCase,
    returnBookUseCase
);

// Routes - User
app.get('/users', userController.getUsers.bind(userController));
app.post('/users', userController.createUser.bind(userController));
app.get('/users/:id', userController.getUser.bind(userController));
app.put('/users/:id', userController.updateUser.bind(userController));
app.delete('/users/:id', userController.deleteUser.bind(userController));

// Routes - Book
app.get('/books', bookController.getBooks.bind(bookController));
app.post('/books', bookController.createBook.bind(bookController));
app.get('/books/:id', bookController.getBook.bind(bookController));
app.put('/books/:id', bookController.updateBook.bind(bookController));
app.delete('/books/:id', bookController.deleteBook.bind(bookController));

// Routes - Borrow
app.post('/borrow', borrowController.borrowBook.bind(borrowController));
app.post('/return/:id', borrowController.returnBook.bind(borrowController));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled Error', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl
    });
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
