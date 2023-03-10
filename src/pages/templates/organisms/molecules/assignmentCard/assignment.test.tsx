import { Assignment } from "../../../../../backend";
import AssignmentCard from "./assignment";
import { render, screen, userEvent } from "../../../../../test/test-utils";
import { vi } from "vitest";

describe("Everything is displayed properly", () => {
  it("renders the three primary text components", () => {
    render(
      <AssignmentCard
        assignment={new Assignment("test", 96, 0.5)}
        index={0}
        onModifyAssignment={(_, __, ___) => undefined}
        onDeleteAssignment={(_) => undefined}
      />
    );
    expect(screen.getByDisplayValue(/test/)).toBeVisible();
    expect(screen.getByDisplayValue(/96/)).toBeVisible();
    expect(screen.getByDisplayValue(/0.5/)).toBeVisible();
  });
  it("calls function when changing fields", async () => {
    const user = userEvent.setup();
    const x = new Assignment("", 0, 0);
    const mock = vi
      .fn()
      .mockImplementation(
        (
          event: { target: { value: string } },
          _,
          property: "name" | "grade" | "weight" | "theoretical"
        ) => {
          if (property === "name") {
            x.name = event.target.value;
          } else if (property === "grade") {
            x.grade = Number(event.target.value);
          } else if (property === "weight") {
            x.weight = Number(event.target.value);
          } else if (property === "theoretical") {
            x.theoretical = !x.theoretical;
          }
        }
      );
    render(
      <AssignmentCard
        assignment={x}
        index={0}
        onModifyAssignment={mock}
        onDeleteAssignment={(_) => undefined}
      />
    );
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    await userEvent.type(nameInput, "x");
    expect(mock).toHaveBeenCalledTimes(1);
    expect(x.name).toBe("x");
    const gradeInput = screen.getByRole("spinbutton", { name: /grade/i });
    await userEvent.type(gradeInput, "9"); // We can only do single characters, as doing mutiple would require a rerender for each typed character.
    expect(mock).toHaveBeenCalledTimes(2);
    expect(x.grade).toBe(9);
    const weightInput = screen.getByRole("spinbutton", { name: /weight/i });
    await userEvent.type(weightInput, "1");
    expect(mock).toHaveBeenCalledTimes(3);
    expect(x.weight).toBe(1);
    const checkbox = screen.getByRole("checkbox", { name: /theoretical/i });
    await user.click(checkbox);
    expect(mock).toHaveBeenCalledTimes(4);
    expect(x.theoretical).toBe(true);
  });
  it("calls function when assignment is deleted", async () => {
    const user = userEvent.setup();
    const mock = vi.fn();
    render(
      <AssignmentCard
        assignment={new Assignment("test", 98, 0.25)}
        index={7}
        onModifyAssignment={(_, __, ___) => undefined}
        onDeleteAssignment={mock}
      />
    );
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock.mock.calls[0][0]).toBe(7);
  });
});
