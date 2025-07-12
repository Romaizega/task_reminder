const ms = require("ms");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new telegramBot(process.env.TOKEN_TG_BOT, {polling: true});

bot.on("message", (msg) => {
  if (msg.text !== "/start") {
    bot.sendMessage(msg.chat.id, "Hello there!");
  }
});

bot.on("message", (msg)=>{
  bot.sendMessage(msg.chat.id, "Hello there!")
});

module.exports = bot;