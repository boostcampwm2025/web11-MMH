export const GRAPH_NUMBER_CONSTANT = {
  NODE_RADIUS: 5,
  MIN_SCALE: 0.5,
  MAX_SCALE: 1.5,
} as const;

export const GRAPH_COLOR_CONSTANT = {
  QUESTION_NODE: "#ff7043",
  KEYWORD_NODE: "#282b2c",
  EDGE: "#999",
  LABEL: "#333",
};

export const PHISICS_CONSTANT = {
  REPULSION: 1000, //척력 강도. 크면 더 멀리 밀어냄
  SPRING_STRENGTH: 0.03, //인력 강도. 크면 빨리 목표 자리로 옴
  DAMPING: 0.3, // 마찰력 강도. 프레임마다 속도에 곱해져서 느려지게
  MAX_SPEED: 2.0, //최대 속도
  CENTER_GRAVITY: 0.0005, // 중앙중력강도. 화면 밖으로 흩어지는거 막기
} as const;

export const NODE_DISTANCE = {
  KEYWORD_TO_KEYWORD: 500,
  KEYWORD_TO_QUESTION: 80,
  QUESTION_TO_QUESTION: 100,
} as const;
