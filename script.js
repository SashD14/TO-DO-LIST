const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.task-filters button');
const clearCompletedBtn = document.getElementById('clear-completed');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const progressBar = document.getElementById('progress-bar');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const addSound = new Audio('add.mp3');
const deleteSound = new Audio('delete.mp3');
const completeSound = new Audio('complete.mp3');

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = `task ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <span onclick="toggleTask(${index})">
                ${task.name} 
                <span class="tag ${task.category}">${task.category}</span>
                ${task.dueDate ? `<span class="due-date">Due: ${task.dueDate}</span>` : ''}
            </span>
            <button onclick="deleteTask(${index})">x</button>
        `;
        taskList.appendChild(taskItem);
    });
    updateProgressBar();
    saveTasks();
}

function addTask() {
    const taskText = taskInput.value.trim();
    const taskCategory = document.getElementById('task-category').value;
    const dueDate = document.getElementById('task-due-date').value;
    if (taskText) {
        tasks.push({ name: taskText, category: taskCategory, dueDate: dueDate, completed: false });
        taskInput.value = '';
        renderTasks();
        addSound.play();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    deleteSound.play();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
    completeSound.play();
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

function updateProgressBar() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = (completedTasks / tasks.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkDueTasks() {
    const currentTime = new Date().toISOString();
    tasks.forEach(task => {
        if (task.dueDate && task.dueDate < currentTime && !task.completed) {
            alert(`Task "${task.name}" is due now!`);
        }
    });
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => filterTasks(button.id.replace('filter-', '')));
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

renderTasks();
setInterval(checkDueTasks, 60000);
