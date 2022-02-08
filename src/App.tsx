import React, {
  FormEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { Timer } from "./types";
import TimerService, { UnsavedTimer } from "./services/TimerService";

function TimerForm({
  onAddTimer,
}: Readonly<{
  onAddTimer: (unsavedTimer: UnsavedTimer) => Promise<void>;
}>): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  const [nameValue, minutesValue, secondsValue] = [
    nameRef?.current?.value,
    minuteRef?.current?.value,
    secondRef?.current?.value,
  ];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nameValue || !minutesValue || !secondsValue) {
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

function App(): ReactElement {
  /* START TODO: Place in stateHook */
  const [timers, setTimers] = useState<ReadonlyArray<Timer>>();

  async function fetchTimers() {
    console.log("Fetching timers");
    const timers = await TimerService.getMany();
    setTimers(timers);
  }

  useEffect(() => {
    fetchTimers();
  }, []);

  async function onAddTimer(unsavedTimer: UnsavedTimer) {
    await TimerService.create(unsavedTimer);
    await fetchTimers();
  }
  /* END TODO: Place in stateHook */

  return (
    <div>
      <header className="App-header">
        <h1>Timer</h1>
      </header>
      <section>
        <TimerForm onAddTimer={onAddTimer} />
        {timers && timers.length > 0 ? (
          timers?.map(({ name, minutes, seconds }, index) => {
            return (
              <div key={index}>
                <h2>{index}</h2>
                <p>{name}</p>
                <p>{`minutes: ${minutes}`}</p>
                <p>{`seconds: ${seconds}`}</p>
              </div>
            );
          })
        ) : (
          <h1>No available timers</h1>
        )}
      </section>
    </div>
  );
}

export default App;
