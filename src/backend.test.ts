import {
  isAssignment,
  Assignment,
  isAssignmentArray,
  weightedAverage,
  fakeAssignment,
  fakeAssignmentArray,
} from "./backend";
describe("all types defined are safe", () => {
  it("correctly check whether unknown type is of type Assignment", () => {
    expect(isAssignment(null)).toBe(false);
    expect(isAssignment({})).toBe(false);
    expect(isAssignment("")).toBe(false);
    expect(isAssignment({ name: "test", grade: 100, weight: 0.25 })).toBe(
      false
    );
    expect(
      isAssignment({
        name: 100,
        grade: 100,
        weight: 0.25,
        theoretical: false,
        id: "test",
      })
    ).toBe(false);
    expect(isAssignment(new Assignment("test", 100, 0.25))).toBe(true);
    expect(
      isAssignment({
        name: "test",
        grade: 100,
        weight: 0.25,
        id: "test",
        theoretical: false,
      })
    ).toBe(true);
  });
  it("ensures arrays of assignments are type-safe", () => {
    expect(isAssignmentArray({})).toBe(false);
    expect(isAssignmentArray([])).toBe(true); // Empty array is still an array of assignments, technically.
    expect(isAssignmentArray(["test", "test"])).toBe(false);
    expect(isAssignmentArray([new Assignment("test", 100, 0.25)])).toBe(true);
    expect(
      isAssignmentArray([
        {
          name: "test",
          grade: 100,
          weight: 0.25,
          id: "test1",
          theoretical: false,
        },
        {
          name: "test",
          grade: 10,
          weight: 0.2,
          id: "test2",
          theoretical: false,
        },
      ])
    ).toBe(true);
  });
});
describe("test utility functions work as expected", () => {
  it("generates a fake assignment", () => {
    const test = fakeAssignment([0.6, 0.25, 0.15]);
    expect(isAssignment(test)).toBe(true);
    expect([0.6, 0.25, 0.15]).toContain(test.weight);
  });
  it("generates an array of fake assignments", () => {
    const testArray = fakeAssignmentArray([0.6, 0.25, 0.15], 500);
    expect(isAssignmentArray(testArray)).toBe(true);
    expect(testArray.length).toBe(500);
    testArray.forEach((element) => {
      expect([0.6, 0.25, 0.15]).toContain(element.weight);
    });
  });
});
describe("weightedAverage returns correct averages", () => {
  it("averages correctly with three weight types", () => {
    const testArray = [
      new Assignment("A", 100, 0.5),
      new Assignment("B", 0, 0.45),
      new Assignment("C", 0, 0.05),
    ];
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(50); // Use toBeCloseTo because floating point nonsense
    testArray[1].grade = 100;
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(50 + 45);
    testArray[2].grade = 100;
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(100);
  });
  it("averages correctly with two weight types", () => {
    const testArray = [
      new Assignment("A", 100, 0.5),
      new Assignment("B", 0, 0.45),
    ];
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(
      50 * (1 / 0.95)
    );
    testArray[1].grade = 100;
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(100);
    testArray[0].grade = 0;
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(
      45 * (1 / 0.95)
    );
  });
  it("averages correctly with one weight type", () => {
    const testArray = [new Assignment("A", 100, 0.5)];
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(100);
    testArray[0].grade = 50;
    expect(weightedAverage(testArray, [0.5, 0.45, 0.05])).toBeCloseTo(50);
  });
  it("fails if three weights don't add up to 1", () => {
    expect(
      weightedAverage(fakeAssignmentArray([1, 2, 3], 100), [1, 2, 3])
    ).toBeFalsy();
    expect(
      weightedAverage(
        fakeAssignmentArray([0.1, 0.2, 0.3], 100),
        [0.1, 0.2, 0.3]
      )
    ).toBeFalsy();
  });
  it("works with very large arrays", () => {
    const testArray = fakeAssignmentArray([0.25, 0.15, 0.6], 100000);
    expect(weightedAverage(testArray, [0.25, 0.15, 0.6])).toBeTruthy();
  });
  it("doesn't crash with edge case values", () => {
    expect(weightedAverage([], [])).toBeFalsy();
    expect(weightedAverage([new Assignment("test", NaN, 0.25)], [0.25, 0.15, 0.6])).toBeFalsy()
    expect(weightedAverage([new Assignment("test", 100, NaN)], [NaN])).toBeFalsy()
    expect(weightedAverage([new Assignment("test", -7, 0.25)], [0.25, 0.15, 0.6])).toBeFalsy()
    expect(weightedAverage([new Assignment("test", 100, -1)], [-1]))
  })
});
