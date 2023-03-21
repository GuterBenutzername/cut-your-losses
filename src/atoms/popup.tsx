import React, { useState, useEffect, useLayoutEffect } from "react";

import { css, cx } from "@emotion/css";

const containerStyle = css`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  zindex: 999;
`;

export default function Popup({
  children,
  visible,
  onClose,
  className,
}: {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  className?: string;
}) {
  const [firstTimeSetup, setFirstTimeSetup] = useState(true);
  const [animationState, setAnimationState] = useState(visible);
  const [displayNothing, setDisplayNothing] = useState(!visible);

  useLayoutEffect(() => {
    if (firstTimeSetup) return;
    if (displayNothing) return;
    // Fix to make sure the element has been rendered before we start the animation otherwise react might execute before doing a re-render
    window.setTimeout(() => {
      setAnimationState(true);
    }, 1);
  }, [displayNothing, firstTimeSetup]);

  useEffect(() => {
    setFirstTimeSetup(false);
    if (firstTimeSetup) return;

    if (visible) {
      setDisplayNothing(false);
    } else if (!displayNothing) {
      setAnimationState(false);
      window.setTimeout(() => {
        setDisplayNothing(true);
      }, 100);
    }
  }, [visible, firstTimeSetup, displayNothing]);

  if (displayNothing) return null;
  const promptStyle = css`
    padding: 40px;
    background-color: #fff;
    border-radius: 5px;
    margin: 20px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    z-index: 100;
    transition: 100ms;
    opacity: ${animationState ? 1 : 0};
    transform: ${animationState ? "scale(1)" : "scale(0.9)"};
    cursor: default;
  `;

  return (
    <div className={containerStyle} onClick={onClose}>
      <div
        className={cx(promptStyle, className)}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}
