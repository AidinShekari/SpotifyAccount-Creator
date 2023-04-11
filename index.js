const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Telegram bot token obtained from BotFather
const token = 'TELEGRAM-TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Handle "/start" command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Hello, I'm here to help you create a Spotify account! \n\nTo create a new account, please type /register 🎧");
});

// Handle "/register" command
bot.onText(/\/register/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎧 Please give me account details like this:\nEmail: YourEmail\nPassword: YourPassword\nUsername: YourUsername");
});

// Listen for all messages
bot.on('message', (msg) => {
  if (msg.text.startsWith('Email:') &&
        msg.text.includes('\nPassword:') &&
        msg.text.includes('\nUsername:')) {
      const email = msg.text.split('\n')[0].split(':')[1].trim();
      const password = msg.text.split('\n')[1].split(':')[1].trim();
      const username = msg.text.split('\n')[2].split(':')[1].trim();

      const apiUrl = `https://spogentify.vercel.app/api/v1?name=${username}&email=${email}&password=${password}`;

      axios.get(apiUrl)
        .then(response => {
          if (response.data.status) {
            bot.sendMessage(msg.chat.id, "🎉 Account created successfully!");
          } else {
            bot.sendMessage(msg.chat.id, "❌ Failed to create account, please check your email.");
          }
        })
        .catch(error => {
          bot.sendMessage(msg.chat.id, "🚫 Error creating account, please try again later.");
        });
    }
});