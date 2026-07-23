const API = "https://task-manager-l285.onrender.com";
let token = localStorage.getItem("token");

// Show Task Section if Logged In
if (token) {
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("taskSection").style.display = "block";
    loadTasks();
}

// Register User
async function registerUser() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        await axios.post(`${API}/auth/register`, {
            name,
            email,
            password
        });

        alert("Registration Successful! Please Login.");

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";

    } catch (err) {
        alert(err.response.data.message);
    }
}

// Login User
async function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await axios.post(`${API}/auth/login`, {
            email,
            password
        });

        token = res.data.token;
        localStorage.setItem("token", token);

        document.getElementById("registerSection").style.display = "none";
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("taskSection").style.display = "block";

        loadTasks();

    } catch (err) {
        alert(err.response.data.message);
    }
}

// Logout
function logoutUser() {
    localStorage.removeItem("token");
    location.reload();
}

// Load Tasks
async function loadTasks() {
    try {
        const res = await axios.get(`${API}/tasks`, {
            headers: {
                Authorization: token
            }
        });

        const tasks = res.data;
        const list = document.getElementById("taskList");
        list.innerHTML = "";

        tasks.forEach(task => {

            const category = task.category || "Personal";

            const li = document.createElement("li");

            li.innerHTML = `
                <div class="task-info">

                    <span class="${task.completed ? "completed" : ""}">
                        ${task.title}
                    </span>

                    <span class="category ${category.toLowerCase()}">
                        ${category}
                    </span>

                </div>

                <div class="buttons">

                    <button class="edit-btn"
                    onclick="editTask('${task._id}','${task.title}')">
                    Edit
                    </button>

                    <button class="complete-btn"
                    onclick="toggleTask('${task._id}',${!task.completed})">
                    ${task.completed ? "Undo" : "Complete"}
                    </button>

                    <button class="delete-btn"
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

// Add Task
async function addTask() {

    const title = document.getElementById("taskInput").value;
    const category = document.getElementById("category").value;

    if (title.trim() === "") {
        alert("Enter a task");
        return;
    }

    await axios.post(`${API}/tasks`,
        {
            title,
            category
        },
        {
            headers: {
                Authorization: token
            }
        });

    document.getElementById("taskInput").value = "";

    loadTasks();
}

// Edit Task
async function editTask(id, currentTitle) {

    const title = prompt("Edit Task", currentTitle);

    if (!title) return;

    await axios.put(`${API}/tasks/${id}`,
        {
            title
        },
        {
            headers: {
                Authorization: token
            }
        });

    loadTasks();
}

// Complete Task
async function toggleTask(id, completed) {

    await axios.put(`${API}/tasks/${id}`,
        {
            completed
        },
        {
            headers: {
                Authorization: token
            }
        });

    loadTasks();
}

// Delete Task
async function deleteTask(id) {

    await axios.delete(`${API}/tasks/${id}`,
        {
            headers: {
                Authorization: token
            }
        });

    loadTasks();
}