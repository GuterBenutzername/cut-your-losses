import { parse } from "papaparse";
import { immerable } from "immer";
import { v4 as uuidv4 } from "uuid";

import { type Assignment, isAssignmentArray, addIds } from "./Assignment";

export class Course {
  public [immerable] = true;

  public id: string;

  public name: string;

  public assignments: Assignment[];

  public constructor(name: string, assignments: Assignment[]) {
    this.id = uuidv4();
    this.name = name;
    this.assignments = assignments;
  }
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

export function importFromCsv(importCsv: string) {
  const { data } = parse(importCsv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return addIds(data);
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function importFromCisdCsv(importCsv: string) {
  const { data } = parse(importCsv, {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  if (Array.isArray(data) && data.every((row) => Array.isArray(row))) {
    data.forEach((item: unknown) => {
      const assignment = item as unknown[][];
      assignment.splice(0, 2);
      assignment.splice(-5);
      if (
        typeof assignment[0] !== "string" ||
        !(
          typeof assignment[2] === "number" || typeof assignment[2] === "string"
        ) ||
        typeof assignment[1] !== "string"
      ) {
        throw new TypeError(
          "Import failed during type check step! (invalid data?)"
        );
      }
    });
    const assignments = data
      .map((property) => ({
        name: (property as number[] | string[])[0],
        grade: (property as number[] | string[])[2],
        weight: (property as number[] | string[])[1],
        future: false,
      }))
      .filter(
        (item) =>
          item.grade === "Z" ||
          item.grade === "-" ||
          typeof item.grade === "number"
      );
    assignments.forEach((assignment) => {
      if (assignment.grade === "Z") {
        assignment.grade = 0;
      } else if (assignment.grade === "-") {
        assignment.grade = 0;
        assignment.future = true;
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
    return addIds(assignments);
  }

  throw new Error("Import failed during parsing step! (invalid data?)");
}
