import { useState, useEffect, useLayoutEffect } from "react";
import { css } from "@emotion/css";

const containerStyle = css`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

export default function Popup({
  children,
  isVisible,
  onClose,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
}) {
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(true);
  const [animationState, setAnimationState] = useState(isVisible);
  const [shouldDisplayNothing, setShouldDisplayNothing] = useState(!isVisible);

  useLayoutEffect(() => {
    if (isFirstTimeSetup) {
      return;
    }
    if (shouldDisplayNothing) {
      return;
    }

    window.setTimeout(() => {
      setAnimationState(true);
    }, 1);
  }, [shouldDisplayNothing, isFirstTimeSetup]);

  useEffect(() => {
    setIsFirstTimeSetup(false);
    if (isFirstTimeSetup) {
      return;
    }

    if (isVisible) {
      setShouldDisplayNothing(false);
    } else if (!shouldDisplayNothing) {
      setAnimationState(false);
      window.setTimeout(() => {
        setShouldDisplayNothing(true);
      }, 100);
    }
  }, [isVisible, isFirstTimeSetup, shouldDisplayNothing]);

  if (shouldDisplayNothing) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }
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
    text-align: center;
    width: 70vw;
    max-width: 600px !important;
  `;

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={containerStyle} onClick={onClose}>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={promptStyle}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}
