/* eslint-disable unicorn/no-null */
import { describe, it, expect } from "vitest";

import {
  Assignment,
  isAssignment,
  isAssignmentArray,
  weightedAverage,
} from "../Assignment";

describe.concurrent("Assignment class", () => {
  it("should be able to create an assignment", () => {
    const assignment = new Assignment("Name test", 25, 0.2, true);
    expect(assignment.name).toBe("Name test");
    expect(assignment.grade).toBe(25);
    expect(assignment.weight).toBe(0.2);
    expect(assignment.future).toBe(true);
  });
  it("should satisfy its own type requirements", () => {
    const assignment = new Assignment("Name test", 25, 0.2, true);
    expect(isAssignment(assignment)).toBe(true);
  });
  it("should correctly check if assignment has correct type", () => {
    expect(isAssignment(null)).toBe(false);
    expect(isAssignment("")).toBe(false);
    expect(isAssignment({ weight: 0, grade: 0, future: false, id: "" })).toBe(
      false
    );
    expect(isAssignment({ name: "", grade: 0, future: false, id: "" })).toBe(
      false
    );
    expect(isAssignment({ weight: 0, name: "", future: false, id: "" })).toBe(
      false
    );
    expect(isAssignment({ weight: 0, grade: 0, name: "", id: "" })).toBe(false);
    expect(isAssignment({ weight: 0, grade: 0, name: "", future: false })).toBe(
      false
    );
    expect(
      isAssignment({ name: 0, grade: 0, weight: 0, future: false, id: "" })
    ).toBe(false);
    expect(
      isAssignment({ name: "", grade: "", weight: 0, future: false, id: "" })
    ).toBe(false);
    expect(
      isAssignment({ name: "", grade: 0, weight: "", future: false, id: "" })
    ).toBe(false);
    expect(
      isAssignment({ name: "", grade: 0, weight: "", future: false, id: "" })
    ).toBe(false);
    expect(
      isAssignment({ name: "", grade: 0, weight: 0, future: "", id: "" })
    ).toBe(false);
    expect(
      isAssignment({ name: "", grade: 0, weight: 0, future: false, id: 10 })
    ).toBe(false);
    expect(
      isAssignment({ name: "", grade: 0, weight: 0, future: false, id: "" })
    ).toBe(true);
  });
  it("should correctly check if an assignment array is type-correct", () => {
    expect(isAssignmentArray(null)).toBe(false);
    expect(isAssignmentArray({})).toBe(false);
    expect(isAssignmentArray([])).toBe(true);
    expect(
      isAssignmentArray([
        { name: "", grade: 0, weight: 0, future: false, id: "" },
        {},
      ])
    ).toBe(false);
    expect(
      isAssignmentArray([
        { name: "", grade: 0, weight: 0, future: false, id: "" },
      ])
    ).toBe(true);
  });
});

describe.concurrent("weightedAverage", () => {
  it("should return NaN in invalid circumstances", () => {
    expect(weightedAverage([], [])).toBeNaN();
    expect(weightedAverage([], [0.25, 0.5, 0.125, 0.125])).toBeNaN();
    expect(weightedAverage([], [100, 256, 512])).toBeNaN();
    expect(weightedAverage([], [-0.1, -0.2])).toBeNaN();
    expect(weightedAverage([], [0.1, 0.15, 0.16])).toBeNaN();
    expect(weightedAverage([], [1 / 3, 1 / 3, 1 / 3])).toBeNaN();
  });
  it("returns normal average with one weight", () => {
    expect(
      weightedAverage(
        [new Assignment("A", 100, 1), new Assignment("B", 0, 1)],
        [1]
      )
    ).toBe(50);
    expect(
      weightedAverage(
        [new Assignment("A", 100, 1), new Assignment("B", 50, 1)],
        [1]
      )
    ).toBe(75);
    expect(
      weightedAverage(
        [new Assignment("A", 100, 1), new Assignment("B", 100, 1)],
        [1]
      )
    ).toBe(100);
  });
  it("returns a correct weighted average with two weights that add to 1", () => {
    expect(
      weightedAverage(
        [new Assignment("A", 100, 0.2), new Assignment("B", 0, 0.8)],
        [0.2, 0.8]
      )
    ).toBe(20);
    expect(
      weightedAverage(
        [new Assignment("A", 100, 0.2), new Assignment("B", 100, 0.8)],
        [0.2, 0.8]
      )
    ).toBe(100);
    expect(
      weightedAverage(
        [new Assignment("A", 100, 0.2), new Assignment("B", 50, 0.8)],
        [0.2, 0.8]
      )
    ).toBe(60);
  });
  it("returns a correct weighted average with two weights that don't add to 1", () => {
    expect(
      weightedAverage(
        [new Assignment("A", 100, 0.6), new Assignment("B", 0, 0.2)],
        [0.6, 0.2]
      )
    ).toBe(75);
    expect(
      weightedAverage(
        [new Assignment("A", 0, 0.6), new Assignment("B", 0, 0.2)],
        [0.6, 0.2]
      )
    ).toBe(0);
    expect(
      weightedAverage(
        [new Assignment("A", 50, 0.25), new Assignment("B", 25, 0.35)],
        [0.25, 0.35]
      )
    ).toBe(Math.round((425 / 12) * 100) / 100);
    expect(
      weightedAverage(
        [new Assignment("A", 89, 0.25), new Assignment("B", 72, 0.15)],
        [0.15, 0.25]
      )
    ).toBe(Math.round((661 / 8) * 100) / 100);
  });
  it("returns a correct weighted average with three weights", () => {
    expect(
      weightedAverage(
        [
          new Assignment("A", 100, 0.1),
          new Assignment("B", 100, 0.6),
          new Assignment("C", 0, 0.3),
        ],
        [0.1, 0.6, 0.3]
      )
    ).toBe(70);
    expect(
      weightedAverage(
        [
          new Assignment("A", 50, 0.1),
          new Assignment("B", 100, 0.6),
          new Assignment("C", 50, 0.3),
        ],
        [0.1, 0.6, 0.3]
      )
    ).toBe(80);
    expect(
      weightedAverage(
        [
          new Assignment("A", 50, 0.1),
          new Assignment("B", 50, 0.6),
          new Assignment("C", 50, 0.3),
        ],
        [0.1, 0.6, 0.3]
      )
    ).toBe(50);
  });
});
