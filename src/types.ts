export type Time = Readonly<{
  minutes: number;
  seconds: number;
}>;

// TODO: Time should be a property within Timer, not members
export type Timer = Readonly<{
  id: string;
  name: string;
}> &
  Time;
