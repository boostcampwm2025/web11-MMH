import * as React from "react";
import { GRAPH_NUMBER_CONSTANT } from "../_constants/graph-view-constant";
import { GraphNode, NodePosition } from "../types/graph-view";

function useCanvasInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  nodeMap: Map<number, GraphNode & NodePosition>,
  initialOffset: { x: number; y: number } = { x: 0, y: 0 },
  initialScale: number = 1,
) {
  // offset: canvas 이동 offset
  const [offset, setOffset] = React.useState(initialOffset);
  const [scale, setScale] = React.useState(initialScale);

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
      const x = (screenX - rect.left - offset.x) / scale;
      const y = (screenY - rect.top - offset.y) / scale;
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
      const { x, y } = convertCursorToCanvasCoords(e.clientX, e.clientY);

      const clickedNode = findNodeAtPosition(x, y);

      if (clickedNode) {
        setDraggedNodeId(clickedNode.id);
        console.log(clickedNode.id, clickedNode.label);

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

        setOffset({
          x: offset.x + dx,
          y: offset.y + dy,
        });
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
  }, [draggedNodeId, nodeMap]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;

      setScale((currentScale) => {
        const newScale = currentScale * (1 + delta);
        return Math.max(
          GRAPH_NUMBER_CONSTANT.MIN_SCALE,
          Math.min(GRAPH_NUMBER_CONSTANT.MAX_SCALE, newScale),
        );
      });
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [canvasRef]);

  return {
    offset,
    scale,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

export default useCanvasInteraction;
