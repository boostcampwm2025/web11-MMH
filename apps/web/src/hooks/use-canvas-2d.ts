import * as React from "react";

interface UseCanvas2DResult {
  ctx: CanvasRenderingContext2D | null;
  width: number; // CSS px 기준 (clientWidth)
  height: number; // CSS px 기준 (clientHeight)
  dpr: number;
  getWidth: () => number;
  getHeight: () => number;
  getDpr: () => number;
}

type UseCanvas2DOptions = Partial<{
  onChangeSize?: (size: { width: number; height: number }) => void;
}>;

/**
 * 캔버스를 컨테이너 크기에 맞춰 자동 리사이즈 + DPR 스케일 정렬.
 * - width/height는 "CSS 픽셀" 기준 (canvas.clientWidth/Height)
 * - canvas.width/height는 "실제 백버퍼" 기준 (CSS * dpr)
 * - ctx는 항상 CSS 좌표계로 그릴 수 있게 transform 설정됨
 */
export function useCanvas2D(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  opts?: UseCanvas2DOptions,
): UseCanvas2DResult {
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const widthRef = React.useRef(0);
  const heightRef = React.useRef(0);
  const dprRef = React.useRef(1);

  const onChangeSize = opts?.onChangeSize;

  const [snapshot, setSnapshot] = React.useState({
    width: 0,
    height: 0,
    dpr: 1,
    ctx: null as CanvasRenderingContext2D | null,
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    const resize = () => {
      const nextDpr = window.devicePixelRatio || 1;

      const nextWidthCss = Math.max(1, Math.round(canvas.clientWidth));
      const nextHeightCss = Math.max(1, Math.round(canvas.clientHeight));

      widthRef.current = nextWidthCss;
      heightRef.current = nextHeightCss;
      dprRef.current = nextDpr;

      const nextWidthBuffer = Math.max(1, Math.round(nextWidthCss * nextDpr));
      const nextHeightBuffer = Math.max(1, Math.round(nextHeightCss * nextDpr));

      // 백버퍼 사이즈가 다를 때만 재설정 (불필요한 clear/메모리 churn 방지)
      if (
        canvas.width !== nextWidthBuffer ||
        canvas.height !== nextHeightBuffer
      ) {
        canvas.width = nextWidthBuffer;
        canvas.height = nextHeightBuffer;
        onChangeSize?.({ width: nextWidthCss, height: nextHeightCss });
      }

      // ✅ CSS 좌표계로 그리게 transform 고정
      // setTransform(a,b,c,d,e,f): (a,d)가 스케일
      ctx.setTransform(nextDpr, 0, 0, nextDpr, 0, 0);

      // 스냅샷 업데이트 (ctx는 stable이라 매번 바꿀 필요 없음)
      setSnapshot((prev) => {
        if (
          prev.width === nextWidthCss &&
          prev.height === nextHeightCss &&
          prev.dpr === nextDpr &&
          prev.ctx === ctx
        ) {
          return prev;
        }
        return {
          width: nextWidthCss,
          height: nextHeightCss,
          dpr: nextDpr,
          ctx,
        };
      });
    };

    resize();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    // DPR 변경은 ResizeObserver만으로 안 잡히는 경우가 있어서 보강
    const onWindowResize = () => resize();
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      ro.disconnect();
      ctxRef.current = null;
    };
  }, [canvasRef, onChangeSize]);

  const getWidth = React.useCallback(() => widthRef.current, []);
  const getHeight = React.useCallback(() => heightRef.current, []);
  const getDpr = React.useCallback(() => dprRef.current, []);

  return {
    ctx: snapshot.ctx,
    width: snapshot.width,
    height: snapshot.height,
    dpr: snapshot.dpr,
    getWidth,
    getHeight,
    getDpr,
  };
}
