import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';

interface QuestionRow {
  id: number;
  title: string;
}

export class QuestionSolutionSeed extends BaseSeed {
  name = 'QuestionSolutionSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 1. 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM question_solutions`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('QuestionSolutions already exist, skipping...');
      return;
    }

    // 2. Question ID 조회
    const questions = (await queryRunner.query(`
      SELECT id, title FROM questions;
    `)) as QuestionRow[];

    const getQuestionId = (title: string): number | undefined =>
      questions.find((q) => q.title === title)?.id;

    const httpId = getQuestionId('HTTP와 HTTPS의 차이점');
    const restApiId = getQuestionId('REST API란 무엇인가');
    const reactId = getQuestionId('React의 Virtual DOM');
    const dbId = getQuestionId('데이터베이스 정규화');
    const osId = getQuestionId('프로세스와 스레드의 차이');

    const requiredIds = [httpId, restApiId, reactId, dbId, osId];
    if (requiredIds.some((id) => id === undefined)) {
      console.log(
        'Required questions not found, skipping QuestionSolutionSeed...',
      );
      return;
    }

    // 3. Golden Standard 데이터 정의 (배열로 관리)
    const solutions = [
      {
        question_id: httpId,
        reference_source: 'RFC 8446 (TLS 1.3) & MDN Web Docs',
        standard_definition:
          'HTTP는 텍스트 기반의 비연결성 프로토콜이며, HTTPS는 이를 SSL/TLS 프로토콜로 감싸 데이터 무결성, 기밀성, 인증을 보장하는 보안 버전입니다.',
        technical_mechanism: {
          basicPrinciple:
            'HTTP는 80번 포트로 평문을 전송하지만, HTTPS는 443번 포트를 사용하며 공개키 암호화 방식으로 세션키를 공유한 뒤 대칭키 방식으로 데이터를 암호화하여 통신합니다.',
          deepPrinciple:
            'TCP 3-way Handshake 직후 TLS Handshake가 수행됩니다. Client Hello와 Server Hello를 통해 암호화 스위트를 협상하고, CA 인증서 체인을 검증하여 Man-in-the-Middle 공격을 방지합니다.',
        },
        key_terminology: [
          'Symmetric/Asymmetric Encryption',
          'TLS Handshake',
          'CA (Certificate Authority)',
          'Port 443',
        ],
        common_misconceptions:
          'HTTPS를 사용하면 클라이언트의 IP 주소나 접속한 도메인(URL) 자체까지 완벽하게 숨겨진다고 오해하지만, 호스트명은 패킷 헤더에 노출될 수 있습니다.',
        practical_application:
          '전자상거래, 로그인, 개인정보 취급 페이지에서는 필수이며, 구글 검색 엔진 최적화(SEO) 점수에도 긍정적인 영향을 미칩니다.',
      },
      {
        question_id: restApiId,
        reference_source:
          'Architectural Styles and the Design of Network-based Software Architectures (Roy Fielding, 2000)',
        standard_definition:
          'REST는 분산 하이퍼미디어 시스템을 위한 아키텍처 스타일로, 자원(Resource)을 URI로 식별하고 행위(Verb)를 HTTP Method로 정의합니다.',
        technical_mechanism: {
          basicPrinciple:
            '클라이언트-서버 구조에서 무상태(Stateless) 통신을 지향하며, GET, POST, PUT, DELETE 등의 표준 HTTP 메서드를 사용하여 직관적인 인터페이스를 제공합니다.',
          deepPrinciple:
            '진정한 REST는 HATEOAS(Hypermedia As The Engine Of Application State)를 만족해야 합니다. 즉, 응답 내에 다음 상태로 전이할 수 있는 링크 정보를 포함하여 클라이언트가 서버 로직과 독립적으로 동작해야 합니다.',
        },
        key_terminology: [
          'Resource (URI)',
          'Representation',
          'Stateless',
          'HATEOAS',
          'Layered System',
        ],
        common_misconceptions:
          'HTTP 기반의 JSON API는 모두 REST API라고 오해하지만, Uniform Interface 제약조건(특히 Self-descriptive message, HATEOAS)을 지키지 않으면 엄밀히 말해 RESTful하지 않습니다.',
        practical_application:
          'OpenAPI(Swagger) 명세와 결합하여 MSA(Microservices Architecture) 환경에서 서비스 간 통신 표준으로 널리 사용됩니다.',
      },
      {
        question_id: reactId,
        reference_source: 'React Docs (Reconciliation)',
        standard_definition:
          'Virtual DOM은 UI의 가상 표현을 메모리에 유지하고, 실제 DOM과 동기화하는 프로그래밍 개념입니다.',
        technical_mechanism: {
          basicPrinciple:
            '데이터가 변경되면 전체 UI를 Virtual DOM에 리렌더링하고, 이전 Virtual DOM과 비교하여 변경된 부분만 실제 DOM에 반영(Patch)합니다.',
          deepPrinciple:
            'React는 O(n^3)인 트리 비교 복잡도를 O(n)으로 줄이기 위해 Heuristic 알고리즘을 사용합니다. 같은 레벨의 컴포넌트 타입을 비교하고, 리스트에는 key prop을 사용하여 불필요한 리렌더링을 최소화합니다. (Reconciliation)',
        },
        key_terminology: [
          'Reconciliation',
          'Diffing Algorithm',
          'Fiber Architecture',
          'Batching',
        ],
        common_misconceptions:
          'Virtual DOM이 바닐라 자바스크립트로 직접 DOM을 조작하는 것보다 무조건 빠르다고 오해합니다. Virtual DOM은 "유지보수 가능한 코드"를 작성하면서도 "충분히 빠른" 성능을 보장하는 것이 목적입니다.',
        practical_application:
          '복잡한 상태 관리가 필요한 대시보드나 SNS 피드처럼 잦은 UI 업데이트가 발생하는 SPA(Single Page Application) 개발에 최적화되어 있습니다.',
      },
      {
        question_id: dbId,
        reference_source:
          'Database System Concepts (Silberschatz) & Codd’s 1970 Paper',
        standard_definition:
          '관계형 데이터베이스 설계에서 중복을 최소화하고 데이터 무결성을 보장하기 위해 데이터를 구조화하는 프로세스입니다.',
        technical_mechanism: {
          basicPrinciple:
            '테이블을 분해하여 삽입, 삭제, 갱신 이상(Anomaly) 현상을 방지합니다. 보통 1정규형(원자값), 2정규형(부분 함수 종속 제거), 3정규형(이행 함수 종속 제거)까지 수행합니다.',
          deepPrinciple:
            '정규화는 쓰기 성능(무결성)을 높이지만, 테이블 조인이 늘어나 읽기 성능을 저하시킬 수 있습니다. 따라서 실무에서는 성능 요구사항에 따라 의도적으로 역정규화(Denormalization)를 수행하기도 합니다.',
        },
        key_terminology: [
          'Anomalies (Update/Insert/Delete)',
          'Functional Dependency',
          '1NF/2NF/3NF/BCNF',
          'Denormalization',
        ],
        common_misconceptions:
          '정규화를 많이 할수록 항상 좋은 DB 설계라고 오해합니다. 과도한 정규화는 복잡한 Join 연산을 유발하여 조회 성능에 치명적일 수 있습니다.',
        practical_application:
          '금융 거래 시스템처럼 데이터 정확성이 최우선인 경우 BCNF 이상으로 정규화하며, 조회 트래픽이 많은 게시판 목록 등은 역정규화를 고려합니다.',
      },
      {
        question_id: osId,
        reference_source: 'Operating System Concepts (Abraham Silberschatz)',
        standard_definition:
          '프로세스는 운영체제로부터 자원을 할당받는 작업의 단위이며, 스레드는 프로세스 내에서 실행되는 흐름의 단위입니다.',
        technical_mechanism: {
          basicPrinciple:
            '프로세스는 독립적인 메모리 영역(Code, Data, Stack, Heap)을 가지지만, 스레드는 Stack만 따로 갖고 Code, Data, Heap 영역은 프로세스 내 다른 스레드와 공유합니다.',
          deepPrinciple:
            '스레드 간 전환(Context Switching)은 프로세스 전환보다 빠릅니다. 프로세스 전환 시에는 CPU 캐시와 TLB(Translation Lookaside Buffer)를 비워야 하지만, 스레드는 메모리를 공유하므로 이 비용이 훨씬 적기 때문입니다.',
        },
        key_terminology: [
          'Context Switching',
          'PCB vs TCB',
          'Shared Memory (Heap)',
          'Concurrency vs Parallelism',
        ],
        common_misconceptions:
          '멀티 스레드가 항상 멀티 프로세스보다 좋다고 오해합니다. 멀티 스레드는 하나의 스레드 오류가 전체 프로세스를 종료시킬 수 있는 안정성 문제가 있습니다 (예: IE vs Chrome).',
        practical_application:
          'Chrome 브라우저는 탭마다 별도 프로세스를 생성하여 안정성을 높였으며(멀티 프로세스), 고성능 게임 서버는 빠른 처리를 위해 멀티 스레드 모델을 주로 사용합니다.',
      },
    ];

    // 4. SQL 생성 및 실행
    const valuesQuery = solutions
      .map((sol) => {
        // JSON 및 배열 필드를 문자열로 변환 및 SQL Escape 처리
        const techJson = JSON.stringify(sol.technical_mechanism).replace(
          /'/g,
          "''",
        );
        const keysJson = JSON.stringify(sol.key_terminology).replace(
          /'/g,
          "''",
        );
        const desc = sol.standard_definition.replace(/'/g, "''");
        const app = sol.practical_application.replace(/'/g, "''");
        const miss = sol.common_misconceptions.replace(/'/g, "''");
        const ref = sol.reference_source.replace(/'/g, "''");

        return `(
          ${sol.question_id},
          '${ref}',
          '${desc}',
          '${techJson}', -- JSON 형태의 문자열
          '${keysJson}', -- JSON 형태의 배열 문자열
          '${app}',
          '${miss}'
        )`;
      })
      .join(',');

    await queryRunner.query(`
      INSERT INTO question_solutions (
        question_id,
        reference_source,
        standard_definition,
        technical_mechanism,
        key_terminology,
        practical_application,
        common_misconceptions
      )
      VALUES ${valuesQuery};
    `);

    console.log(
      `✅ Seeded ${solutions.length} question_solutions successfully.`,
    );
  }
}
