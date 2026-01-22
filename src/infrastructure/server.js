const express = require('express');
const InMemoryUserRepository = require('./InMemoryUserRepository');
// Use Cases
const GetPaginatedUsers = require('../usecase/GetPaginatedUsers');
const CreateUser = require('../usecase/CreateUser');
const GetUser = require('../usecase/GetUser');
const UpdateUser = require('../usecase/UpdateUser');
const DeleteUser = require('../usecase/DeleteUser');
// Interface
const UserController = require('../interface/UserController');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware for parsing JSON bodies

// Dependency Injection
const userRepository = new InMemoryUserRepository();

// Use Case Instantiation
const getPaginatedUsersUseCase = new GetPaginatedUsers(userRepository);
const createUserUseCase = new CreateUser(userRepository);
const getUserUseCase = new GetUser(userRepository);
const updateUserUseCase = new UpdateUser(userRepository);
const deleteUserUseCase = new DeleteUser(userRepository);

// Controller Instantiation
const userController = new UserController(
    getPaginatedUsersUseCase,
    createUserUseCase,
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase
);

// Routes
// We use .bind(userController) to ensure 'this' refers to the controller instance
app.get('/users', userController.getUsers.bind(userController));
app.post('/users', userController.createUser.bind(userController));
app.get('/users/:id', userController.getUser.bind(userController));
app.put('/users/:id', userController.updateUser.bind(userController));
app.delete('/users/:id', userController.deleteUser.bind(userController));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
