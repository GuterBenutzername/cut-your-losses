import { css } from "@emotion/css";

export default function Footer() {
  return (
    <span
      className={css`
        position: fixed;
        bottom: 0;
        width: 100vw;
        text-align: right;
        padding-right: 4px;
        font-size: 0.7rem;
        color: #ddd;
        z-index: 2;
      `}
    >
      Version 0.3.1 | © 2023 Adam Y. Cole II, founder of The Adam Co.
    </span>
  );
}
