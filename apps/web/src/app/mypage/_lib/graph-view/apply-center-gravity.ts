import { PHISICS_CONSTANT } from "../../_constants/graph-view-constant";
import { NodeMap } from "../../types/graph-view";

function applyCenterGravity(nodes: NodeMap, centerX: number, centerY: number) {
  for (const node of nodes.values()) {
    if (node.fx !== null) continue;

    // 마찰력 적용시키기
    node.vx += (centerX - node.x) * PHISICS_CONSTANT.CENTER_GRAVITY;
    node.vy += (centerY - node.y) * PHISICS_CONSTANT.CENTER_GRAVITY;
  }
}

export default applyCenterGravity;
