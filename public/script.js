const inputTitle = document.getElementById("taskTitle");
const inputDescription = document.getElementById("taskDescription");
const inputDeadline = document.getElementById("taskDeadline");
const inputChatId = document.getElementById("telegramChatIdInput");
const inputReminder = document.getElementById("setReminder");
const btnAdd = document.getElementById("button_add")
const formTask = document.querySelector(".task-form");

formTask.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTask = {
    title: inputTitle.value.trim(),                 
    description: inputDescription.value.trim(),
    deadline_date: new Date(inputDeadline.value).toISOString(),
    telegram_chat_id: inputChatId.value.trim(),
    reminder: inputReminder.checked
  };

  if (!newTask.title || !newTask.deadline_date || !newTask.telegram_chat_id) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const response = await fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const result = await response.json();

    if (response.ok) {
      console.log("Task created", result);
      formTask.reset();
      await loadTasks();
    } else {
      alert("Something went wrong");
      console.error(result);
    }
  } catch (error) {
    console.error("Error creating task:", error.message);
  }
});

function renderTasks(tasks) {
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";

  if (!Array.isArray(tasks) || tasks.length === 0) {
    taskList.innerHTML = "<p class='text-white opacity-75'>No tasks available</p>";
    return;
  }

  tasks.forEach(task => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
      <div class="p-3 mb-2 bg-dark text-white rounded shadow d-flex justify-content-between align-items-center">
        <div>
          <h5 class="${task.completed ? 'text-decoration-line-through opacity-50' : ''}">${task.title}</h5>
          <p>${task.description || ''}</p>
          <small>${new Date(task.deadline_date).toLocaleString()}</small>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-success mark-btn" data-id="${task.id}" title="Mark as done">
            <i class="bi bi-check2-circle"></i>
          </button>
          <button class="btn btn-sm btn-warning edit-btn" data-id="${task.id}" title="Edit task">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${task.id}" title="Delete task">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
    taskList.appendChild(taskItem);

    const deleteBtn = taskItem.querySelector(".delete-btn");
    const editBtn = taskItem.querySelector(".edit-btn");
    const markBtn = taskItem.querySelector(".mark-btn");

    deleteBtn.addEventListener("click", async () => {
      const id = deleteBtn.dataset.id;
      await fetch(`/tasks/${id}`, { method: "DELETE" });
      await loadTasks();
    });

    editBtn.addEventListener("click", async () => {
      const id = editBtn.dataset.id;
      const newTitle = prompt("Write a new title", task.title);
      const newDesc = prompt("Write a new description", task.description);
      const newDeadline = prompt("Write a new date", new Date(task.deadline_date).toISOString().slice(0, 16));
      if (!newTitle || !newDeadline) return;
      await fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          deadline_date: new Date(newDeadline).toISOString()
        })
      });
      await loadTasks();
    });

    markBtn.addEventListener("click", async () => {
      const id = markBtn.dataset.id;
      await fetch(`/tasks/${id}/mark`, { method: "PATCH" });
      taskItem.remove();
    });
  });
}

const activeBtn = document.querySelectorAll(".nav-link");

function setActiveTab(clickedId) {
  activeBtn.forEach(btn => {
    if (btn.id === clickedId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

async function loadTasks() {
  const res = await fetch("/tasks");
  const data = await res.json();
  renderTasks(data.tasks);
}

async function loadUncompletedTasks() {
  const res = await fetch("/tasks");
  const data = await res.json();
  const uncompleted = data.tasks.filter(task => !task.completed);
  renderTasks(uncompleted);
}

async function loadCompletedTasks() {
  const res = await fetch("/tasks");
  const data = await res.json();
  const completed = data.tasks.filter(task => task.completed);
  renderTasks(completed);
}

async function loadTasksToday() {
  const res = await fetch("/tasks/filter/today");
  const data = await res.json();
  renderTasks(data.tasks);
}

async function loadTasksTomorrow() {
  const res = await fetch("/tasks/filter/after");
  const data = await res.json();
  renderTasks(data.tasks);
}

async function loadExpiredTasks() {
  const res = await fetch("/tasks/filter/before");
  const data = await res.json();
  renderTasks(data.tasks);
}

document.getElementById("allTasks").addEventListener("click", () => {
   loadTasks();
   setActiveTab("allTasks")
});
document.getElementById("tasksUncompl").addEventListener("click", () => {
  loadUncompletedTasks();
  setActiveTab("tasksUncompl")
});
document.getElementById("taskCompleted").addEventListener("click", () => {
  loadCompletedTasks();
  setActiveTab("taskCompleted")
});
document.getElementById("tasksToday").addEventListener("click", () => {
  loadTasksToday();
  setActiveTab("tasksToday")
}) 
  
document.getElementById("tasksTommorow").addEventListener("click", () => {
  loadTasksTomorrow();
  setActiveTab("tasksTommorow")
});
document.getElementById("tasksBefore").addEventListener("click", () => {
   loadExpiredTasks();
   setActiveTab("tasksBefore")
});

async function loadChatIds() {
  try {
    const res = await fetch("/api/ids/chat-ids");
    const data = await res.json();

    const select = document.getElementById("telegramChatIdInput");
    select.innerHTML = `<option value="">-------------</option>`;

    data.forEach(person => {
      const option = document.createElement("option");
      option.value = person.id;
      option.textContent = person.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load Telegram chat IDs", err);
  }
}

window.addEventListener("DOMContentLoaded", loadChatIds);