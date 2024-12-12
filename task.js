document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const sortTasks = document.getElementById('sort-tasks');

    let tasks = [];

    // Add Task
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('due-date').value;
        const priority = document.getElementById('priority').value;

        const task = {
            id: Date.now(),
            title,
            description,
            dueDate,
            priority,
            completed: false,
            createdAt: new Date()
        };

        tasks.push(task);
        renderTasks();
        taskForm.reset();
    });

    // Render Tasks
    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            if (task.completed) {
                li.classList.add('completed');
            }

            const taskDetails = document.createElement('div');
            taskDetails.classList.add('task-details');
            taskDetails.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due: ${task.dueDate}</p>
            `;

            const taskPriority = document.createElement('span');
            taskPriority.classList.add('task-priority', task.priority);
            taskPriority.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

            const actions = document.createElement('div');
            actions.classList.add('actions');

            // Mark Completed
            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.addEventListener('click', () => toggleComplete(task.id));
            actions.appendChild(completeButton);

            // Delete Task
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            actions.appendChild(deleteButton);

            li.appendChild(taskDetails);
            li.appendChild(taskPriority);
            li.appendChild(actions);

            taskList.appendChild(li);
        });
    }

    // Toggle Task Completion
    function toggleComplete(taskId) {
        const task = tasks.find(t => t.id === taskId);
        task.completed = !task.completed;
        renderTasks();
    }

    // Delete Task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== taskId);
            renderTasks();
        }
    }

    // Sort Tasks
    sortTasks.addEventListener('change', function() {
        const sortBy = sortTasks.value;
        tasks.sort((a, b) => {
            if (sortBy === 'due-date') {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortBy === 'priority') {
                const priorities = ['high', 'medium', 'low'];
                return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
            } else if (sortBy === 'creation') {
                return a.createdAt - b.createdAt;
            }
        });
        renderTasks();
    });

    // Initial render
    renderTasks();
});
