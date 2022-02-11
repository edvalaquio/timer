import React, { FormEvent, ReactElement, useRef } from "react";
import TimerService from "../services/TimerService";
import { getTotalSeconds } from "../utils/timerUtils";

function TimerForm({
  onSubmit,
}: Readonly<{
  onSubmit?: () => Promise<void>;
}>): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const [nameValue, minutesValue, secondsValue] = [
      nameRef?.current?.value,
      minutesRef?.current?.value,
      secondsRef?.current?.value,
    ];

    if (nameValue == null || minutesValue == null || secondsValue == null) {
      throw Error("Something went wrong");
    }

    const rawTime = {
      minutes: Number(minutesValue),
      seconds: Number(secondsValue),
    };

    await TimerService.create({
      name: nameValue,
      rawTime,
      totalSeconds: getTotalSeconds(rawTime),
    });

    formRef?.current?.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={async (e): Promise<void> => {
        await handleSubmit(e);
        if (onSubmit) {
          await onSubmit();
        }
      }}
    >
      <label>
        name <input type="text" name="name" ref={nameRef} required />
      </label>
      <label>
        minutes <input type="text" name="minutes" ref={minutesRef} required />
      </label>
      <label>
        seconds <input type="text" name="seconds" ref={secondsRef} required />
      </label>
      <button type="submit" name="add">
        add
      </button>
    </form>
  );
}

export default TimerForm;
