import { GraphData, NodeType } from "../types/graph-view";

export const mockGraphData: GraphData = {
  nodes: [
    { id: 1, type: NodeType.QUESTION, label: "React란 무엇인가요?" },
    { id: 2, type: NodeType.KEYWORD, label: "React" },
    { id: 3, type: NodeType.KEYWORD, label: "Virtual DOM" },
    { id: 4, type: NodeType.QUESTION, label: "Virtual DOM의 동작 원리는?" },
    { id: 5, type: NodeType.KEYWORD, label: "컴포넌트" },
    { id: 6, type: NodeType.QUESTION, label: "useState와 useEffect 차이점은?" },
    { id: 7, type: NodeType.KEYWORD, label: "Hook" },
  ],
  edges: [
    { id: 1, sourceId: 1, targetId: 2 },
    { id: 2, sourceId: 1, targetId: 3 },
    { id: 3, sourceId: 4, targetId: 3 },
    { id: 4, sourceId: 1, targetId: 5 },
    { id: 5, sourceId: 6, targetId: 7 },
    { id: 6, sourceId: 6, targetId: 2 },
  ],
};
