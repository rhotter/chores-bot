# Chores Bot

A Slack bot for managing dishwasher chores rotation at lxm.

## Features

- Daily reminders for who needs to unload the dishwasher
- Weekly schedule posts every Sunday
- Ability to opt-out of next rotation

## Setup

1. Create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable Socket Mode
3. Add the following bot token scopes:
   - `chat:write`
   - `commands`
4. Install the app to your workspace
5. Copy the `.env.example` file to `.env` and fill in your tokens:

   - `SLACK_BOT_TOKEN`: Your bot token (starts with `xoxb-`)
   - `SLACK_APP_TOKEN`: Your app token (starts with `xapp-`)
   - `SLACK_SIGNING_SECRET`: Your app's signing secret
   - `CHORES_CHANNEL_ID`: The ID of the channel where the bot will post

6. Install dependencies:

   ```bash
   npm install
   ```

7. Build the TypeScript code:

   ```bash
   npm run build
   ```

8. Start the bot:
   ```bash
   npm start
   ```

For development:

```bash
npm run dev
```

## Usage

- `/chores` - View the current rotation schedule
- `/chores opt-out` - Opt out of your next rotation
- `/chores opt-in` - Opt back into the rotation

The bot will:

- Post daily reminders at 9 AM
- Post the weekly schedule every Sunday at 9 AM
- Show who's opted out in the schedule

## Data Storage

The bot stores its data in a `data.json` file. You can manually edit this file to:

- Add housemates
- Set up the initial schedule
- Manage opt-outs

## Development

The project is written in TypeScript. To run the bot in development mode with auto-restart:

```bash
npm run dev
```

To watch for TypeScript changes:

```bash
npm run watch
```
