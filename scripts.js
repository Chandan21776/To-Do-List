document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const allTasksButton = document.getElementById('all-tasks-button');
    const pendingTasksButton = document.getElementById('pending-tasks-button');

    const getTasksFromLocalStorage = () => JSON.parse(localStorage.getItem('tasks')) || [];
    const saveTasksToLocalStorage = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        const tasks = getTasksFromLocalStorage();
        const filteredTasks = filter === 'pending' ? tasks.filter(task => !task.completed) : tasks;
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = task.completed ? 'completed' : '';
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="edit" onclick="editTask(${index})">Edit</button>
                    <button class="remove" onclick="removeTask(${index})">Remove</button>
                    <button class="complete" onclick="toggleCompleteTask(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    };

    const addTask = () => {
        const tasks = getTasksFromLocalStorage();
        const newTask = { text: taskInput.value, completed: false };
        tasks.push(newTask);
        saveTasksToLocalStorage(tasks);
        renderTasks();
        taskInput.value = '';
    };

    window.removeTask = (index) => {
        const tasks = getTasksFromLocalStorage();
        tasks.splice(index, 1);
        saveTasksToLocalStorage(tasks);
        renderTasks();
    };

    window.toggleCompleteTask = (index) => {
        const tasks = getTasksFromLocalStorage();
        tasks[index].completed = !tasks[index].completed;
        saveTasksToLocalStorage(tasks);
        renderTasks();
    };

    window.editTask = (index) => {
        const tasks = getTasksFromLocalStorage();
        const newTaskText = prompt('Edit task:', tasks[index].text);
        if (newTaskText !== null) {
            tasks[index].text = newTaskText;
            saveTasksToLocalStorage(tasks);
            renderTasks();
        }
    };

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    allTasksButton.addEventListener('click', () => renderTasks('all'));
    pendingTasksButton.addEventListener('click', () => renderTasks('pending'));

    renderTasks();
});