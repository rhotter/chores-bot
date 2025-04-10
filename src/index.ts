import "dotenv/config";
import { App, SlackCommandMiddlewareArgs } from "@slack/bolt";
import cron from "node-cron";
import {
  getHousemates,
  getSchedule,
  getOptOuts,
  addHousemate,
  setSchedule,
  optOut,
  optIn,
} from "./data";
import { Housemate, ScheduleAssignment } from "./types";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
});

// Helper function to format schedule message
async function formatScheduleMessage(): Promise<string> {
  const schedule = await getSchedule();
  const housemates = await getHousemates();
  const optOuts = await getOptOuts();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date().getDay();

  let message = "*This Week's Dishwasher Schedule*\n\n";

  schedule.forEach((assignment: ScheduleAssignment, index: number) => {
    const housemate = housemates.find(
      (h: Housemate) => h.id === assignment.userId
    );
    const isOptedOut = optOuts.includes(assignment.userId);
    const isToday = index === today;

    if (housemate) {
      message += `${isToday ? ">" : ""}*${days[index]}*: ${housemate.name}${
        isOptedOut ? " (Opted Out)" : ""
      }\n`;
    }
  });

  return message;
}

// Daily reminder
cron.schedule("0 9 * * *", async () => {
  const schedule = await getSchedule();
  const today = new Date().getDay();
  const todayAssignment = schedule[today];
  const housemates = await getHousemates();
  const housemate = housemates.find(
    (h: Housemate) => h.id === todayAssignment.userId
  );
  const optOuts = await getOptOuts();

  if (housemate && !optOuts.includes(todayAssignment.userId)) {
    await app.client.chat.postMessage({
      channel: process.env.CHORES_CHANNEL_ID!,
      text: `Good morning! Today is ${housemate.name}'s turn to unload the dishwasher.`,
    });
  }
});

// Weekly schedule post
cron.schedule("0 9 * * 0", async () => {
  await app.client.chat.postMessage({
    channel: process.env.CHORES_CHANNEL_ID!,
    text: await formatScheduleMessage(),
  });
});

// Handle /chores command
app.command(
  "/chores",
  async ({ command, ack, say }: SlackCommandMiddlewareArgs) => {
    await ack();

    const [action, ...args] = command.text.split(" ");

    switch (action) {
      case "opt-out":
        if (await optOut(command.user_id)) {
          await say(`You've been opted out of the next rotation.`);
        } else {
          await say(`You're already opted out.`);
        }
        break;

      case "opt-in":
        if (await optIn(command.user_id)) {
          await say(`You've been opted back into the rotation.`);
        } else {
          await say(`You're already in the rotation.`);
        }
        break;

      default:
        await say(await formatScheduleMessage());
    }
  }
);

// Start the app
(async () => {
  await app.start();
  console.log("⚡️ Chores bot is running!");
})();
