import { set, values, get, del } from "idb-keyval";
import { v4 as uuidv4 } from "uuid";

import { Timer, TimerId, Time } from "../types";

export type UnsavedTimer = Readonly<{
  name: string;
  rawTime: Time;
  totalSeconds: number;
}>;

async function create(unsavedTimer: UnsavedTimer): Promise<void> {
  const id = uuidv4();

  await set(id, { id, ...unsavedTimer });
}

async function deleteById(timerId: TimerId) {
  await del(timerId);
}

async function getMany(): Promise<ReadonlyArray<Timer>> {
  return await values();
}

async function getById(timerId: string): Promise<Timer> {
  const timer = await get(timerId);

  if (!timer) throw Error("Timer does not exist in store");

  return timer;
}

export default {
  create,
  deleteById,
  getById,
  getMany,
};
