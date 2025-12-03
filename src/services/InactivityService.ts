import { useCallback, useEffect, useRef } from "react";

const useInactivityLogout = (
  logoutCallback: () => void,
  delay = 15 * 60 * 1000,
) => {
  const timerRef = useRef<number | null>(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(logoutCallback, delay);
  }, [delay, logoutCallback]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= delay) {
        logoutCallback();
      } else {
        resetTimer();
      }
    }
  }, [delay, logoutCallback, resetTimer]);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "click", "keydown"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleVisibilityChange, resetTimer]);
};

export default useInactivityLogout;
