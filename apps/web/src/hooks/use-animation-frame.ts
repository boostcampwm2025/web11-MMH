import * as React from "react";

type AnimationCallback = (deltaTime: number) => void;

function useAnimationFrame(callback: AnimationCallback) {
  const callbackRef = React.useRef<AnimationCallback>(callback);
  const rafIdRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const loop = (time: number) => {
      const last = lastTimeRef.current;
      const deltaTime = last === null ? 0 : time - last;
      lastTimeRef.current = time;
      callbackRef.current(deltaTime);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = null;
      lastTimeRef.current = null;
    };
  }, []);
}

export default useAnimationFrame;
