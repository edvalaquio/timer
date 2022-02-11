import React, {
  FormEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { Time, Timer } from "./types";
import TimerService, { UnsavedTimer } from "./services/TimerService";

const ONE_MS = 1000;

function secondsToTime(seconds: number): Time {
  const newMinutes = Math.floor(seconds / 60);
  const newSeconds = seconds % 60;
  return {
    minutes: newMinutes,
    seconds: newSeconds,
  };
}

function ActiveTimer({
  name,
  remainingTime,
}: {
  id: string;
  name: string;
  remainingTime: number;
}): ReactElement {
  const { minutes, seconds } = secondsToTime(remainingTime);
  return (
    <>
      <h2>{name}</h2>
      <p>{minutes}</p>
      <p>{seconds}</p>
    </>
  );
}

function TimerForm({
  onAddTimer,
}: Readonly<{
  onAddTimer: (unsavedTimer: UnsavedTimer) => Promise<void>;
}>): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const [nameValue, minutesValue, secondsValue] = [
      nameRef?.current?.value,
      minuteRef?.current?.value,
      secondRef?.current?.value,
    ];

    if (nameValue == null || minutesValue == null || secondsValue == null) {
      throw Error("Something went wrong");
    }

    await onAddTimer({
      name: nameValue,
      minutes: Number(minutesValue),
      seconds: Number(secondsValue),
    });

    formRef?.current?.reset();
  };

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <label>
        name: <input type="text" name="name" ref={nameRef} required />
      </label>
      <label>
        minute: <input type="text" name="minute" ref={minuteRef} required />
      </label>
      <label>
        second: <input type="text" name="second" ref={secondRef} required />
      </label>
      <button type="submit" name="add">
        add
      </button>
    </form>
  );
}

function getTotalSeconds({ minutes, seconds }: Time): number {
  return minutes * 60 + seconds;
}

function App(): ReactElement {
  const [timers, setTimers] = useState<ReadonlyArray<Timer>>();
  const [activeTimer, setActiveTimer] = useState<{
    id: string;
    name: string;
    remainingTime: number;
  }>();

  async function fetchTimers() {
    console.log("Fetching timers");
    const timers = await TimerService.getMany();
    setTimers(timers);
  }

  useEffect(() => {
    fetchTimers();
  }, []);

  useEffect(() => {
    if (!activeTimer) return;
    if (activeTimer.remainingTime === 0) {
      console.info("Timer completed");
      return;
    }

    const timeout = setTimeout(() => {
      setActiveTimer({
        ...activeTimer,
        remainingTime: activeTimer.remainingTime - 1,
      });
    }, ONE_MS);

    return () => clearTimeout(timeout);
  }, [activeTimer]);

  async function onAddTimer(unsavedTimer: UnsavedTimer) {
    await TimerService.create(unsavedTimer);
    await fetchTimers();
  }

  function onStartTimers() {
    if (!timers || timers.length === 0) throw Error("No timers available");

    const { id, name, minutes, seconds } = timers[0];
    setActiveTimer({
      id,
      name,
      remainingTime: getTotalSeconds({ minutes, seconds }),
    });
  }

  return (
    <div>
      <header className="App-header">
        <h1>Timer</h1>
      </header>
      <section>
        <div>
          <button onClick={onStartTimers}>Start</button>
          <button>Pause</button>
          <button>Reset</button>
        </div>
        <TimerForm onAddTimer={onAddTimer} />
        <div>{activeTimer && <ActiveTimer {...activeTimer} />}</div>
        <div>
          {timers && timers.length > 0 ? (
            timers.map(({ name, minutes, seconds }, index) => {
              return (
                <div key={index}>
                  <h2>{index + 1}</h2>
                  <p>{name}</p>
                  <p>{`minutes: ${minutes}`}</p>
                  <p>{`seconds: ${seconds}`}</p>
                </div>
              );
            })
          ) : (
            <h1>No available timers</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
