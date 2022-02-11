import deepFreeze from "deep-freeze";

import { act as actHook, renderHook } from "@testing-library/react-hooks";

import TimerService from "../services/TimerService";
import { Timer } from "../types";
import useTimers from "./useTimers";
import { waitFor } from "@testing-library/react";

const testTimers = deepFreeze<ReadonlyArray<Timer>>([
  {
    id: "001",
    name: "foo",
    rawTime: {
      minutes: 10,
      seconds: 10,
    },
    totalSeconds: 610,
  },
  {
    id: "002",
    name: "bar",
    rawTime: {
      minutes: 10,
      seconds: 10,
    },
    totalSeconds: 610,
  },
]);

describe("useTimers", () => {
  let getManyStub: jest.SpyInstance;

  beforeEach(() => {
    getManyStub = jest
      .spyOn(TimerService, "getMany")
      .mockResolvedValue(testTimers);
  });

  it("should return the list of timers", async () => {
    const { result } = renderHook(() => useTimers());

    await waitFor(() => {
      expect(getManyStub).toHaveBeenCalledTimes(1);
    });
    expect(result.current.timers).toEqual(testTimers);
  });

  it("should allow refreshTimers to be called", async () => {
    const { result } = renderHook(() => useTimers());

    await waitFor(() => {
      expect(getManyStub).toHaveBeenCalledTimes(1);
    });
    await actHook(async () => {
      await result.current.refreshTimers();
    });
    expect(getManyStub).toHaveBeenCalledTimes(2);
  });
});
