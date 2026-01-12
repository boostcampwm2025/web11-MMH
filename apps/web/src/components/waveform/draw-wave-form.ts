function drawWaveform(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  history: number[],
  opts: {
    barWidthPx: number;
    barGapPx: number;
    barColor: string;
    numberOfPaddingBars: number;
  },
) {
  const { barWidthPx, barGapPx, barColor, numberOfPaddingBars } = opts;

  ctx.clearRect(0, 0, w, h);

  // padding idle bars
  if (history.length) {
    for (let i = 0; i < numberOfPaddingBars; i++) {
      const x = w - i * (barWidthPx + barGapPx) - barWidthPx;
      const amp = 4;
      const y = h / 2 - amp / 2;
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidthPx, amp, barWidthPx / 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < history.length; i++) {
    const idxFromRight = history.length - 1 - i;
    const amp = history[idxFromRight];

    const maxAmplitude = h * 0.6;
    const newAmp = amp * maxAmplitude * 6;

    // 최소 높이 설정 (너무 작으면 보이지 않으므로)
    const finalAmp = Math.max(Math.min(newAmp, maxAmplitude), 4);

    const x =
      w - (numberOfPaddingBars + i) * (barWidthPx + barGapPx) - barWidthPx;
    if (x + barWidthPx < 0) break;

    const y = h / 2 - finalAmp / 2;
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidthPx, finalAmp, barWidthPx / 2);
    ctx.fill();
  }
}

export default drawWaveform;
