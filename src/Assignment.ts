import { v4 as uuidv4 } from "uuid";
import { immerable } from "immer";

function hasDuplicates(array: unknown[]) {
  return array.length !== new Set(array).size;
}

export class Assignment {
  public [immerable] = true;

  public name: string;

  public grade: number;

  public weight: number;

  public future;

  public id: string;

  public constructor(
    name: string,
    grade: number,
    weight: number,
    future?: boolean
  ) {
    this.id = uuidv4();
    this.name = name;
    this.grade = grade;
    this.weight = weight;
    this.future = future ?? false;
  }
}

function isPartialAssignment(argument: unknown): argument is Assignment {
  return (
    argument !== null &&
    typeof argument === "object" &&
    "name" in argument &&
    "weight" in argument &&
    "grade" in argument &&
    "future" in argument &&
    typeof argument.name === "string" &&
    typeof argument.weight === "number" &&
    typeof argument.grade === "number" &&
    typeof argument.future === "boolean"
  );
}

// Average the "grade" field of each assignment in an array
function gradeArrayAvg(array: readonly Assignment[]) {
  if (array.length === 0) {
    return 0;
  }
  let sum = 0;
  for (const item of array) {
    sum += item.grade;
  }

  // eslint-disable-next-line total-functions/no-partial-division
  return sum / array.length;
}

function solveForTwoWeights(weightA: number, weightB: number) {
  if (weightA + weightB === 0) {
    return [0, 0];
  }
  return [
    // eslint-disable-next-line total-functions/no-partial-division
    (1 / (weightA + weightB)) * weightA,
    // eslint-disable-next-line total-functions/no-partial-division
    (1 / (weightA + weightB)) * weightB,
  ];
}

function solveAllForTwoWeights(weights: readonly number[]) {
  return [
    solveForTwoWeights(weights[1], weights[0]),
    solveForTwoWeights(weights[1], weights[2]),
    solveForTwoWeights(weights[0], weights[2]),
  ];
}

function seperateArrayByWeights(
  array: readonly Assignment[],
  weights: readonly number[]
) {
  return [
    array.filter((index) => index.weight === weights[0]),
    array.filter((index) => index.weight === weights[1]),
    array.filter((index) => index.weight === weights[2]),
  ];
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

function checkForEdgeCases(array: Assignment[], weights: number[]) {
  return (
    weights.length === 0 ||
    weights.length > 3 ||
    !array.every((element) => element.grade >= 0) ||
    // eslint-disable-next-line total-functions/no-partial-array-reduce
    weights.reduce((previous, current) => previous + current) > 1 ||
    !weights.every((element) => element >= 0) ||
    (weights.filter((value) => value !== 0).length === 3 && weights[0] + weights[1] + weights[2] < 1) ||
    hasDuplicates(weights.filter((value) => value !== 0))
  );
}

// Get a weighted average of assignments with three different weight amounts
export function weightedAverage(array: Assignment[], weights: number[]) {
  if (checkForEdgeCases(array, weights)) {
    return Number.NaN;
  }
  let [assignmentsWithWeightA, assignmentsWithWeightB, assignmentsWithWeightC] =
    seperateArrayByWeights(array, weights);
  switch (0) {
    case assignmentsWithWeightB.length + assignmentsWithWeightC.length:
      return gradeArrayAvg(assignmentsWithWeightA);
    case assignmentsWithWeightA.length + assignmentsWithWeightC.length:
      return gradeArrayAvg(assignmentsWithWeightB);
    case assignmentsWithWeightB.length + assignmentsWithWeightA.length:
      return gradeArrayAvg(assignmentsWithWeightC);
    default:
      break;
  }

  if (weights.filter((value) => value !== 0).length === 2) {
    weights[2] = 1 - weights[0] - weights[1];
  } else if (weights.filter((value) => value !== 0).length < 2) {
    return Number.NaN;
  }

  const [ba, bc, ac] = solveAllForTwoWeights(weights);

  const placeholderText =
    "If you can see this, something has gone horribly wrong.";
  if (assignmentsWithWeightA.length === 0) {
    assignmentsWithWeightA = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(assignmentsWithWeightB) * bc[0] +
          gradeArrayAvg(assignmentsWithWeightC) * bc[1],
        weights[0]
      ),
    ];
  }

  if (assignmentsWithWeightB.length === 0) {
    assignmentsWithWeightB = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(assignmentsWithWeightA) * ac[0] +
          gradeArrayAvg(assignmentsWithWeightC) * ac[1],
        weights[1]
      ),
    ];
  }

  if (assignmentsWithWeightC.length === 0) {
    assignmentsWithWeightC = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(assignmentsWithWeightB) * ba[0] +
          gradeArrayAvg(assignmentsWithWeightA) * ba[1],
        weights[2]
      ),
    ];
  }
  return (
    Math.round(
      (gradeArrayAvg(assignmentsWithWeightA) * weights[0] +
        gradeArrayAvg(assignmentsWithWeightB) * weights[1] +
        gradeArrayAvg(assignmentsWithWeightC) * weights[2]) *
        100
    ) / 100
  );
}

export function addIds(data: readonly unknown[]) {
  const temporary = Array.from(data);
  if (isPartialAssignmentArray(temporary)) {
    temporary.forEach((assignment) => {
      assignment.id = uuidv4();
    });
    if (isAssignmentArray(temporary)) {
      return temporary;
    }

    throw new Error("Import failed during ID creation step!");
  } else {
    throw new Error("Import failed during parsing step! (invalid data?)");
  }
}

