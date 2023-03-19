import { weightedAverage, type Assignment } from "../backend";
import { css, cx } from "@emotion/css";

const averageStyle = css`
  font-weight: 700;
  font-size: x-large;
`;

const theoreticalAverageStyle = css`
  font-weight: 700;
  font-size: x-large;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const failing = css`
  color: #f00;
`;

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

  const theoryAverageClass = cx(theoreticalAverageStyle, {
    [failing]: theoreticalAverage < 70 && theoreticalAverage > 0,
  });
  const realAverageClass = cx(averageStyle, {
    theory: showTheoreticalAverage,
    [failing]: realAverage < 70 && realAverage > 0,
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

  const arrowClass = cx("arrow", {
    [css`
      color: #0b0;
    `]: realAverage < theoreticalAverage,
    [failing]: realAverage > theoreticalAverage,
    [css`
      color: #000;
      margin-right: 0;
    `]: realAverage === theoreticalAverage,
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
    <div
      className={css`
        display: flex;
        width: 100%;
        position: sticky;
        top: 0;
        justify-content: space-evenly;
        z-index: 1;
        background-color: #fff;
        align-self: flex-start;
        flex-wrap: wrap;
        text-align: center;
      `}
    >
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
            <span
              className={css`
                font-weight: initial;
                font-size: small;
                color: #000;
                top: 6px;
                position: relative;
              `}
            >
              {changeElement}
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
