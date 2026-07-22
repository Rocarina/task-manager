const API = "https://task-manager-a90l.onrender.com/tasks";

// Load tasks
async function loadTasks() {
    try {
        const res = await axios.get(API);
        const tasks = res.data;

        const list = document.getElementById("taskList");
        list.innerHTML = "";

        tasks.forEach(task => {

            const li = document.createElement("li");

            li.innerHTML = `
                <span class="${task.completed ? "completed" : ""}">
                    ${task.title}
                </span>

                <div class="buttons">

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
        console.error(err);
    }
}

// Add task
async function addTask() {

    const input = document.getElementById("taskInput");

    if (input.value.trim() === "")
        return;

    await axios.post(API, {
        title: input.value
    });

    input.value = "";

    loadTasks();

}

// Complete / Undo
async function toggleTask(id, completed) {

    await axios.put(`${API}/${id}`, {
        completed
    });

    loadTasks();

}

// Delete
async function deleteTask(id) {

    await axios.delete(`${API}/${id}`);

    loadTasks();

}

loadTasks();