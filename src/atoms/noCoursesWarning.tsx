import { css } from "@emotion/css";

export default function NoCoursesWarning() {
  return (
    <div
      className={css`
        height: 80vh;
        width: calc(100vw - 150px);
        position: fixed;
        left: 150px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-evenly;
        align-items: center;
        text-align: center;
        font-weight: 600;
        z-index: -1;
      `}
    >
      <span>You don&apos;t have any courses!</span>
      <p
        className={css`
          width: 75%;
        `}
      >
        Click on the &quot;New Course&quot; button to create one, or click on
        the &quot;Import Gradebook&quot; button to import directly from your
        school&apos;s grading system (if supported).
      </p>
    </div>
  );
}
