const express = require('express');
const app = express();
const db = require('./config/knex.js')
const tasks_routers = require("./routers/tasksRouters.js")
const bot = require("./telegram/telegram.js")
const reminderBot = require("./telegram/reminderBot.js")

require('dotenv').config();
app.use(express.json());

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
  console.log(`The server running on ${PORT}`);
})

app.use("/tasks", tasks_routers)

app.get('/db-test', async (req, res) => {
  try {
    const result = await db.raw('SELECT NOW()');
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});