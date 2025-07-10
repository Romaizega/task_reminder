const express = require('express');
const router = express.Router();

const { 
  getAlltasks,
  getTaskById,
  createTask,
  updateTask,
  markTask,
  deleteTask
} = require("../controllers/controllersTasks.js");


router.get("/", getAlltasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id", markTask);
router.delete("/:id", deleteTask);

module.exports = router