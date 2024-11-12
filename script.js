const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.task-filters button');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = `task ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <span onclick="toggleTask(${index})">${task.name}</span>
            <button onclick="deleteTask(${index})">x</button>
        `;
        taskList.appendChild(taskItem);
    });
    saveTasks();
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ name: taskText, completed: false });
        taskInput.value = '';
        renderTasks();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function filterTasks(filter) {
    tasks.forEach((task, index) => {
        const taskItem = taskList.children[index];
        taskItem.style.display = (filter === 'all') ||
                                 (filter === 'completed' && task.completed) ||
                                 (filter === 'active' && !task.completed) ? 'flex' : 'none';
    });
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
filterButtons.forEach(button => {
    button.addEventListener('click', () => filterTasks(button.id.replace('filter-', '')));
});
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

renderTasks();
