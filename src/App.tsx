import React, { ReactElement, useState } from "react";

type TimerDetails = Readonly<{
  minutes: number;
  seconds: number;
}>;

function TimerForm({
  index,
  minutes,
  seconds,
}: Readonly<{
  index: number;
  minutes: number;
  seconds: number;
}>): ReactElement {
  return (
    <>
      <h1>{index + 1}</h1>
      <form>
        <label>
          name: <input type="text" name="name" />
        </label>
        <label>
          minute: <input type="text" name="minute" defaultValue={minutes} />
        </label>
        <label>
          second: <input type="text" name="second" defaultValue={seconds} />
        </label>
      </form>
    </>
  );
}

function App(): ReactElement {
  const [timers, setTimer] = useState<ReadonlyArray<TimerDetails>>([]);

  const onAddTimer = () => {
    const updatedTimers = [
      ...timers,
      {
        minutes: 0,
        seconds: 0,
      },
    ];
    setTimer(updatedTimers);
  };

  return (
    <div>
      <header className="App-header">
        <h1>Timer</h1>
      </header>
      <section>
        <button type="button" onClick={onAddTimer} name="submit">
          add
        </button>
        {timers.map((timerDetails, index) => {
          return (
            <React.Fragment key={index}>
              <TimerForm {...timerDetails} index={index} />
            </React.Fragment>
          );
        })}
      </section>
    </div>
  );
}

export default App;
