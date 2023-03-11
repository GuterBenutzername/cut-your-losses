import { render, screen, userEvent } from "../../../../test/test-utils";
import { vi } from "vitest";
import {
  Assignment,
  Course,
  fakeCourse,
  fakeAssignmentArray,
} from "../../../../backend";
import Sidebar from "./sidebar";

describe("sidebar", () => {
  it("lists courses' titles correctly", () => {
    const courses = [
      new Course("English", fakeAssignmentArray([0.6, 0.25, 0.15], 10)),
      new Course("Biology", fakeAssignmentArray([0.6, 0.25, 0.15], 10)),
      new Course("Spanish", fakeAssignmentArray([0.6, 0.25, 0.15], 10)),
      new Course("History", fakeAssignmentArray([0.6, 0.25, 0.15], 10)),
    ];
    render(
      <Sidebar
        courses={courses}
        currentCourse={-1}
        onCreateCourse={(_) => undefined}
        onSwapCourse={(_) => undefined}
      />
    );

    ["English", "Biology", "Spanish", "History"].forEach((element) => {
      expect(screen.getByRole("button", { name: element })).toBeVisible();
    });
  });
  it("renders an 'options' and 'help' button", () => {
    render(
      <Sidebar
        currentCourse={-1}
        courses={[]}
        onCreateCourse={(_) => undefined}
        onSwapCourse={(_) => undefined}
      />
    );

    ["Help", /settings|options/i].forEach((element) => {
      expect(screen.getByRole("button", { name: element })).toBeVisible();
    });
  });
  it("calls onSwapCourse when switching courses", async () => {
    const user = userEvent.setup();
    const onSwapCourse = vi.fn();
    render(
      <Sidebar
        currentCourse={-1}
        courses={[new Course("A", []), new Course("B", [])]}
        onSwapCourse={onSwapCourse}
        onCreateCourse={(_) => undefined}
      />
    );
    await user.click(screen.getByRole("button", { name: "B" }));
    expect(onSwapCourse).toBeCalledTimes(1);
    expect(onSwapCourse).toHaveBeenCalledWith(1);
    await user.click(screen.getByRole("button", { name: "A" }));
    expect(onSwapCourse).toBeCalledTimes(2);
    expect(onSwapCourse).toHaveBeenCalledWith(0);
  });
  it("creates a class properly", async () => {
    const user = userEvent.setup();
    const onCreateCourse = vi.fn();
    render(
      <Sidebar
        currentCourse={-1}
        courses={[new Course("A", []), new Course("B", [])]}
        onSwapCourse={(_) => undefined}
        onCreateCourse={onCreateCourse}
      />
    );
    await user.click(screen.getByRole("button", { name: /new course/i }));
    await user.type(
      screen.getByRole("textbox", { name: /course name/i }),
      "TEST"
    );
    await user.keyboard("{Enter}");
    expect(onCreateCourse).toBeCalledTimes(1);
    expect(onCreateCourse).toHaveBeenCalledWith("TEST");
  });
  it("handles edge cases", async () => {
    const user = userEvent.setup();
    const onCreateCourse = vi.fn();
    const sidebarEdgeCaseTest = (
      <Sidebar
        currentCourse={-1}
        courses={[new Course("A", []), new Course("B", [])]}
        onSwapCourse={(_) => undefined}
        onCreateCourse={onCreateCourse}
      />
    );
    render(sidebarEdgeCaseTest);
    await user.click(screen.getByRole("button", { name: /new course/i }));
    await user.keyboard("{Enter}");
    expect(onCreateCourse).toBeCalledTimes(0);
    render(sidebarEdgeCaseTest);
    await user.click(screen.getByRole("button", { name: /new course/i }));
    await user.type(
      screen.getByRole("textbox", { name: /course name/i }),
      "    "
    );
    await user.keyboard("{Enter}");
    expect(onCreateCourse).toBeCalledTimes(0);
    render(sidebarEdgeCaseTest);
    await user.click(screen.getByRole("button", { name: /new course/i }));
    await user.type(screen.getByRole("textbox", { name: /course name/i }), " ");
    await user.keyboard("{Enter}");
    expect(onCreateCourse).toBeCalledTimes(0);
  });
});
