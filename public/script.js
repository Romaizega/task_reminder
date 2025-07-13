const inputTitle = document.getElementById("taskTitle");
const inputDescription = document.getElementById("taskDescription");
const inputDeadline = document.getElementById("taskDeadline");
const inputChatId = document.getElementById("telegramChatId");
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

async function loadTasks() {
  try {
    const response = await fetch("/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const tasks = data.tasks;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      console.log("There are no any tasks");
      document.querySelector(".task-list").innerHTML = "<p class='text-muted'>No tasks available.</p>";
      return;
    }

    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = "";
    tasks.forEach(task => {      
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");
      taskItem.innerHTML = `
        <div class="p-3 mb-2 bg-dark text-white rounded shadow">
          <h5>${task.title}</h5>
          <p>${task.description}</p>
          <small> ${new Date(task.deadline_date).toLocaleString()}</small>
        </div>
      `;
      taskList.appendChild(taskItem);
    });

  } catch (error) {
    console.error("Show tasks error:", error.message);
  }
}
window.addEventListener("DOMContentLoaded", loadTasks);
