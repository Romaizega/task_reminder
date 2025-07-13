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
        <div class="p-3 mb-2 bg-dark text-white rounded shadow d-flex justify-content-between align-items-center">
          <div>
            <h5>${task.title}</h5>
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
      deleteBtn.addEventListener("click", async() => {
        const id = deleteBtn.dataset.id;
        try {
          const response = await fetch(`/tasks/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            console.log("Task deleted:", id);
            await loadTasks();
          } else {
            console.error("Failed to delete task");
          }
        } catch (error) {
          console.error("Error deleting task", error);
        }
         
      });

      const editBtn = taskItem.querySelector(".edit-btn");
      editBtn.addEventListener("click", async() => {
        const id = editBtn.dataset.id;
        const newTitle = prompt("Write a new title", task.title);
        const newDesc = prompt("Write a new description", task.description);
        const newDeadline = prompt("Write a new date (YYYY-MM-DD HH:mm)", 
          new Date(task.deadline_date).toISOString().slice(0, 16).replace("T", " "));
        if(!newTitle || !newDeadline) {
          alert("Title and description are required")
          return
        }
        try {
          const response = await fetch(`/tasks/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: newTitle,
              description: newDesc,
              deadline_date: new Date(newDeadline).toISOString()
            })
          });
          if(response.ok) {
            console.log("Task edited", id);
            await loadTasks()
          } else {
            console.error("Failed to update task")
          }
        } catch (error) {
          console.error("Error deleting task", error);
        }
      })

      const markBtn = taskItem.querySelector(".mark-btn")
      markBtn.addEventListener("click", async()=>{
        const id = markBtn.dataset.id
                try {
          const response = await fetch(`/tasks/${id}/mark`, {
            method: "PATCH",
          });

          if (response.ok) {
            console.log("Task mark as completed:", id);
            await loadTasks();
          } else {
            console.error("Failed to mark task");
          }
        } catch (error) {
          console.error("Error marking task", error);
        }

      })
    });

  } catch (error) {
    console.error("Show tasks error:", error.message);
  }
}

window.addEventListener("DOMContentLoaded", loadTasks);
