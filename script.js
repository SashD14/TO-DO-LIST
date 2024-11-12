const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.task-filters button');
const clearCompletedBtn = document.getElementById('clear-completed');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const progressBar = document.getElementById('progress-bar');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let streakCount = parseInt(localStorage.getItem('streakCount')) || 0;
let lastCompletionDate = localStorage.getItem('lastCompletionDate') || null;
let currentFilter = 'all'; // Default filter

const addSound = new Audio('add.mp3');
const deleteSound = new Audio('delete.mp3');
const completeSound = new Audio('complete.mp3');

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // for 'all' filter
    });

    filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = `task ${task.completed ? 'completed' : ''} ${task.priority}`;
        taskItem.draggable = true;

        taskItem.innerHTML = `
            <span onclick="toggleTask(${index})">
                ${task.name} 
                <span class="tag ${task.category}">${task.category}</span>
                ${task.dueDate ? `<span class="due-date">Due: ${task.dueDate}</span>` : ''}
            </span>
            <button onclick="deleteTask(${index})">x</button>
        `;

        taskItem.addEventListener('dragstart', (e) => onDragStart(e, index));
        taskItem.addEventListener('dragover', (e) => onDragOver(e));
        taskItem.addEventListener('drop', (e) => onDrop(e, index));

        taskList.appendChild(taskItem);
    });
    updateProgressBar();
    saveTasks();
}

function addTask() {
    const taskText = taskInput.value.trim();
    const taskCategory = document.getElementById('task-category').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;

    if (taskText) {
        tasks.push({ name: taskText, category: taskCategory, dueDate: dueDate, priority: priority, completed: false });
        taskInput.value = '';
        renderTasks();
        addSound.play();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    updateStreak();
    renderTasks();
    completeSound.play();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    deleteSound.play();
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

function updateProgressBar() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
    progressBar.style.width = `${progress}%`;
}

function updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (tasks.every(task => task.completed) && lastCompletionDate !== today) {
        streakCount++;
        lastCompletionDate = today;
    }
    localStorage.setItem('streakCount', streakCount);
    localStorage.setItem('lastCompletionDate', lastCompletionDate);
    document.getElementById('streak-count').textContent = streakCount;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function setDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function onDragStart(event, index) {
    event.dataTransfer.setData('taskIndex', index);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event, index) {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData('taskIndex');
    const draggedTask = tasks.splice(draggedIndex, 1)[0];
    tasks.splice(index, 0, draggedTask);
    renderTasks();
}

// Event listeners for filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.id.replace('filter-', '');
        renderTasks();
    });
});

addTaskBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
darkModeToggle.addEventListener('click', setDarkMode);

// Initial render and dark mode setting
renderTasks();

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
