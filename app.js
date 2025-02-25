// Select DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const ongoingTasks = document.getElementById('ongoingTasks');
const completedTasks = document.getElementById('completedTasks');
const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');

let currentTaskItem = null;

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    addTask(taskText, false);
    saveTaskToLocalStorage(taskText, false);
    taskInput.value = '';
  }
});

// Remove, update, or mark task as done
document.addEventListener('click', function (e) {
  const target = e.target;
  const taskItem = target.closest('.list-group-item');

  if (target.classList.contains('delete-btn')) {
    // Remove task
    taskItem.remove();
    removeTaskFromLocalStorage(taskItem);
  } else if (target.classList.contains('edit-btn')) {
    // Open modal for editing task
    currentTaskItem = taskItem;
    editTaskInput.value = taskItem.querySelector('.task-text').textContent;
    editTaskModal.show();
  } else if (target.classList.contains('check-circle')) {
    // Mark task as done or undone
    const isCompleted = taskItem.parentElement.id === 'completedTasks';
    moveTask(taskItem, isCompleted);
    updateTaskCompletionInLocalStorage(taskItem, !isCompleted);
  }
});

// Save edited task
saveEditBtn.addEventListener('click', function () {
  const newText = editTaskInput.value.trim();
  if (newText !== '' && currentTaskItem) {
    currentTaskItem.querySelector('.task-text').textContent = newText;
    updateTaskInLocalStorage(currentTaskItem, newText);
    editTaskModal.hide();
  }
});

// Function to add a task
function addTask(taskText, isCompleted) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.innerHTML = `
    <div class="check-circle ${isCompleted ? 'checked' : ''}"></div>
    <span class="task-text ${isCompleted ? 'completed' : ''}">${taskText}</span>
    <div>
      <button class="btn btn-warning btn-sm edit-btn">Edit</button>
      <button class="btn btn-danger btn-sm delete-btn">Delete</button>
    </div>
  `;
  if (isCompleted) {
    completedTasks.appendChild(li);
  } else {
    ongoingTasks.appendChild(li);
  }
}

// Function to move task between sections
function moveTask(taskItem, isCompleted) {
  if (isCompleted) {
    ongoingTasks.appendChild(taskItem);
  } else {
    completedTasks.appendChild(taskItem);
  }
  taskItem.querySelector('.check-circle').classList.toggle('checked');
  taskItem.querySelector('.task-text').classList.toggle('completed');
}

// Function to save task to localStorage
function saveTaskToLocalStorage(taskText, isCompleted) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text: taskText, completed: isCompleted });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task && task.text && typeof task.text === 'string');
  tasks.forEach(task => addTask(task.text, task.completed));
}

// Function to remove task from localStorage
function removeTaskFromLocalStorage(taskItem) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskText = taskItem.querySelector('.task-text').textContent;
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update task in localStorage
function updateTaskInLocalStorage(taskItem, newText) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const oldText = taskItem.querySelector('.task-text').textContent;
  const index = tasks.findIndex(task => task.text === oldText);
  if (index !== -1) {
    tasks[index].text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Function to update task completion in localStorage
function updateTaskCompletionInLocalStorage(taskItem, isCompleted) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskText = taskItem.querySelector('.task-text').textContent;
  const index = tasks.findIndex(task => task.text === taskText);
  if (index !== -1) {
    tasks[index].completed = isCompleted;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}