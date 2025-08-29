
const fs = require('node:fs');
const path = require('node:path');

const statuses = {
    todo: "TO-DO",
    inProgress: "IN-PROGRESS",
    done: "DONE"
}

const tasksFilePath = path.join(__dirname, "tasks.json");

function readTasks() {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath, "utf8");
        return JSON.parse(data);
    }

    return([]);
}

function writeTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), "utf8");
}

function getNextId(tasks) {
    const ids = tasks.map(task => task.id);

    ids.sort((a, b) => a - b);
    let nextId = 1;

    // Encuentra el primer "hueco" y mete ese id
    for (const id of ids) {             // Para cada id dentro de la lista de tasks
        if (id !== nextId) break;       // Si el id es diferente al nextId detengo el bloque
        nextId += 1;                    // Si el id es igual que el nextId añado uno
    }

    return nextId;
}

function getDate() {
    return new Date().toLocaleString();
}

function addTask(taskDescription) {
    console.log(`Adding task: ${taskDescription}`);

    const tasks = readTasks();

    const newTask = {
        id: getNextId(tasks),
        description: taskDescription,
        status: statuses.todo,
        createdAt: getDate(),
        updatedAt: getDate(),
    };

    tasks.push(newTask);
    writeTasks(tasks);

    console.log(`Tasks added succesfully: (${newTask.id})`)
}

function updateTask(taskId, taskDescription) {
    console.log(`Updating task: ${taskId}`);

    const tasks = readTasks();

    const taskToUpdate = tasks.find((task) => task.id === parseInt(taskId));

    if (!taskToUpdate) {
        console.error(`No task found with ID: ${taskId}`);
        return;
    }

    taskToUpdate.description = taskDescription;

    writeTasks(tasks);

    console.log(`Updated task succesfully: ${taskId}`)

}

function deleteTask(id) {
    console.log(`Deleting task: ${id}`);

    const tasks = readTasks();

    const filteredTasks = tasks.filter((task) => task.id !== parseInt(id));

    if (tasks.length === filteredTasks.length){
        console.error(`No task found with ID: ${taskId}`);
        return;
    }

    writeTasks(filteredTasks);

    console.log(`Deleted task succesfully: ${taskId}`);

}

function changeStatus(id, status) {
    console.log(`Changing status to task ${id} to ${status}`);

    const tasks = readTasks();

    let task = tasks.find((task) => task.id === parseInt(taskId))

    task.status = status;

    writeTasks(tasks);

    console.log(`Changed status to task ${id} to ${status}`);
}

function printAll(tasks) {
    for (const task of tasks) {
        console.log(`ID: ${task.id}`);
        console.log(`Description: ${task.description}`);
        console.log(`Status: ${task.status}`);
        console.log(`Created: ${task.createdAt}`);
        console.log(`Updated: ${task.updatedAt}`);

        console.log("---------------------------")
    }
}

function listAll() {
    const tasks = readTasks();

    if (tasks.length === 0)
        console.log("There are no tasks.")

    printAll(tasks);
}

function listFiltered(filter) {

    const tasks = readTasks();
    let filteredTasks = [];
    
    switch (filter) {
        case "todo":
            filteredTasks =  tasks.filter((task) => task.status === statuses.todo);
            break;
        case "in-progress":
            filteredTasks =  tasks.filter((task) => task.status === statuses.inProgress);
            break;
        case "done":
            filteredTasks =  tasks.filter((task) => task.status === statuses.done);
            break;
        default:
            console.error(`The status ${filter} is not valid. Valid statuses: todo, in-progress, done`);
    }

    printAll(filteredTasks);
}

const args = process.argv.slice(2);

let taskDescription;
let taskId;
let status;
let filter;

switch (args[0]) {
    case "add":
        taskDescription = args[1];

        addTask(taskDescription);

        break;
    case "update":
        taskId = args[1];
        taskDescription = args[2];
        
        updateTask(taskId, taskDescription);
        
        break;
    case "delete":
        taskId = args[1];

        deleteTask(taskId);

        break;
    case "mark-in-progress":
        taskId = args[1];
        status = statuses.inProgress;

        changeStatus(taskId, status);

        break;
    case "mark-done":
        taskId = args[1];
        status = statuses.done;

        changeStatus(taskId, status);

        break;
    case "list":
        filter = args[1];

        if (!filter) {
            listAll();
            break;
        }
        listFiltered(filter);
        break;

        
    default:
        console.error("Value not valid. Valid values: add, update, delete");
        break;
}