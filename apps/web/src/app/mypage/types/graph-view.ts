export enum NodeType {
  "QUESTION",
  "KEYWORD",
}

export interface GraphNode {
  id: number;
  type: NodeType;
  label: string;
}

export interface GraphEdge {
  id: number;
  sourceId: number;
  targetId: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface NodePosition {
  x: number;
  y: number;
}
