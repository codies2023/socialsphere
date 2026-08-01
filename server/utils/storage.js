import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, "..", "data", "storage.json");

const defaultData = {
  users: [],
  posts: [],
};

async function ensureStorageFile() {
  try {
    await fs.access(storagePath);
  } catch {
    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    await fs.writeFile(storagePath, JSON.stringify(defaultData, null, 2));
  }
}

export async function readData() {
  await ensureStorageFile();
  const file = await fs.readFile(storagePath, "utf8");
  return JSON.parse(file);
}

export async function writeData(data) {
  await ensureStorageFile();
  await fs.writeFile(storagePath, JSON.stringify(data, null, 2));
}
