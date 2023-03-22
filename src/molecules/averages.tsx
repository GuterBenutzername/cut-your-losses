import { css, cx } from "@emotion/css";

import { weightedAverage, type Assignment } from "../backend";

const averageStyle = css`
  font-weight: 700;
  font-size: x-large;
`;

const futureAverageStyle = css`
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
  let weights = Array.from(new Set(assignments.map((item) => item.weight)));
  if (weights.length > 3) {
    weights = weights.slice(0, 3);
  }

  if (weights.length < 3) {
    weights = weights.concat(Array(3).fill(0)).slice(0, 3);
  }

  let realAverage = weightedAverage(
    assignments.filter((assignment) => !assignment.future),
    weights
  );
  if (Number.isNaN(realAverage)) {
    realAverage = 0;
  }
  let futureAverage = weightedAverage(assignments, weights);
  if (Number.isNaN(futureAverage)) {
    futureAverage = 0;
  }
  const showfutureAverage = assignments.some((assignment) => assignment.future);

  const theoryAverageClass = cx(futureAverageStyle, {
    [failing]: futureAverage < 70 && futureAverage > 0,
  });
  const realAverageClass = cx(averageStyle, {
    theory: showfutureAverage,
    [failing]: realAverage < 70 && realAverage > 0,
  });
  let arrow;

  if (realAverage > futureAverage) {
    arrow =
      realAverage < futureAverage ? (
        <span className="material-symbols-outlined">north</span>
      ) : (
        <span className="material-symbols-outlined">south</span>
      );
  } else {
    arrow =
      realAverage < futureAverage ? (
        <span className="material-symbols-outlined">north</span>
      ) : (
        <span className="material-symbols-outlined">east</span>
      );
  }

  const arrowClass = cx("arrow", {
    [css`
      color: #0b0;
    `]: realAverage < futureAverage,

    [failing]: realAverage > futureAverage,

    [css`
      color: #000;
      margin-right: 0;
    `]: realAverage === futureAverage,
  });
  const change = (
    Math.round((futureAverage - realAverage) * 100) / 100
  ).toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: 2,
  });
  let changeElement;

  if (futureAverage - realAverage > 0) {
    changeElement = `+${change}`;
  } else if (futureAverage - realAverage === 0) {
    changeElement = `=${change}`;
  } else {
    changeElement = String(change);
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
      {Boolean(showfutureAverage) && (
        <span>
          Including future Assignments: <br />
          <span className={theoryAverageClass}>
            <span className={arrowClass}>{arrow}</span>
            {futureAverage.toLocaleString("en", {
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

