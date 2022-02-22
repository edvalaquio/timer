export type Time = Readonly<{
  minutes: number;
  seconds: number;
}>;

export type TimerId = string;

export type Timer = Readonly<{
  id: TimerId;
  name: string;
  rawTime: Time;
  totalSeconds: number;
}>;
