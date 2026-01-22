import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
// Repositories
import { KnexUserRepository } from '../../modules/users/infrastructure/KnexUserRepository';
import { KnexBookRepository } from '../../modules/books/infrastructure/KnexBookRepository';
import { KnexBorrowRepository } from '../../modules/borrowing/infrastructure/KnexBorrowRepository';
import logger from './Logger';

// Use Cases - User
import { GetPaginatedUsers } from '../../modules/users/usecase/GetPaginatedUsers';
import { CreateUser } from '../../modules/users/usecase/CreateUser';
import { GetUser } from '../../modules/users/usecase/GetUser';
import { UpdateUser } from '../../modules/users/usecase/UpdateUser';
import { DeleteUser } from '../../modules/users/usecase/DeleteUser';

// Use Cases - Book
import { GetPaginatedBooks } from '../../modules/books/usecase/GetPaginatedBooks';
import { CreateBook } from '../../modules/books/usecase/CreateBook';
import { GetBook } from '../../modules/books/usecase/GetBook';
import { UpdateBook } from '../../modules/books/usecase/UpdateBook';
import { DeleteBook } from '../../modules/books/usecase/DeleteBook';

// Use Cases - Borrow
import { BorrowBook } from '../../modules/borrowing/usecase/BorrowBook';
import { ReturnBook } from '../../modules/borrowing/usecase/ReturnBook';

// Interface
import { UserController } from '../../modules/users/interface/UserController';
import { BookController } from '../../modules/books/interface/BookController';
import { BorrowController } from '../../modules/borrowing/interface/BorrowController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON bodies

// Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
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
app.get('/users', (req, res, next) => userController.getUsers(req, res, next));
app.post('/users', (req, res, next) => userController.createUser(req, res, next));
app.get('/users/:id', (req, res, next) => userController.getUser(req, res, next));
app.put('/users/:id', (req, res, next) => userController.updateUser(req, res, next));
app.delete('/users/:id', (req, res, next) => userController.deleteUser(req, res, next));

// Routes - Book
app.get('/books', (req, res, next) => bookController.getBooks(req, res, next));
app.post('/books', (req, res, next) => bookController.createBook(req, res, next));
app.get('/books/:id', (req, res, next) => bookController.getBook(req, res, next));
app.put('/books/:id', (req, res, next) => bookController.updateBook(req, res, next));
app.delete('/books/:id', (req, res, next) => bookController.deleteBook(req, res, next));

// Routes - Borrow
app.post('/borrow', (req, res, next) => borrowController.borrowBook(req, res, next));
app.post('/return/:id', (req, res, next) => borrowController.returnBook(req, res, next));

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled Error', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl
    });
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
