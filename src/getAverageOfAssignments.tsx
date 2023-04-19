import type Assignment from "./Assignment";

export default function getAverageOfAssignments(assignments: Assignment[]) {
  const weights = assignments.map((value) => value.weight);
  const uniqueWeights = weights.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  const sumOfWeights = uniqueWeights.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  if (sumOfWeights === 0) {
    return 0;
  }
  let finalWeights = uniqueWeights;
  if (sumOfWeights !== 1) {
    // eslint-disable-next-line total-functions/no-partial-division
    const factor = 1 / sumOfWeights;
    finalWeights = uniqueWeights.map((value) => value * factor);
  }
  let average = 0;
  for (const [index, weightType] of uniqueWeights.entries()) {
    const assignmentsWithWeightType = assignments.filter(
      (assignment) => assignment.weight === weightType
    );
    if (assignmentsWithWeightType.length > 0) {
      average +=
        // eslint-disable-next-line total-functions/no-partial-division
        (assignmentsWithWeightType.reduce(
          (accumulator, assignment) => accumulator + assignment.grade,
          0
        ) /
          assignmentsWithWeightType.length) *
        finalWeights[index];
    }
  }
  return average;
}
