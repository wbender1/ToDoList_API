

// Import the Express framework to handle routing and HTTP requests.
const express = require('express');


// Create an Express application instance.
const app = express();


// Middleware to parse incoming JSON payloads in request bodies.
app.use(express.json());


// Define the initial list of tasks using a LET method.
// Creates a LET method called todos.
let todos = [

    // Adds a tasks with ID, task description, and completion status.
        { id: 1, task: 'Plan out dinners', completed: false },
        { id: 2, task: 'Go to Wegmans', completed: false },
];


// Define the GET method which retrieves the welcome message at the root destination.
// root endpoint has a request and response intialized. However, no request is sent, only a response.
app.get('/', (req, res) => {

    // a response is sent containing the welcome message.
    res.send('Welcome to the To-Do List API');
});


// Define the GET method which retrieves the list of tasks
// Establishes an endpoint '/todos' at the end of the root destination with request and response.
app.get('/todos', (req, res) => {

    // Extracts the query parameter, 'completion status', from the request.
    const { completed } = req.query;

    // An error handling if statement that checks to see if the list is greater than 0.
    if (todos.length === 0) {

        // An error message is added to response and returned.
        return res.status(200).json({ message: 'No to-do items found, check request!' });
    }

    // Sets the full list of todos to be named filteredTodos.
    let filteredTodos = todos;

    // An if statement that filters based on the endpoint being changed to true or false status completion.
    // Status must be either true or false to filter.
    if (completed === 'true' || completed === 'false') {

        // filteredTodos updates based upon the filter function. Depending on the endpoint, the last portion of code returns a true or false boolean.
        // the boolean is used by filter to search todo for status completion that matches the boolean and then adds them to filteredTodos.
        filteredTodos = todos.filter(todo => todo.completed === (completed === 'true'));
    }

    // An error handling if statement that checks to see if the filtered list is greater than 0
    if (filteredTodos.length === 0) {

        // An error message is added to response and returned.
        return res.json({
            message: `No tasks match your completion status: '${completed}'`
        });
    }

    if (completed === undefined) {
        return res.json({
            filteredTodos
        });
    }

    // Response is given with the filtered or full list.
    res.json({
        message: `Tasks with the completion status of '${completed}' are shown below: `,
        filteredTodos
    });
});


// Define the GET method which retrieves a specific task based upon id
// Establishes an endpoint '/todos' at the end of the root destination with request and response.
app.get('/todos/:id', (req, res) => {

    // Extracts the id parameter from the URL.
    const { id } = req.params;

    // An error handling if statement that checks to see if the list is greater than 0.
    if (todos.length === 0) {

        // An error message is added to response and returned.
        return res.status(404).json({ message: 'No to-do item found, check ID request!' });
    }

    // Iterates through every task in todo while checking to see if todo.id matches the id being passed from the request.
    // It then assigns todo to be the task which matched id.
    const todo = todos.find((todo) => todo.id === parseInt(id));

    // If todo is a task, it will return false and not produce an error.
    if (!todo) {

        // An error message is added to response and returned.
        return res.status(404).json({
            message: `To-do item with ID: ${id} is not found`
        });
    }

    // Response is given with the filtered or full list.
    res.json({
        message: `Task: ${todo.task} with ID: ${todo.id} and completion status '${todo.completed}' found successfully!`,
    });
});


// Define the POST method which adds a task to the end of the list if the given input is a string.
// Establishes an endpoint '/todos' at the end of the root destination with request and response.
app.post('/todos', (req, res) => {

    // Extracts the 'task' field from the body of the request being sent and sets it to task.
    const { task } = req.body;

    // An error handling if statement that checks if there is a task given and if the type of task is a string or not.
    if (!task || typeof task !== 'string') {

        // An error message is added to response and returned.
        return res.status(400).json({ message: 'Task is required and must be a string' });
    }

    // Creates a new task object with an auto-incremented ID and default completion status of false.
    const newTodo = {

        // A ternary operator (if-else) that sets id: to either the first condition if the expression returns true, or the second condition if false.
        // If true (list greater than 0), we must find the last task in the list by taking the lists length, acquire that tasks id, and increment by 1.
        // This is because a task could have been removed from the list, meaning the last task could have a higher id value than the length of the list itself.
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,

        // Trims whitespace from the string input as the new task name.
        task: task.trim(),

        // Defaults the completion status to false as it is a new item being added to the list.
        completed: false,
    };

    // Adds newTodo task to the todos list.
    todos.push(newTodo);

    // Response is given with the new task that was added. 
    res.json({
        message: `Task: ${newTodo.task} added successfully! ID: ${newTodo.id}, Status: 'false'`,
    });
});


// Define the PUT method that searches for a task based on id and then either updates the task name and/or the completion status.
// Adds an additional endpoint which is the id assigned to the task.
app.put('/todos/:id', (req, res) => {

    // Extracts the id parameter from the URL.
    const { id } = req.params;

    // Extracts the task and completion status from the request body.
    const { task, completed } = req.body;

    // Iterates through every task in todo while checking to see if todo.id matches the id being passed from the URL.
    // It then assigns todo to be the task which matched id.
    const todo = todos.find((todo) => todo.id === parseInt(id));

    // An error handling if statement which checks to see if todo is is falsy. In this case, if it undefined or not.
    // If todo is a task, it will return false and not produce an error.
    if (!todo) {

        // An error message is added to response and returned.
        return res.status(404).json({
            message: `To-do item with ID: ${id} is not found`
        });
    }

    // An if statement which assigns the updated task string from the request to the task found when searching by id.
    if (task !== undefined) todo.task = task;

    // An if statement which assigns the updated completion status from the request to the task found when searching by id.
    if (completed !== undefined) todo.completed = completed;

    // Response is given to confirm the task has been updated.
    res.json({
        message: `Task: ${todo.task} updated successfully! ID: ${todo.id}, Status: '${todo.completed}'`,
    });
});


// Define the DELETE method which searches for a task based on id and then deletes the task from the list
// Adds an additionally endpoint which is the id assigned to the task.
app.delete('/todos/:id', (req, res) => {

    // Extracts the id parameter from the URL.
    const { id } = req.params;

    // Iterates through every task in todo while checking to see if todo.id matches the is being passed from the URL.
    // It then assigns todoIndex with the index value of that task.
    const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

    // An error handling if statement which checks to see if the index number is valid (greater than 0);
    if (todoIndex === -1) {
        return res.status(404).json({ message: `To-do item with ID: ${id} not found` }); // An error message is added to response and returned.
    }

    // Using the previous found index, splice removes 1 item starting at that index value from the todos array.
    // The removed item is assigned as an array to deletedTodo.
    const deletedTodo = todos.splice(todoIndex, 1);

    // Response is given with the deleted tasks as an array.
    res.json({
        message: `Task: ${deletedTodo[0].task} with ID: ${deletedTodo[0].id} and Status: '${deletedTodo[0].completed}', deleted successfully!`,
    });
});


/*
app.delete('/todos', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid input. Provide an array of IDs to delete.' });
    }
    const deletedTodos = [];
    ids.forEach(id => {
        const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));
        if (todoIndex !== -1) {
            const deletedTodo = todos.splice(todoIndex, 1);
            deletedTodos.push(deletedTodo[0]);
        }
    });
    if (deletedTodos.length === 0) {
        return res.status(404).json({ message: 'No to-do items found for the provided IDs.' });
    }
    res.json({ message: 'To-do items deleted successfully', deletedTodos });
});
*/


// Defines the port on which the server will run.
const PORT = 3000;

// Logs two string to the console
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Node.js version: ${process.version}`);

});