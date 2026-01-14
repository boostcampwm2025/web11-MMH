"use client";
import { useCanvas2D } from "@/hooks/use-canvas-2d";
import * as React from "react";
import { GRAPH_NUMBER_CONSTANT } from "../../_constants/graph-view-constant";
import applyCenterGravity from "../../_lib/graph-view/apply-center-gravity";
import applyRepulsionForce from "../../_lib/graph-view/apply-repulsion-force";
import applySpringForce from "../../_lib/graph-view/apply-spring-force";
import drawGraphView from "../../_lib/graph-view/draw-graph-view";
import generateInitialNodePosition from "../../_lib/graph-view/generate-initial-node-position";
import updatePositions from "../../_lib/graph-view/update-positions";
import useCanvasInteraction from "../../hooks/useCanvasInteraction";
import { GraphData } from "../../types/graph-view";

function GraphView({ mockData }: { mockData: GraphData }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { ctx, width, height } = useCanvas2D(canvasRef);

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

  const { offset, scale, handleMouseDown, handleMouseMove, handleMouseUp } =
    useCanvasInteraction(canvasRef, initNodeMap);

  React.useEffect(() => {
    if (!ctx || width === 0 || height === 0) return;

    let animationId: number;
    const centerX = width / 2;
    const centerY = height / 2;

    const simulate = () => {
      // 물리엔진 동작시 새로운 map 자료구조 뱉어서 데이터 불변성 유지해야되는지 -> useState같은 상태로 관리하는게 아님 -> 데이터 내부 조작하도록 구현
      applyRepulsionForce(initNodeMap);
      applySpringForce(mockData.edges, initNodeMap);
      applyCenterGravity(initNodeMap, centerX, centerY);
      updatePositions(initNodeMap);

      ctx.clearRect(0, 0, width, height);
      drawGraphView(
        ctx,
        initNodeMap,
        mockData.edges,
        offset.current,
        scale.current,
      );

      // 수렴하면 애니메이션 업데이트 종료하기
      const isStable = [...initNodeMap.values()].every(
        (node) => node.vx === 0 && node.vy === 0,
      );
      if (!isStable) {
        animationId = requestAnimationFrame(simulate);
      }
    };

    animationId = requestAnimationFrame(simulate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [ctx, width, height, initNodeMap, mockData.edges, offset, scale]);

  return (
    <canvas
      className="w-full h-full rounded-md border border-gray-300"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    ></canvas>
  );
}

export default GraphView;
