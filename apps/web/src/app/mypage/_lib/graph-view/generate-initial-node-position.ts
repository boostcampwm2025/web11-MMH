import { GraphNode, NodePosition } from "../../types/graph-view";

function generateInitialNodePosition(
  nodes: GraphNode[],
  canvasWidth: number,
  canvasHeight: number,
  radius: number,
) {
  const initialNodes: (GraphNode & NodePosition)[] = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    label: node.label,
    x: Math.random() * (canvasWidth - radius * 2) + radius,
    y: Math.random() * (canvasHeight - radius * 2) + radius,
  }));
  return new Map(initialNodes.map((node) => [node.id, node]));
}

export default generateInitialNodePosition;
