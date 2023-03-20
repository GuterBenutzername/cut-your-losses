import { v4 as uuidv4 } from "uuid";
import { immerable } from "immer";
import Papa from "papaparse";

function randConVowString(length: number) {
  const cons = "bcdfghjklmnpqrstvwxyz".split("");
  const vow = "aeiou".split("");
  let newstr = "";
  for (let i = 0; i < length / 2; i++)
    newstr += randselect(cons) + randselect(vow);
  return newstr;
}

function randselect(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function isPartialAssignment(argument: unknown): argument is Assignment {
  return (
    argument !== null &&
    typeof argument === "object" &&
    "name" in argument &&
    "weight" in argument &&
    "grade" in argument &&
    "theoretical" in argument &&
    typeof argument.name === "string" &&
    typeof argument.weight === "number" &&
    typeof argument.grade === "number" &&
    typeof argument.theoretical === "boolean"
  );
}

export function isAssignment(argument: unknown): argument is Assignment {
  return (
    isPartialAssignment(argument) &&
    "id" in argument &&
    typeof argument.id === "string"
  );
}

export function isPartialAssignmentArray(
  argument: unknown
): argument is Assignment[] {
  return (
    argument !== null &&
    Array.isArray(argument) &&
    argument.every((element) => isPartialAssignment(element))
  );
}

export function isAssignmentArray(argument: unknown): argument is Assignment[] {
  return (
    argument !== null &&
    Array.isArray(argument) &&
    argument.every((element) => isAssignment(element))
  );
}

export function isCourse(argument: unknown): argument is Course {
  return (
    argument !== null &&
    typeof argument === "object" &&
    "name" in argument &&
    "assignments" in argument &&
    "id" in argument &&
    typeof argument.name === "string" &&
    isAssignmentArray(argument.assignments) &&
    typeof argument.id === "string"
  );
}

export function isCourseArray(argument: unknown): argument is Course[] {
  return (
    argument !== null &&
    Array.isArray(argument) &&
    argument.every((element) => isCourse(element))
  );
}

export function fakeAssignment(weights: number[]): Assignment {
  const x = Math.random();
  return new Assignment(
    randConVowString(6),
    Math.round(-100 * x ** 2 + 100 * x + 75),
    weights[Math.floor(Math.random() * weights.length)],
    Math.random() > 0.85
  );
}

export function fakeAssignmentArray(
  weights: number[],
  length: number
): Assignment[] {
  const array = [];
  for (let index = 0; index < length; index++) {
    array.push(fakeAssignment(weights));
  }

  return array;
}

export function fakeCourse(assignmentsLength: number) {
  return new Course(
    randConVowString(6),
    fakeAssignmentArray([0.6, 0.25, 0.15], assignmentsLength)
  );
}

// Create a class to hold assignment data in a more efficient manner.
export class Assignment {
  [immerable] = true;
  public theoretical;
  public id: string;
  constructor(
    public name: string,
    public grade: number,
    public weight: number,
    theoretical?: boolean
  ) {
    this.id = uuidv4();
    this.name = name;
    this.grade = grade;
    this.weight = weight;
    this.theoretical = theoretical ?? false; // If "theoretical" wasn't provided in the constructor, then assume it's false. This makes code easier to read.
  }
}

export class Course {
  [immerable] = true;
  public id: string;
  constructor(public name: string, public assignments: Assignment[]) {
    this.id = uuidv4();
    this.name = name;
    this.assignments = assignments;
  }
}

// Average the "grade" field of each assignment in an array
function gradeArrayAvg(array: Assignment[]) {
  let sum = 0;
  for (const item of array) {
    sum += item.grade;
  }

  return sum / array.length;
}

// If two weights combined don't equal 1, scale them proportionally so they do.
function solveForTwoWeights(weightA: number, weightB: number) {
  return [
    (1 / (weightA + weightB)) * weightA,
    (1 / (weightA + weightB)) * weightB,
  ];
}

function seperateArrayByWeights(array: Assignment[], weights: number[]) {
  return [
    array.filter((index) => index.weight === weights[0]),
    array.filter((index) => index.weight === weights[1]),
    array.filter((index) => index.weight === weights[2]),
  ];
}

// Get a weighted average of assignments with three different weight amounts
export function weightedAverage(array: Assignment[], weights: number[]) {
  if (weights.length === 0 || weights.length > 3) {
    return Number.NaN;
  }

  if (!array.every((element) => element.grade >= 0)) {
    return Number.NaN;
  }

  if (weights.reduce((a, b) => a + b) > 1) {
    return Number.NaN;
  }

  if (!weights.every((element) => element >= 0)) {
    return Number.NaN;
  }

  // Seperate array to be averaged seperately.
  let [a, b, c] = seperateArrayByWeights(array, weights);
  // If all assignments have the same weight, return the average of the array.
  if (b.length + c.length === 0) {
    return gradeArrayAvg(a);
  }

  if (a.length + c.length === 0) {
    return gradeArrayAvg(b);
  }

  if (b.length + a.length === 0) {
    return gradeArrayAvg(c);
  }

  // If there are assignments for two weights, but not three, then the other two weights are scaled propertionally to equal one.
  // This code checks if any array is empty, and if so, add a placeholder assignment that won't effect the average.
  const bc = solveForTwoWeights(weights[1], weights[2]);
  const ac = solveForTwoWeights(weights[0], weights[2]);
  const ba = solveForTwoWeights(weights[1], weights[0]);
  const placeholderText = "Placeholder; see settings";
  if (a.length === 0) {
    a = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(b) * bc[0] + gradeArrayAvg(c) * bc[1],
        weights[0]
      ),
    ];
  }

  if (b.length === 0) {
    b = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(a) * ac[0] + gradeArrayAvg(c) * ac[1],
        weights[1]
      ),
    ];
  }

  if (c.length === 0) {
    c = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(b) * ba[0] + gradeArrayAvg(a) * ba[1],
        weights[2]
      ),
    ];
  }

  return (
    // Finally, return a weighted average.
    Math.round(
      (gradeArrayAvg(a) * weights[0] +
        gradeArrayAvg(b) * weights[1] +
        gradeArrayAvg(c) * weights[2]) *
        100
    ) / 100
  );
}

function addIds(data: unknown[]) {
  if (isPartialAssignmentArray(data)) {
    data.forEach((assignment) => {
      assignment.id = uuidv4();
    });
    if (isAssignmentArray(data)) {
      return data;
    }

    throw new Error("Import failed during ID creation step!");
  } else {
    throw new Error("Import failed during parsing step! (invalid data?)");
  }
}

export function importFromCsv(importCsv: string) {
  const { data } = Papa.parse(importCsv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return addIds(data)

}

export function importFromCisdCsv(importCsv: string) {
  const { data } = Papa.parse(importCsv, {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  data.forEach((item: unknown) => {
    if (Array.isArray(data) && data.every((row) => Array.isArray(row))) {
      const assignment = item as unknown[];
      assignment.splice(0, 2);
      assignment.splice(-5);
      if (
        typeof assignment[0] !== "string" ||
        !(
          typeof assignment[2] === "number" || typeof assignment[2] === "string"
        ) ||
        typeof assignment[1] !== "string"
      ) {
        throw new Error(
          "Import failed during conversion step! (invalid data?)"
        );
      }
    } else {
      throw new Error("Import failed during parsing step! (invalid data?)");
    }
  });
  const assignments = data
    .map((x) => ({
      name: (x as Array<string | number>)[0],
      grade: (x as Array<string | number>)[2],
      weight: (x as Array<string | number>)[1],
      theoretical: false,
    }))
    .filter((item) => item.grade === "Z" || item.grade === "-"||typeof item.grade === "number");
  assignments.forEach((assignment) => {
    if (assignment.grade === "Z") {
      assignment.grade = 0;
    } else if (assignment.grade === "-") {
      assignment.grade = 0;
      assignment.theoretical = true;
    }

    switch (assignment.weight) {
      case "Major":
        assignment.weight = 0.6;
        break;
      case "Quiz":
        assignment.weight = 0.25;
        break;
      case "Daily":
        assignment.weight = 0.15;
        break;
      default:
        throw new Error(
          "Import failed during conversion step (invalid weight value)!"
        );
    }
  });
  return addIds(assignments)
}
