const inputTitle = document.getElementById("taskTitle");
const inputDescription = document.getElementById("taskDescription");
const inputDeadline = document.getElementById("taskDeadline");
const inputChatId = document.getElementById("telegramChatId");
const inputReminder = document.getElementById("setReminder");
const btnAdd = document.getElementById("button_add")
const formTask = document.getElementById("task-form");

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
    } else {
      alert("Something went wrong");
      console.error(result);
    }

  } catch (error) {
    console.error("Error creating task:", error.message);
  }
});
