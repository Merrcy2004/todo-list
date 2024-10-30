document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'))

    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task))
        updateTasksList();
        updateStats();
    }
})

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        updateTasksList();
        taskInput.value = '';
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressBar = document.getElementById('progress');

    // Avoid division by zero
    if (totalTasks === 0) {
        progressBar.style.width = '0%';  // Set progress to 0% when there are no tasks
    } else {
        const progress = (completeTasks / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
    }

    document.getElementById('numbers').innerText = `${completeTasks}/${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blastConfetii();
    }
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput')
    taskInput.value = tasks[index].text

    tasks.splice(index, 1)
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateTasksList = () => {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = ''; // Clear previous task items

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        // Apply 'completed' class for tasks that are marked as completed
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ""}/>
                    <p class="task-text">${task.text}</p>
                </div>
                <div class="icons">
                    <img src="./img/edit.png" onClick="editTask(${index})"/>
                    <img src="./img/bin.png" onClick="deleteTask(${index})"/>
                </div>
            </div>
        `;

        listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));
        taskList.append(listItem);
    });
};

document.getElementById("newTask").addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const blastConfetii = async () => {
    const canvas = document.getElementById("my-canvas");
    canvas.confetti = canvas.confetti || (await confetti.create(canvas, { resize: true }));

    const randomCount = 50; // Number of confetti particles

    // Function to generate random positions for confetti bursts
    const randomConfetti = () => {
        // Randomly choose x position between 0 (left) and 1 (right)
        const x = Math.random(); // Random x between 0 and 1 (whole canvas)
        const y = Math.random() * 0.5; // Random y between 0 and 0.5 (appears above the canvas)

        // Create confetti at the random position
        canvas.confetti({
            particleCount: randomCount,
            spread: 70,
            origin: { x, y },
        });
    };

    // Fire random confetti bursts multiple times
    const burstCount = 5; // Number of bursts
    for (let i = 0; i < burstCount; i++) {
        randomConfetti();
        await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200 ms between bursts
    }
};

const clearAllTasks = () => {
    tasks = []; // Clear the tasks array
    updateTasksList(); // Update the displayed task list
    updateStats(); // Update the stats display
    saveTasks(); // Save the empty tasks array to localStorage
};

// Attach event listener to the Clear All button
document.getElementById("clearAll").addEventListener('click', clearAllTasks);
