interface EvaluationUserPromptParams {
  question: string;
  solution: {
    standardDefinition: string;
    technicalMechanism: object;
    keyTerminology: string[];
    practicalApplication: string;
  };
  userAnswer: string;
}

// 채점 요청 프롬프트 생성
export function buildEvaluationUserPrompt(
  params: EvaluationUserPromptParams,
): string {
  const formatTerminology = (terms: string[]) => {
    if (!terms || terms.length === 0) return '없음';
    return terms.map((v) => `- ${v}`).join('\n');
  };

  const formatMechanism = (mechanism: object) => {
    if (!mechanism || Object.keys(mechanism).length === 0) return '없음';
    return JSON.stringify(mechanism, null, 2);
  };

  return `## 질문
${params.question}

## 모범 답안
### 핵심 정의
${params.solution.standardDefinition}

### 기술적 메커니즘
${formatMechanism(params.solution.technicalMechanism)}

### 핵심 용어
${formatTerminology(params.solution.keyTerminology)}

### 실무 적용
${params.solution.practicalApplication || '없음'}

## 사용자 답변
${params.userAnswer}

위 정보를 바탕으로 사용자 답변을 평가해주세요.`;
}
