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
  res.send("createTask")
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