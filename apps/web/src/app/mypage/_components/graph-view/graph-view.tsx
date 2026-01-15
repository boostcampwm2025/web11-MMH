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
import { GraphData } from "../../types/graph-view";
import useGraphInteraction from "./useGraphInteraction";

function GraphView({ mockData }: { mockData: GraphData }) {
  // canvasRef: Canvas DOM 참조
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // ctx: Canvas 2D 렌더링 컨텍스트, width/height: 캔버스 크기
  const { ctx, width, height } = useCanvas2D(canvasRef);

  // initNodeMap: 초기 노드 위치를 계산한 Map (노드 ID -> 노드 데이터)
  // 캔버스 크기가 변경될 때마다 재계산
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

  // 캔버스 인터랙션 훅에서 반환된 값들
  // offset: 캔버스 이동 오프셋, scale: 줌 레벨
  // activeInteraction: 인터랙션 진행 여부 (드래그, 휠 등)
  // handleMouseDown/Move/Up: 마우스 이벤트 핸들러
  const {
    offset,
    scale,
    activeInteraction,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useGraphInteraction(canvasRef, initNodeMap);

  // 물리 엔진 기반 그래프 애니메이션 루프
  // 기대동작: 물리 시뮬레이션을 통해 노드들이 안정적인 위치로 이동하며, 수렴 또는 인터랙션이 있을 때만 애니메이션 실행
  React.useEffect(() => {
    if (!ctx || width === 0 || height === 0) return;

    let animationId: number;
    const centerX = width / 2;
    const centerY = height / 2;

    // simulate: 각 프레임마다 실행되는 물리 시뮬레이션 및 렌더링 함수
    const simulate = () => {
      // 1. 물리 엔진 단계: 힘 적용 및 위치 업데이트
      // - 반발력: 노드들이 서로 밀어냄
      applyRepulsionForce(initNodeMap);
      // - 스프링력: 연결된 노드들을 서로 당김
      applySpringForce(mockData.edges, initNodeMap);
      // - 중력: 노드들을 캔버스 중심으로 끌어당김
      applyCenterGravity(initNodeMap, centerX, centerY);
      // - 위치 업데이트: 계산된 속도를 바탕으로 노드 위치 갱신
      updatePositions(initNodeMap);

      // 2. 렌더링 단계: 캔버스 지우고 그래프 그리기
      ctx.clearRect(0, 0, width, height);
      drawGraphView(
        ctx,
        initNodeMap,
        mockData.edges,
        offset.current,
        scale.current,
      );

      // 3. 애니메이션 지속 조건 확인
      // 모든 노드의 속도가 0이면 수렴한 것으로 판단
      const isStable = [...initNodeMap.values()].every(
        (node) => node.vx === 0 && node.vy === 0,
      );
      // 수렴하지 않았거나 사용자 인터랙션이 있으면 애니메이션 계속
      if (!isStable || activeInteraction) {
        animationId = requestAnimationFrame(simulate);
      }
    };

    animationId = requestAnimationFrame(simulate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    ctx,
    width,
    height,
    initNodeMap,
    mockData.edges,
    offset,
    scale,
    activeInteraction,
  ]);

  return (
    // Canvas 엘리먼트에 마우스 이벤트 핸들러 바인딩
    // onMouseDown: 드래그 시작 (노드 또는 캔버스)
    // onMouseMove: 드래그 중 움직임 처리
    // onMouseUp: 드래그 종료
    // onMouseLeave: 캔버스 밖으로 나갈 때 드래그 종료 (마우스 업과 동일한 처리)
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
