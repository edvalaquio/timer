import React, { ReactElement, useEffect, useState } from "react";

import { Time, Timer } from "./types";
import TimerService from "./services/TimerService";
import TimerForm from "./components/TimerForm";

const ONE_MS = 1000;

function secondsToTime(seconds: number): Time {
  const newMinutes = Math.floor(seconds / 60);
  const newSeconds = seconds % 60;
  return {
    minutes: newMinutes,
    seconds: newSeconds,
  };
}

function ActiveTimer({ name, totalSeconds }: Timer): ReactElement {
  const { minutes, seconds } = secondsToTime(totalSeconds);
  return (
    <>
      <h2>{name}</h2>
      <p>{minutes}</p>
      <p>{seconds}</p>
    </>
  );
}

function App(): ReactElement {
  const [timers, setTimers] = useState<ReadonlyArray<Timer>>();
  const [activeTimer, setActiveTimer] = useState<Timer>();

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
    if (activeTimer.totalSeconds === 0) {
      console.info("Timer completed");
      return;
    }

    const { totalSeconds, ...restActiveTimer } = activeTimer;

    const timeout = setTimeout(() => {
      setActiveTimer({
        ...restActiveTimer,
        totalSeconds: totalSeconds - 1,
      });
    }, ONE_MS);

    return () => clearTimeout(timeout);
  }, [activeTimer]);

  function onStartTimers() {
    if (!timers || timers.length === 0) throw Error("No timers available");

    setActiveTimer(timers[0]);
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
        <TimerForm onSubmit={fetchTimers} />

        <div>{activeTimer && <ActiveTimer {...activeTimer} />}</div>
        <div>
          {timers && timers.length > 0 ? (
            timers.map(({ id, name, rawTime: { minutes, seconds } }, index) => {
              return (
                <div key={`${name}-${id}`}>
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
