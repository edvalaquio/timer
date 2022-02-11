import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TimerForm from "./TimerForm";
import TimerService from "../services/TimerService";

describe("TimerForm", () => {
  let createStub: jest.SpyInstance;

  beforeEach(() => {
    createStub = jest.spyOn(TimerService, "create").mockImplementation();
  });

  it("should submit accept and submit timer", async () => {
    render(<TimerForm />);

    userEvent.type(screen.getByRole("textbox", { name: "name" }), "Hello");
    userEvent.type(screen.getByRole("textbox", { name: "minutes" }), "10");
    userEvent.type(screen.getByRole("textbox", { name: "seconds" }), "10");

    userEvent.click(screen.getByRole("button", { name: "add" }));
    await waitFor(() => expect(createStub).toHaveBeenCalledTimes(1));
    expect(createStub).toHaveBeenCalledWith({
      name: "Hello",
      rawTime: { minutes: 10, seconds: 10 },
      totalSeconds: 610,
    });
  });

  it("should call the passed onSubmit prop on form submission", async () => {
    const mockOnSubmit: jest.Mock = jest.fn();

    render(<TimerForm onSubmit={mockOnSubmit} />);

    userEvent.click(screen.getByRole("button", { name: "add" }));
    await waitFor(() => expect(createStub).toHaveBeenCalledTimes(1));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
