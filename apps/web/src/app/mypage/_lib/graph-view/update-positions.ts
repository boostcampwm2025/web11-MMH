import { PHISICS_CONSTANT } from "../../_constants/graph-view-constant";
import { NodeMap } from "../../types/graph-view";

function updatePositions(nodes: NodeMap) {
  for (const node of nodes.values()) {
    if (node.fx !== null) {
      node.x = node.fx;
      node.y = node.fy!;
      node.vx = 0;
      node.vy = 0;
      continue;
    }

    node.vx *= PHISICS_CONSTANT.DAMPING;
    node.vy *= PHISICS_CONSTANT.DAMPING;

    const currentSpeed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (currentSpeed > PHISICS_CONSTANT.MAX_SPEED) {
      const ratio = PHISICS_CONSTANT.MAX_SPEED / currentSpeed;
      node.vx *= ratio;
      node.vy *= ratio;
    }

    node.x += node.vx;
    node.y += node.vy;

    //너무 작은 상태에서 계속 움직이면 CPU 부담 -> 어느정도 수렴하면 움직이지 않도록
    if (Math.abs(node.vx) < 0.01) node.vx = 0;
    if (Math.abs(node.vy) < 0.01) node.vy = 0;
  }
}

export default updatePositions;
