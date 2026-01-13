"use client";
import { useCanvas2D } from "@/hooks/use-canvas-2d";
import * as React from "react";
import { mockGraphData } from "../../_constants/graph-mock";
import { GRAPH_NUMBER_CONSTANT } from "../../_constants/graph-view-constant";
import drawGraphView from "../../_lib/graph-view/draw-graph-view";
import generateInitialNodePosition from "../../_lib/graph-view/generate-initial-node-position";

function GraphView() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { ctx, width, height } = useCanvas2D(canvasRef);

  const mockData = mockGraphData; // 임시 목데이터

  const initNodeMap = React.useMemo(
    () =>
      generateInitialNodePosition(
        mockData.nodes,
        width,
        height,
        GRAPH_NUMBER_CONSTANT.NODE_RADIUS,
      ),
    [mockData.nodes, width, height],
  );

  //초기 렌더링
  React.useEffect(() => {
    if (!ctx || width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);
    drawGraphView(ctx, initNodeMap, mockData.edges);
  }, [ctx, width, height, initNodeMap, mockData.edges]);

  return <canvas className="w-full h-full" ref={canvasRef}></canvas>;
}

export default GraphView;
