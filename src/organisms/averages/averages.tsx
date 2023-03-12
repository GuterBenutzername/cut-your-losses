import { weightedAverage, type Assignment } from "../../backend";
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

  let realAverage = weightedAverage(
    assignments.filter((assignment) => !assignment.theoretical),
    weights
  );
  realAverage = Number.isNaN(realAverage) ? 0 : realAverage;
  let theoreticalAverage = weightedAverage(assignments, weights);
  theoreticalAverage = Number.isNaN(theoreticalAverage)
    ? 0
    : theoreticalAverage;
  const showTheoreticalAverage = assignments.some(
    (assignment) => assignment.theoretical
  );

  const theoryAverageClass = classNames("theory-average", {
    "average-failing": theoreticalAverage < 70 && theoreticalAverage > 0,
  });
  const realAverageClass = classNames("average", {
    theory: showTheoreticalAverage,
    "average-failing": realAverage < 70 && realAverage > 0,
  });
  let arrow;

  if (realAverage > theoreticalAverage) {
    arrow =
      realAverage < theoreticalAverage ? (
        <span className="material-symbols-outlined">north</span>
      ) : (
        <span className="material-symbols-outlined">south</span>
      );
  } else {
    arrow =
      realAverage < theoreticalAverage ? (
        <span className="material-symbols-outlined">north</span>
      ) : (
        <span className="material-symbols-outlined">east</span>
      );
  }

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
  let changeElement;

  if (theoreticalAverage - realAverage > 0) {
    changeElement = `+${change}`;
  } else if (theoreticalAverage - realAverage === 0) {
    changeElement = `=${change}`;
  } else {
    changeElement = `${change}`;
  }

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
            <span className="change">{changeElement}</span>
          </span>
        </span>
      )}
    </div>
  );
}
