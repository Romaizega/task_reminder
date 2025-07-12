const express = require('express');
const router = express.Router();

const { 
  getAlltasks,
  getTaskById,
  createTask,
  updateTask,
  markTask,
  deleteTask, 
  filterTask,
  filterTasksToday,
  filterTasksAfterToday,
  filterTasksBeforeToday
} = require("../controllers/tasksControllers.js");


router.get("/filter", filterTask)
router.get("/filter/today", filterTasksToday)
router.get("/filter/after", filterTasksAfterToday)
router.get("/filter/before", filterTasksBeforeToday)

router.get("/", getAlltasks);
router.get("/:id", getTaskById);
router.post("/", createTask);

router.put("/:id", updateTask);
router.patch("/:id", markTask);
router.delete("/:id", deleteTask);

module.exports = router