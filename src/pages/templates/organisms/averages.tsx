import { weightedAverage, type Assignment } from "../../../backend";
import "./averages.css";
import classNames from "classnames";
export default function Averages({
  assignments,
}: {
  assignments: Assignment[];
}) {
  let weights = [...new Set(assignments.map((item) => item.weight))];
  if (weights.length > 3) {
    weights = weights.slice(0, 3);
  }

  if (weights.length < 3) {
    weights = weights.concat(Array(3).fill(0)).slice(0, 3);
  }

  const realAverage = weightedAverage(
    assignments.filter((assignment) => !assignment.theoretical),
    weights
  );
  const theoreticalAverage = weightedAverage(assignments, weights);
  const showTheoreticalAverage = assignments.some(
    (assignment) => assignment.theoretical
  );

  const theoryAverageClass = classNames("theory-average", {
    "average-failing": theoreticalAverage < 70,
  });
  const realAverageClass = classNames("average", {
    theory: showTheoreticalAverage,
    "average-failing": realAverage < 70,
  });
  const arrow =
    realAverage < theoreticalAverage ? (
      <span className="material-symbols-outlined">north</span>
    ) : realAverage > theoreticalAverage ? (
      <span className="material-symbols-outlined">south</span>
    ) : (
      <span className="material-symbols-outlined">east</span>
    );
  const arrowClass = classNames("arrow", {
    "arrow-up": realAverage < theoreticalAverage,
    "arrow-down": realAverage > theoreticalAverage,
    "arrow-right": realAverage === theoreticalAverage,
  });
  const change = (
    Math.round((theoreticalAverage - realAverage) * 100) / 100
  ).toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: 2,
  });
  return (
    <div className="averages">
      <span>
        Current Average:
        <br />
        <span className={realAverageClass}>
          {realAverage.toLocaleString("en", {
            useGrouping: false,
            minimumFractionDigits: 2,
          })}
        </span>
      </span>
      {showTheoreticalAverage && (
        <span>
          Including Theoretical Assignments: <br />
          <span className={theoryAverageClass}>
            <span className={arrowClass}>{arrow}</span>
            {theoreticalAverage.toLocaleString("en", {
              useGrouping: false,
              minimumFractionDigits: 2,
            })}
            <span className="change">
              {theoreticalAverage - realAverage > 0
                ? `+${change}`
                : theoreticalAverage - realAverage === 0
                ? `=${change}`
                : `${change}`}
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
