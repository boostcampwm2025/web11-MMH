import * as React from "react";
import { GRAPH_NUMBER_CONSTANT } from "../_constants/graph-view-constant";
import { NodeMap } from "../types/graph-view";

function useCanvasInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  nodeMap: NodeMap,
  initialOffset: { x: number; y: number } = { x: 0, y: 0 },
  initialScale: number = 1,
) {
  // offset: canvas 이동 offset
  const offset = React.useRef(initialOffset);
  const scale = React.useRef(initialScale);
  // interaction 진행중인지 상태 확인
  const [activeInteraction, setActiveInteraction] = React.useState(false);
  const wheelTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [isDraggingCanvas, setIsDraggingCanvas] = React.useState(false);
  const [dragStartOffset, setDragStartOffset] = React.useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = React.useState<number | null>(null);

  const convertCursorToCanvasCoords = React.useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();

      // 1. screenX - rect.left => 화면좌표 - 캔버스 좌표
      // 2. - offset.x / -offset.y => 이동한 만큼 빼주기
      // 3. /scale => 줌 한만큼 나눠서 원래 좌표 위치 찾기
      const x = (screenX - rect.left - offset.current.x) / scale.current;
      const y = (screenY - rect.top - offset.current.y) / scale.current;
      return { x, y };
    },
    [canvasRef, offset, scale],
  );

  const findNodeAtPosition = React.useCallback(
    (graphX: number, graphY: number) => {
      const nodeArr = [...nodeMap.values()];
      return nodeArr.find((node) => {
        const dx = graphX - node.x;
        const dy = graphY - node.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        //노드 반지름 + 5해서 노드 보다 조금 넓은 범위 클릭하면 선택할 수 있게
        return distance <= GRAPH_NUMBER_CONSTANT.NODE_RADIUS + 5;
      });
    },
    [nodeMap],
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setActiveInteraction(true);
      const { x, y } = convertCursorToCanvasCoords(e.clientX, e.clientY);

      const clickedNode = findNodeAtPosition(x, y);

      if (clickedNode) {
        setDraggedNodeId(clickedNode.id);

        // 드래그시 해당 노드 고정 -> fx, fy 에 값이 들어가면 노드 움직이지 않게 하기
        clickedNode.fx = x;
        clickedNode.fy = y;
      } else {
        setIsDraggingCanvas(true);
        setDragStartOffset({ x: e.clientX, y: e.clientY });
      }
    },
    [convertCursorToCanvasCoords, findNodeAtPosition],
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = convertCursorToCanvasCoords(e.clientX, e.clientY);

      if (draggedNodeId) {
        const node = nodeMap.get(draggedNodeId);
        if (node) {
          node.fx = x;
          node.fy = y;
        }
      } else if (isDraggingCanvas) {
        const dx = e.clientX - dragStartOffset.x;
        const dy = e.clientY - dragStartOffset.y;

        offset.current.x += dx;
        offset.current.y += dy;

        setDragStartOffset({ x: e.clientX, y: e.clientY });
      }
    },
    [
      convertCursorToCanvasCoords,
      nodeMap,
      dragStartOffset,
      draggedNodeId,
      isDraggingCanvas,
      offset,
    ],
  );

  const handleMouseUp = React.useCallback(() => {
    if (draggedNodeId) {
      const node = nodeMap.get(draggedNodeId);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
    }

    setDraggedNodeId(null);
    setIsDraggingCanvas(false);
    setActiveInteraction(false);
  }, [draggedNodeId, nodeMap]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setActiveInteraction(true);

      const { offsetX, offsetY, deltaY } = e;
      const scaleAmount = -deltaY * 0.001;
      const newScale = Math.max(
        GRAPH_NUMBER_CONSTANT.MIN_SCALE,
        Math.min(GRAPH_NUMBER_CONSTANT.MAX_SCALE, scale.current + scaleAmount),
      );

      // 마우스 위치에 따라 해당 마우스에서 스케일 조정
      const mouseX = offsetX - offset.current.x;
      const mouseY = offsetY - offset.current.y;

      offset.current.x -= (mouseX / scale.current) * (newScale - scale.current);
      offset.current.y -= (mouseY / scale.current) * (newScale - scale.current);

      scale.current = newScale;

      // wheel 이벤트 종료 감지를 위한 debounce
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      wheelTimeoutRef.current = setTimeout(() => {
        setActiveInteraction(false);
      }, 100);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [canvasRef]);

  return {
    offset,
    scale,
    activeInteraction,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

export default useCanvasInteraction;
