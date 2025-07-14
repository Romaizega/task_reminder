const { message } = require("statuses")
const db = require("../config/knex")
const bot = require("./telegram.js")
require('dotenv').config();



const remiderBot = setInterval(async()=>{
  try {
    const tasks = await db('tasks')
    .where('reminder', true)
    .andWhere('completed', false)
    .andWhere('deadline_date', '<=', new Date())
    if(tasks.length === 0) return;

    for(const task of tasks){
      const {id, telegram_chat_id, title, description} = task
      const message = `${title} \n ${description}`
      try {
        bot.sendMessage(telegram_chat_id, message)
        await db('tasks')
        .where({id})
        .update({reminder: false})
      } catch (error) {
        console.error(`Failed to send message`, error.message);
      }
     }
  } catch (error) {
    console.error("ReminderBot error:", error);
  }
}, 10000);

module.exports = remiderBot