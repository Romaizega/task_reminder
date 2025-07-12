const { message } = require("statuses")
const db = require("../config/knex")

const getAlltasks = async(req, res) => {
  try {
    const tasks = await db('tasks')
    .select('*')
    if(tasks.length === 0){
    return res.status(400).json({message: "There are no any tasks"})
    }
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
      telegram_chat_id,
      reminder
    })
    .returning('*')
    res.status(201).json({message: "Tasks created successfully", task: newTask})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error"})
  }
}

const updateTask = async(req, res) =>{
  const id = Number(req.params.id)
  const {title, description, deadline_date, reminder} = req.body;
  try {
    const task = await db('tasks')
    .where({id}).first()
  if(!task){
    return res.status(400).json({error: "Task not found"})
  }
  const [updatedTask] = await db('tasks')
  .where({id})
  .update({title, description, deadline_date, reminder})
  .returning(["title", "description", "deadline_date"])
  res.status(200).json({message: "Task updated successfully", updatedTask})
  } catch (error) {
  console.error(error)
  res.status(500).json({error: "Server error"})
  }
}

const markTask = async(req, res) => {
  const id = Number(req.params.id)
  try {
    const task = await db('tasks')
    .where({id}).first()
    if(!task){
      return res.status(400).json({error: "Task not found"})
    }
    const [markTask] = await db('tasks')
    .where({id})
    .update({completed: true})
    .returning('*')
    return res.status(200).json({message: "Task marked as done", task_completed: markTask})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error"})
  }
}

const deleteTask = async(req, res) => {
  const id = Number(req.params.id);
  try {
    const task = await db('tasks')
    .where({id}).first()
    if(!task){
      return res.status(400).json({error: "Task not found"})
    }
    await db('tasks').where({ id }).del();
    return res.status(200).json({ message: "Task deleted successfully", deletedTask: task });
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error"})
  }
}

const filterTask = async(req, res)=>{
  try {
    const filterTasks = await db('tasks')
    .select('title', 'description', 'deadline_date', 'created_at')
    .where('completed', false)
    .orderBy('created_at', 'desc')
    if(filterTasks.length === 0){
      return res.status(400).json({message: "All task marked as completed"})
    }
    res.status(200).json({message: "Your uncompleted tasks", filterTasks})
  } catch (error) {
    console.error(error, error.message)
    res.status(500).json({error: "Server error"})
  }
}

const filterTasksToday = async(req, res)=>{
  const today = new Date().toISOString().split('T')[0];
  try {
    const tasks = await db('tasks')
      .select('title', 'description', 'deadline_date')
      .where('reminder', true)
      .andWhere('completed', false)
      .whereRaw('DATE(deadline_date) = ?', [today])
      .orderBy('title', 'desc')
      if(tasks.length === 0) {
        return res.status(200).json({ message: "No tasks scheduled for today"});
      }
      res.status(200).json({ message: "Tasks for today", tasks})
  } catch (error) {
    console.error(error, error.message)
    res.status(500).json({error: "Server error"})
  }
}

module.exports = {
  getAlltasks,
  getTaskById,
  createTask,
  updateTask,
  markTask,
  deleteTask,
  filterTask,
  filterTasksToday
}