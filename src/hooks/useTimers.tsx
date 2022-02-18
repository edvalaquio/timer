import { useCallback, useEffect, useState } from "react";
import TimerService from "../services/TimerService";
import { Timer, TimerId } from "../types";

type UseTimersType = Readonly<{
  timers: ReadonlyArray<Timer>;
  removeTimer: (timerId: TimerId) => Promise<void>;
  refreshTimers: () => Promise<void>;
}>;

function useTimers(): UseTimersType {
  const [timers, setTimers] = useState<ReadonlyArray<Timer>>([]);

  const refreshTimers = useCallback(async () => {
    console.info("Refreshing timers...");
    const response = await TimerService.getMany();
    setTimers(response);
  }, []);

  const removeTimer = useCallback(async (timerId) => {
    await TimerService.deleteById(timerId);
  }, []);

  useEffect(() => {
    refreshTimers();
  }, [refreshTimers]);

  return {
    timers,
    refreshTimers,
    removeTimer,
  };
}

export default useTimers;
