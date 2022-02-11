import { useEffect, useState } from "react";
import TimerService from "../services/TimerService";
import { Timer } from "../types";

type UseTimersType = Readonly<{
  timers: ReadonlyArray<Timer>;
  refreshTimers: () => Promise<void>;
}>;

function useTimers(): UseTimersType {
  const [timers, setTimers] = useState<ReadonlyArray<Timer>>([]);

  async function refreshTimers() {
    console.info("Refreshing timers...");
    const response = await TimerService.getMany();
    setTimers(response);
  }

  useEffect(() => {
    refreshTimers();
  }, []);

  return {
    timers,
    refreshTimers,
  };
}

export default useTimers;
