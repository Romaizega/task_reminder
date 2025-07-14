# Task Manager — Telegram Reminder System
A full-featured task manager with Telegram bot integration for task reminders and notifications.

## Description
### This system allows users to:
- Create tasks with deadlines and optional reminders
- Select the Telegram chat ID to receive notifications
- Receive task reminders directly in Telegram
- Edit, delete, and mark tasks as completed
- Filter tasks: All, Today, Completed, Upcoming, or Expired

## Tech Stack
_Backend_:
- Node.js
- Express.js
- Knex.js
- PostgreSQL (hosted on Neon)

_Frontend_:
- HTML5
- Bootstrap 5
- Vanilla JavaScript

_Telegram Bot_:
- node-telegram-bot-api


### Recommendations for deploying the project locally

Clone project

```bash
git clone https://github.com/Romaizega/task_reminder.git
```

Navigate to the project folder
```bash
cd task-manager
```

Install dependencies:
```bash
npm install
```

Create a .env file in the root directory with the following values

```bash
PORT = 5000
PGHOST='your_neon_postgres_url'
PGDATABASE='your_namedb'
PGUSER='your_user'
PGPASSWORD='yiur_password'
TOKEN_TG_BOT=if you want to creat own telegram_bot
TG_ID=12345677
```
Run database migrations:
```bash
npx knex migrate:latest
```
Start the server:
```bash
npm run dev
```

The app will be accessible at http://localhost:5000


## Usage

- Visit the root page (/)
- Create a task with a title, description, deadline, and recipient
- Choose whether to enable Telegram reminders
- Tasks are saved and displayed immediately
- If reminders are enabled, your Telegram bot will send a message at the appropriate time

## Task Filters Available

- All — displays all tasks
- Uncompleted — only pending tasks
- Completed — tasks marked as done
- Today — tasks with today's deadline
- Upcoming — future tasks
- Expired — overdue tasks


### Author:
[Roman Izegov](https://github.com/Romaizega)