

const express = require('express'); // Import the Express framework to handle routing and HTTP requests.
const app = express(); // Create an Express application instance.



app.use(express.json()); // Middleware to parse incoming JSON payloads in request bodies.



// Define the initial list of tasks using a LET method, which allows modification of the array.
let todos = [
    { id: 1, task: 'Plan out dinners', completed: false }, // A sample task with ID, task description, and completion status.
    { id: 2, task: 'Go to Wegmans', completed: true }, // Another task with a completed status set to true.
];



// Define the GET method which retrieves the welcome message at the root destination.
app.get('/', (req, res) => {
    res.send('Welcome to the To-Do List API'); // Respond with a welcome message.
});



// Define the GET method which retrieves the list of tasks.
app.get('/todos', (req, res) => {
    const { completed } = req.query; // Extract the 'completed' query parameter from the request.
    let filteredTodos = todos; // Default to the full list of tasks.

    // If 'completed' is provided as 'true' or 'false', filter the list based on completion status.
    if (completed === 'true' || completed === 'false') {
        filteredTodos = todos.filter(todo => todo.completed === (completed === 'true')); // Filter tasks by completion status.
    }
    res.json(filteredTodos); // Return the filtered or full list of tasks as a JSON response.

    // Check if there are no tasks and return a 404 status with a message.
    if (todos.length === 0) {
        return res.status(404).json({ message: 'No to-do items found' }); // Respond with a 404 if no tasks exist.
    }
    res.json(todos); // Respond with the full list of tasks.
});



// Define the POST method which adds a task to the end of the list if the given input is a string.
app.post('/todos', (req, res) => {
    const { task } = req.body; // Extract the 'task' field from the request body.

    // Validate that 'task' is provided and is a string; otherwise, return a 400 status.
    if (!task || typeof task !== 'string') {
        return res.status(400).json({ message: 'Task is required and must be a string' }); // Return an error message.
    }

    // Create a new task object with an auto-incremented ID and default completion status.
    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1, // Increment ID or set to 1 if list is empty.
        task: task.trim(), // Trim whitespace from the task string.
        completed: false, // Default the 'completed' status to false.
    };

    todos.push(newTodo); // Add the new task to the list of tasks.

    res.status(201).json(newTodo); // Respond with the newly created task and a 201 status.
});



// Define the PUT method that searches for a task based on ID and then either updates the task name and/or the completion status.
app.put('/todos/:id', (req, res) => {
    const { id } = req.params; // Extract the 'id' parameter from the URL.
    const { task, completed } = req.body; // Extract 'task' and 'completed' fields from the request body.

    const todo = todos.find((todo) => todo.id === parseInt(id)); // Find the task with the matching ID.

    // If no task is found with the given ID, return a 404 status with an error message.
    if (!todo) {
        return res.status(404).json({ message: 'To-do item not found' }); // Return an error message.
    }

    // Update the task name if 'task' is provided in the request.
    if (task !== undefined) todo.task = task;
    // Update the completion status if 'completed' is provided in the request.
    if (completed !== undefined) todo.completed = completed;

    res.json(todo); // Respond with the updated task.
});



// Define the DELETE method which searches for a task based on ID and then deletes the task from the list.
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params; // Extract the 'id' parameter from the URL.
    const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id)); // Find the index of the task with the given ID.

    // If no task is found with the given ID, return a 404 status with an error message.
    if (todoIndex === -1) {
        return res.status(404).json({ message: 'To-do item not found' }); // Return an error message.
    }

    const deletedTodo = todos.splice(todoIndex, 1); // Remove the task from the list using its index.

    res.json({ message: 'To-do item deleted successfully', deletedTodo }); // Respond with a success message and the deleted task.
});



const PORT = 3000; // Define the port on which the server will run.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL to the console.
    console.log(`Node.js version: ${process.version}`); // Log the current Node.js version.
});
