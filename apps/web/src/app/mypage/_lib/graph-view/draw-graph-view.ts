import {
  GRAPH_COLOR_CONSTANT,
  GRAPH_NUMBER_CONSTANT,
} from "../../_constants/graph-view-constant";
import {
  GraphEdge,
  GraphNode,
  NodePosition,
  NodeType,
} from "../../types/graph-view";

function drawGraphView(
  ctx: CanvasRenderingContext2D,
  nodes: Map<number, GraphNode & NodePosition>,
  edges: GraphEdge[],
) {
  edges.forEach((edge) => {
    const source = nodes.get(edge.sourceId);
    const target = nodes.get(edge.targetId);
    if (!source || !target) return;

    ctx.strokeStyle = GRAPH_COLOR_CONSTANT.EDGE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });

  nodes.forEach((node) => {
    const radius = GRAPH_NUMBER_CONSTANT.NODE_RADIUS;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle =
      node.type === NodeType.QUESTION
        ? GRAPH_COLOR_CONSTANT.QUESTION_NODE
        : GRAPH_COLOR_CONSTANT.KEYWORD_NODE;
    ctx.fill();

    ctx.fillStyle = GRAPH_COLOR_CONSTANT.LABEL;
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y + radius + 14);
  });
}

export default drawGraphView;
