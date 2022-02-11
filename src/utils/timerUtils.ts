import { Time } from "../types";

export function getTotalSeconds({ minutes, seconds }: Time): number {
  return minutes * 60 + seconds;
}
