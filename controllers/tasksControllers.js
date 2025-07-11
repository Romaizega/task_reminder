const { message } = require("statuses")
const db = require("../config/knex")

const getAlltasks = async(req, res) => {
  try {
    const tasks = await db('tasks')
    .select('*')
    res.status(200).json({message: "You got all tasks", tasks})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error"})
  }
}


const getTaskById = async(req, res) =>{
  const id = Number(req.params.id)
  try {
    const task = await db('tasks')
    .where({id}).first()
    if(!task){
    return  res.status(404).json({error: "Task not found"})
    }
    res.status(200).json({
      message: "Task founded successfully",
    task})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error"})
  }
}

const createTask = async(req, res) => {
  const {
    title,
    description,
    deadline_date,
    telegram_chat_id,
    reminder,
    completed,
    created_at} = req.body;
  if(!title || !deadline_date) {
      return res.status(400).json({error: "Title and deadline_date are required"})
    }
  try {
    const existsTask = await db('tasks').where({title, deadline_date}).first()
    if(existsTask){
      return res.status(400).json({error: "Task already exists"})
    }
    const [newTask] = await db('tasks')
    .insert({
      title,
      description,
      deadline_date,
      telegram_chat_id
    })
    .returning('*')
    res.status(201).json({message: "Tasks created successfully", task: newTask})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error"})
  }
}

const updateTask = async(req, res) =>{
  res.send("updateTask")
}

const markTask = async(req, res) => {
  res.send("markTask")
}

const deleteTask = async(req, res) => {
  res.send("deleteTask")
}

module.exports = {
  getAlltasks,
  getTaskById,
  createTask,
  updateTask,
  markTask,
  deleteTask
}