const ms = require("ms");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new telegramBot(process.env.TOKEN_TG_BOT, {polling: true});

// bot.on("message", (msg) => {
//   if (msg.text === "/start") {
//     bot.sendMessage(msg.chat.id, "Hello! I could help you");
//   }
// });

bot.on("message", (msg) => {
  if(msg.text === "/chat") {
    bot.sendMessage(msg.chat.id, `You telegram id: ${msg.chat.id}`)
  }
})

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🆔 Get ID', callback_data: 'get_id' },
          { text: '❌ Remove', callback_data: 'delete' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, 'HI! Please, choose:', options);
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  if (action === 'get_id') {
    bot.sendMessage(chatId, `🆔 Your Telegram ID: ${chatId}`);
  } else if (action === 'delete') {
    bot.sendMessage(chatId, `⚠️ ID deleted (almost)`);
  }

  bot.answerCallbackQuery(query.id);
});

module.exports = bot;