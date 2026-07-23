const API = "https://task-manager-l285.onrender.com/tasks";

// Load Tasks
async function loadTasks() {
    try {
        const res = await axios.get(API);
        const tasks = res.data;

        const list = document.getElementById("taskList");
        list.innerHTML = "";

        tasks.forEach(task => {

            const category = task.category ? task.category : "Personal";

            const li = document.createElement("li");

            li.innerHTML = `
                <div class="task-info">

                    <span class="${task.completed ? "completed" : ""}">
                        ${task.title}
                    </span>

                    <span class="category ${String(category).toLowerCase()}">
                        ${category}
                    </span>

                </div>

                <div class="buttons">

                    <button
                        class="edit-btn"
                        onclick="editTask('${task._id}', ${JSON.stringify(task.title)})">
                        Edit
                    </button>

                    <button
                        class="complete-btn"
                        onclick="toggleTask('${task._id}', ${!task.completed})">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask('${task._id}')">
                        Delete
                    </button>

                </div>
            `;

            list.appendChild(li);

        });

    } catch (err) {
        console.error("Error loading tasks:", err);
    }
}

// Add Task
async function addTask() {

    const input = document.getElementById("taskInput");
    const category = document.getElementById("category").value;

    if (input.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    try {

        await axios.post(API, {
            title: input.value.trim(),
            category: category
        });

        input.value = "";
        document.getElementById("category").value = "Personal";

        loadTasks();

    } catch (err) {
        console.error("Error adding task:", err);
    }

}

// Edit Task
async function editTask(id, currentTitle) {

    const newTitle = prompt("Edit Task", currentTitle);

    if (newTitle === null || newTitle.trim() === "")
        return;

    try {

        await axios.put(`${API}/${id}`, {
            title: newTitle.trim()
        });

        loadTasks();

    } catch (err) {
        console.error("Error editing task:", err);
    }

}

// Complete / Undo
async function toggleTask(id, completed) {

    try {

        await axios.put(`${API}/${id}`, {
            completed: completed
        });

        loadTasks();

    } catch (err) {
        console.error("Error updating task:", err);
    }

}

// Delete Task
async function deleteTask(id) {

    try {

        await axios.delete(`${API}/${id}`);

        loadTasks();

    } catch (err) {
        console.error("Error deleting task:", err);
    }

}

loadTasks();