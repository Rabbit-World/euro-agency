---
layout: challenge
title: "Interactive JavaScript Application"
description: "Build a dynamic web application using modern JavaScript techniques"
difficulty: advanced
points: 200
estimated_time: "120 minutes"
challenge_type: coding
required_level: 5
badges:
  - javascript_expert
  - app_developer
prerequisites:
  - beginner-challenge
  - intermediate-challenge
---

{% comment %}
This advanced challenge demonstrates the highest level of gamification integration,
with multiple prerequisites, higher point values, and more complex interactions.
{% endcomment %}

# {{ page.title }}

**Difficulty**: {{ page.difficulty | capitalize }}  
**Points**: {{ page.points }}  
**Estimated Time**: {{ page.estimated_time }}

{% include gamification/points-counter.html %}

## Challenge Overview

Ready to put your web development skills to the ultimate test? In this advanced challenge, you'll build a fully interactive web application using modern JavaScript. You'll create a task management application with features like adding, editing, and deleting tasks, filtering, local storage persistence, and drag-and-drop functionality.

{% if user.completed_challenges contains "intermediate-challenge" %}
  <div class="prerequisite-met">
    <p>✅ Prerequisite complete: Responsive Design Challenge</p>
  </div>
{% else %}
  <div class="prerequisite-warning">
    <p>⚠️ We recommend completing the <a href="/challenges/intermediate-challenge">Responsive Design Challenge</a> first.</p>
  </div>
{% endif %}

{% if user.completed_challenges contains "beginner-challenge" %}
  <div class="prerequisite-met">
    <p>✅ Prerequisite complete: Web Development Basics</p>
  </div>
{% else %}
  <div class="prerequisite-warning">
    <p>⚠️ We recommend completing the <a href="/challenges/beginner-challenge">Web Development Basics</a> challenge first.</p>
  </div>
{% endif %}

## Learning Objectives

By completing this challenge, you will:
- Master modern JavaScript techniques
- Implement complex user interactions
- Create a persistent application using localStorage
- Build a fully functional task management system
- Earn the "JavaScript Expert" and "App Developer" badges

{% include gamification/badge-display.html badge_id="javascript_expert" %}
{% include gamification/badge-display.html badge_id="app_developer" %}

## Challenge Instructions

### Step 1: Set Up Your Project

Create a new folder called "task-manager" with the following files:
- `index.html`
- `styles.css`
- `app.js`

### Step 2: Create the HTML Structure

Open `index.html` and create the structure for your task management application:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Task Manager</h1>
            <p class="app-description">Organize your tasks efficiently</p>
        </header>

        <div class="task-controls">
            <div class="add-task">
                <input type="text" id="task-input" placeholder="Add a new task...">
                <button id="add-button">
                    <i class="fas fa-plus"></i> Add Task
                </button>
            </div>
            
            <div class="filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="pending">Pending</button>
                <button class="filter-btn" data-filter="completed">Completed</button>
            </div>
            
            <div class="search">
                <input type="text" id="search-input" placeholder="Search tasks...">
                <i class="fas fa-search"></i>
            </div>
        </div>

        <div class="task-container">
            <h2>My Tasks <span id="task-counter">(0)</span></h2>
            
            <div class="task-list" id="task-list">
                <!-- Tasks will be added here dynamically -->
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tasks yet. Add a task to get started!</p>
                </div>
            </div>
        </div>
        
        <div class="task-stats">
            <div class="stat">
                <i class="fas fa-tasks"></i>
                <span>Total: <span id="total-tasks">0</span></span>
            </div>
            <div class="stat">
                <i class="fas fa-spinner"></i>
                <span>Pending: <span id="pending-tasks">0</span></span>
            </div>
            <div class="stat">
                <i class="fas fa-check-circle"></i>
                <span>Completed: <span id="completed-tasks">0</span></span>
            </div>
        </div>
    </div>

    <!-- Task Template (Hidden) -->
    <template id="task-template">
        <div class="task-item" draggable="true">
            <div class="task-content">
                <input type="checkbox" class="task-check">
                <span class="task-text"></span>
            </div>
            <div class="task-actions">
                <button class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    </template>

    <!-- Edit Task Modal -->
    <div class="modal" id="edit-modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Edit Task</h2>
            <input type="text" id="edit-input">
            <button id="save-edit">Save Changes</button>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

### Step 3: Add CSS Styling

Open `styles.css` and add styling for your application:

```css
/* Base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 2rem auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

header h1 {
    color: #0088cc;
    margin-bottom: 0.5rem;
}

.app-description {
    color: #777;
}

/* Task controls */
.task-controls {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
}

.add-task {
    display: flex;
    gap: 0.5rem;
}

#task-input {
    flex: 1;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

#add-button {
    background-color: #0088cc;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0 1rem;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

#add-button:hover {
    background-color: #006699;
}

.filters {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.filter-btn {
    background-color: #f1f1f1;
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s;
}

.filter-btn:hover {
    background-color: #e1e1e1;
}

.filter-btn.active {
    background-color: #0088cc;
    color: white;
}

.search {
    position: relative;
}

#search-input {
    width: 100%;
    padding: 0.8rem;
    padding-left: 2.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.search i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #777;
}

/* Task list */
.task-container {
    margin-bottom: 2rem;
}

.task-container h2 {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
}

#task-counter {
    font-size: 1rem;
    color: #777;
    margin-left: 0.5rem;
}

.task-list {
    border: 1px solid #eee;
    border-radius: 5px;
    min-height: 200px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #aaa;
    text-align: center;
}

.empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    transition: background-color 0.3s;
}

.task-item:last-child {
    border-bottom: none;
}

.task-item:hover {
    background-color: #f9f9f9;
}

.task-item.dragging {
    opacity: 0.5;
}

.task-item.completed .task-text {
    text-decoration: line-through;
    color: #aaa;
}

.task-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex: 1;
}

.task-check {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.task-text {
    font-size: 1rem;
    word-break: break-word;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
}

.edit-btn, .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.3rem;
    border-radius: 3px;
    transition: background-color 0.3s;
}

.edit-btn:hover {
    background-color: #e1e1e1;
    color: #0088cc;
}

.delete-btn:hover {
    background-color: #ffebee;
    color: #f44336;
}

/* Task stats */
.task-stats {
    display: flex;
    justify-content: space-around;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 5px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.stat i {
    color: #0088cc;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 5px;
    width: 90%;
    max-width: 500px;
    position: relative;
}

.close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
}

#edit-input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    margin: 1rem 0;
}

#save-edit {
    background-color: #0088cc;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.8rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
}

#save-edit:hover {
    background-color: #006699;
}

/* Responsive design */
@media (min-width: 768px) {
    .task-controls {
        grid-template-columns: 2fr 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .container {
        margin: 0;
        border-radius: 0;
        min-height: 100vh;
    }
    
    .task-stats {
        flex-direction: column;
        gap: 1rem;
    }
}
```

### Step 4: Implement JavaScript Functionality

Open `app.js` and add the following code:

```javascript
// Task Manager Application

// DOM Elements
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');
const totalTasks = document.getElementById('total-tasks');
const pendingTasks = document.getElementById('pending-tasks');
const completedTasks = document.getElementById('completed-tasks');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const taskTemplate = document.getElementById('task-template');
const editModal = document.getElementById('edit-modal');
const closeModal = document.querySelector('.close-modal');
const editInput = document.getElementById('edit-input');
const saveEditButton = document.getElementById('save-edit');
const emptyState = document.querySelector('.empty-state');

// App State
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// Initialize the app
function init() {
    loadTasksFromLocalStorage();
    renderTasks();
    updateTaskStats();
    
    // Event listeners
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    taskList.addEventListener('click', handleTaskActions);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            setFilter(button.dataset.filter);
        });
    });
    
    searchInput.addEventListener('input', filterTasks);
    
    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });
    
    saveEditButton.addEventListener('click', saveEditedTask);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });
    
    // Drag and drop functionality
    taskList.addEventListener('dragstart', handleDragStart);
    taskList.addEventListener('dragover', handleDragOver);
    taskList.addEventListener('drop', handleDrop);
    taskList.addEventListener('dragend', handleDragEnd);
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') return;
    
    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.unshift(newTask);
    saveTasksToLocalStorage();
    
    taskInput.value = '';
    renderTasks();
    updateTaskStats();
}

// Render tasks based on current filter and search
function renderTasks() {
    // Clear all tasks except empty state
    const taskElements = taskList.querySelectorAll('.task-item');
    taskElements.forEach(element => element.remove());
    
    // Filter and search tasks
    const filteredTasks = tasks.filter(task => {
        const matchesFilter = 
            currentFilter === 'all' || 
            (currentFilter === 'completed' && task.completed) || 
            (currentFilter === 'pending' && !task.completed);
            
        const searchTerm = searchInput.value.toLowerCase();
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        
        return matchesFilter && matchesSearch;
    });
    
    // Show or hide empty state
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
    }
    
    // Create task elements
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    // Update task counter
    taskCounter.textContent = `(${filteredTasks.length})`;
}

// Create a task element from template
function createTaskElement(task) {
    const taskElement = document.importNode(taskTemplate.content, true).querySelector('.task-item');
    
    const checkbox = taskElement.querySelector('.task-check');
    const taskText = taskElement.querySelector('.task-text');
    
    taskElement.dataset.id = task.id;
    checkbox.checked = task.completed;
    taskText.textContent = task.text;
    
    if (task.completed) {
        taskElement.classList.add('completed');
    }
    
    return taskElement;
}

// Handle task actions (check, edit, delete)
function handleTaskActions(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.dataset.id;
    const task = tasks.find(t => t.id === taskId);
    
    if (e.target.classList.contains('task-check')) {
        toggleTaskCompletion(taskId, e.target.checked);
    } else if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
        openEditModal(task);
    } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        deleteTask(taskId);
    }
}

// Toggle task completion status
function toggleTaskCompletion(taskId, completed) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        saveTasksToLocalStorage();
        renderTasks();
        updateTaskStats();
    }
}

// Open edit modal for a task
function openEditModal(task) {
    editingTaskId = task.id;
    editInput.value = task.text;
    editModal.style.display = 'flex';
    editInput.focus();
}

// Save edited task
function saveEditedTask() {
    const newText = editInput.value.trim();
    
    if (newText === '') return;
    
    const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        saveTasksToLocalStorage();
        renderTasks();
    }
    
    editModal.style.display = 'none';
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage();
    renderTasks();
    updateTaskStats();
}

// Set current filter
function setFilter(filter) {
    currentFilter = filter;
    
    filterButtons.forEach(button => {
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Filter tasks based on search input
function filterTasks() {
    renderTasks();
}

// Update task statistics
function updateTaskStats() {
    totalTasks.textContent = tasks.length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
}

// Drag and drop functionality
let draggedTask = null;

function handleDragStart(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    draggedTask = taskItem;
    setTimeout(() => {
        taskItem.classList.add('dragging');
    }, 0);
}

function handleDragOver(e) {
    e.preventDefault();
    const taskItem = e.target.closest('.task-item');
    if (!taskItem || taskItem === draggedTask) return;
    
    const rect = taskItem.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isAfter = y > rect.height / 2;
    
    if (isAfter) {
        taskList.insertBefore(draggedTask, taskItem.nextSibling);
    } else {
        taskList.insertBefore(draggedTask, taskItem);
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    // Update tasks array to match new order
    const taskElements = Array.from(taskList.querySelectorAll('.task-item'));
    const newTasks = [];
    
    taskElements.forEach(element => {
        const taskId = element.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            newTasks.push(task);
        }
    });
    
    tasks = newTasks;
    saveTasksToLocalStorage();
}

function handleDragEnd() {
    draggedTask.classList.remove('dragging');
    draggedTask = null;
}

// Initialize the app
init();
```

### Step 5: Test Your Application

Open `index.html` in your browser and test the following functionality:
1. Adding new tasks
2. Marking tasks as complete
3. Editing tasks
4. Deleting tasks
5. Filtering tasks (All, Pending, Completed)
6. Searching for tasks
7. Drag and drop to reorder tasks
8. Verify that tasks persist after page reload (localStorage)

## Challenge Completion Criteria

To complete this challenge, your task manager application should:
1. Allow users to add, edit, and delete tasks
2. Support marking tasks as complete/incomplete
3. Include filtering and search functionality
4. Implement drag and drop for task reordering
5. Save tasks to localStorage for persistence
6. Be responsive across different screen sizes
7. Have a clean, user-friendly interface

{% if user.completed_challenge %}
  {% include gamification/challenge-complete.html 
    points=page.points 
    badges="javascript_expert,app_developer" 
  %}
{% else %}
  <div class="challenge-incomplete">
    <p>Complete this challenge to earn {{ page.points }} points and unlock new badges!</p>
    <button id="complete-challenge" onclick="completeChallenge('advanced-challenge')">Mark as Complete</button>
  </div>
{% endif %}

{% include gamification/level-progress.html %}

## Next Steps

Congratulations on completing this advanced challenge! Here are some ways to extend your application:
- Add due dates and priority levels to tasks
- Implement task categories or tags
- Create multiple task lists or projects
- Add user authentication
- Sync tasks with a backend server

{% comment %}
The JavaScript function completeChallenge() is defined in assets/js/gamification.js
It handles updating the user's points, badges, and progress
{% endcomment %}