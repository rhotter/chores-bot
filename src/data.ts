import { promises as fs } from "fs";
import path from "path";
import { ChoresData, Housemate, ScheduleAssignment } from "./types";

const DATA_FILE = path.join(__dirname, "../data.json");

// Initialize data file if it doesn't exist
async function initializeDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData: ChoresData = {
      housemates: [],
      schedule: [],
      optOuts: [],
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

async function readData(): Promise<ChoresData> {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data);
}

async function writeData(data: ChoresData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function getHousemates(): Promise<Housemate[]> {
  await initializeDataFile();
  const data = await readData();
  return data.housemates;
}

export async function getSchedule(): Promise<ScheduleAssignment[]> {
  await initializeDataFile();
  const data = await readData();
  return data.schedule;
}

export async function getOptOuts(): Promise<string[]> {
  await initializeDataFile();
  const data = await readData();
  return data.optOuts;
}

export async function addHousemate(
  userId: string,
  name: string
): Promise<boolean> {
  await initializeDataFile();
  const data = await readData();
  if (!data.housemates.some((h) => h.id === userId)) {
    data.housemates.push({ id: userId, name });
    await writeData(data);
    return true;
  }
  return false;
}

export async function setSchedule(
  schedule: ScheduleAssignment[]
): Promise<void> {
  await initializeDataFile();
  const data = await readData();
  data.schedule = schedule;
  await writeData(data);
}

export async function optOut(userId: string): Promise<boolean> {
  await initializeDataFile();
  const data = await readData();
  if (!data.optOuts.includes(userId)) {
    data.optOuts.push(userId);
    await writeData(data);
    return true;
  }
  return false;
}

export async function optIn(userId: string): Promise<boolean> {
  await initializeDataFile();
  const data = await readData();
  const index = data.optOuts.indexOf(userId);
  if (index !== -1) {
    data.optOuts.splice(index, 1);
    await writeData(data);
    return true;
  }
  return false;
}
