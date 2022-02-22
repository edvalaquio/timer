import React, { ReactElement, useEffect, useState } from "react";

import { Time, Timer } from "./types";
import TimerForm from "./components/TimerForm";
import useTimers from "./hooks/useTimers";

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
  const { timers, refreshTimers } = useTimers();

  const [activeTimersList, setActiveTimersList] =
    useState<ReadonlyArray<Timer>>(timers);
  const [activeTimer, setActiveTimer] = useState<Timer>();

  useEffect(() => {
    setActiveTimersList(timers);
  }, [timers]);

  useEffect(() => {
    if (!activeTimer) return;
    if (activeTimer.totalSeconds === 0) {
      console.info(`Timer ${activeTimer.id} completed`);
      const [nextTimer, ...otherTimers] = activeTimersList.filter(
        (timer) => timer.id !== activeTimer.id
      );
      setActiveTimer(nextTimer);
      setActiveTimersList(otherTimers);
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
  }, [activeTimer, activeTimersList]);

  function onStartTimers() {
    if (!activeTimersList || activeTimersList.length === 0) {
      throw Error("No timers available");
    }

    const [currentTimer, ...otherTimers] = activeTimersList;
    setActiveTimer(currentTimer);
    setActiveTimersList(otherTimers);
  }

  return (
    <div>
      <header className="App-header">
        <h1>Timer</h1>
      </header>
      <section>
        <TimerForm onSubmit={refreshTimers} />
        <div>
          <button onClick={onStartTimers}>Start</button>
          <button>Pause</button>
          <button onClick={refreshTimers}>Reset</button>
        </div>
        <div>
          {activeTimer ? (
            <ActiveTimer {...activeTimer} />
          ) : (
            <h1>No active timer</h1>
          )}
        </div>
        <div>
          {activeTimersList && activeTimersList.length > 0 ? (
            activeTimersList.map(
              ({ id, name, rawTime: { minutes, seconds } }, index) => {
                return (
                  <div key={`${name}-${id}`}>
                    <h2>{index + 1}</h2>
                    <p>{name}</p>
                    <p>{`minutes: ${minutes}`}</p>
                    <p>{`seconds: ${seconds}`}</p>
                  </div>
                );
              }
            )
          ) : (
            <h1>No available timers</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
