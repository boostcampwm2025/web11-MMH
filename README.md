# 말만해

말만해. 너가 아는지 모르는지 확인해줄게.

---

## 목차

- [소개](#소개)
- [기술 스택](#기술-스택)
- [요구 사항](#요구-사항)
- [시작하기](#시작하기)
  - [1. 레포지토리 클론](#1-레포지토리-클론)
  - [2. 의존성 설치](#2-의존성-설치)
  - [3. 환경 변수 설정](#3-환경-변수-설정)
  - [4. 인프라 실행](#4-인프라-실행)
  - [5. 개발 서버 실행](#5-개발-서버-실행)
- [스크립트 명령어](#스크립트-명령어)
- [만든 사람들](#만든-사람들)

---

## 소개

### 프로젝트 소개

말만해 서비스는 AI 채점과 피드백을 기반으로, 말로 설명하며 지식을 구조화하는 **CS 학습 플랫폼**입니다.

### 프로젝트 주요 가치

1. 구두 설명 기반의 학습 : "말해보는 행위 자체가 학습 과정"이라는 관점에서 음성 또는 텍스트 설명을 통해 지식을 정리하도록 돕습니다.
2. AI의 정량적 평가 및 피드백: 기존 설명형 CS 학습에서 부재했던 정량적 기준을 제공하고자 AI가 모범 답안과 답변을 비교해 정확도, 논리 흐름, 깊이를 분석하고 점수와 피드백을 제공합니다.
3. 지식 구조화 및 시각화: 문제, 키워드, 개념 간의 관계 그래프를 생성하여 이를 시각적으로 확인할 수 있습니다.
4. 지속 학습을 위한 게이미피케이션: 스트릭, 점수 등 학습 지속성을 높이는 요소를 적용해 학습 루틴을 유지하기 위해 돕습니다.

### 프로젝트 개발 목적과 목표

눈으로 이해하는 데 그치기 쉬운 CS 학습을, 실전에서 말로 설명할 수 있는 수준의 이해로 끌어올리기 위해 기획되었습니다.
이를 통해 소프트웨어 엔지니어로서의 탄탄한 기본기 함양을 목표로 합니다.

- **눈으로 보는 학습에서 말로 하는 훈련으로의 변화**를 통해 아는 것과 설명할 수 있는 것의 차이를 인지하고 단기 기억을 장기 기억으로 전환하도록 합니다.
- **주관적인 독학을 피드백 기반의 성장으로** 모범 답안 유사도 기반의 AI 채점(0~100점)과 피드백을 통해서 학습자가 답변의 정확도를 객관적으로 파악하고 개선 방향을 설정하도록 돕습니다.
- **파편화된 암기를 연결된 지식 체계로 파편화된 지식을 연결**하여 구조화된 학습 경험을 제공함으로써, 특정 개념을 둘러싼 전체적인 체계를 파악하는 힘을 기르도록 합니다.

### 프로젝트 관련 링크

- [서비스 기획서](https://github.com/boostcampwm2025/web11-MMH/wiki/%EC%84%9C%EB%B9%84%EC%8A%A4-%EA%B8%B0%ED%9A%8D%EC%84%9C)
- [2주차 데모 발표 자료](https://www.canva.com/design/DAG710TOadk/66Tstjy10lEwTnvT4sM-GQ/view?utm_content=DAG710TOadk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb82f152714)
- [3주차 데모 발표 자료](https://www.canva.com/design/DAG9yZ1Mr9c/6_S_hBhrufJX-huxY_Z5Qg/view?utm_content=DAG9yZ1Mr9c&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3e8d4454e5)

## 기술 스택

### common

<img alt="TypeScript" src ="https://img.shields.io/badge/TypeScript-3178C6.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/>
<img alt="turborepo" src ="https://img.shields.io/badge/turborepo-FF1E56.svg?&style=for-the-badge&logo=turborepo&logoColor=white"/>
<img alt="pnpm" src ="https://img.shields.io/badge/pnpm-F69220.svg?&style=for-the-badge&logo=pnpm&logoColor=white"/>

### FE

<img alt="Next.js" src ="https://img.shields.io/badge/Next.js-000000.svg?&style=for-the-badge&logo=Next.js&logoColor=white"/>
<img alt="TailwindCSS" src ="https://img.shields.io/badge/TailwindCSS-06B6D4.svg?&style=for-the-badge&logo=TailwindCSS&logoColor=white"/> 
<img alt="Storybook" src ="https://img.shields.io/badge/Storybook-FF4785.svg?&style=for-the-badge&logo=Storybook&logoColor=white"/>
<img alt="vitest" src ="https://img.shields.io/badge/vitest-6E9F18.svg?&style=for-the-badge&logo=vitest&logoColor=white"/>

### BE

<img alt="nestjs" src ="https://img.shields.io/badge/nestjs-E0234E.svg?&style=for-the-badge&logo=nestjs&logoColor=white"/>
<img alt="postgresql" src ="https://img.shields.io/badge/postgresql-4169E1.svg?&style=for-the-badge&logo=postgresql&logoColor=white"/>
<img alt="typeorm" src ="https://img.shields.io/badge/typeorm-FE0803.svg?&style=for-the-badge&logo=typeorm&logoColor=white"/> 
<img alt="jest" src ="https://img.shields.io/badge/jest-C21325.svg?&style=for-the-badge&logo=jest&logoColor=white"/>

### Infra Structure & AI

<img alt="naver" src ="https://img.shields.io/badge/naver cloud platform-03C75A.svg?&style=for-the-badge&logo=naver&logoColor=white"/>
<img alt="nginx" src ="https://img.shields.io/badge/nginx-009639.svg?&style=for-the-badge&logo=nginx&logoColor=white"/>
<img alt="docker" src ="https://img.shields.io/badge/docker-2496ED.svg?&style=for-the-badge&logo=docker&logoColor=white"/>
<img alt="docker compose" src ="https://img.shields.io/badge/docker compose-2496ED.svg?&style=for-the-badge&logo=docker&logoColor=white"/>
<img alt="githubactions" src ="https://img.shields.io/badge/githubactions-2088FF.svg?&style=for-the-badge&logo=githubactions&logoColor=white"/>

## 요구 사항

| 항목    | 버전           |
| ------- | -------------- |
| Node.js | >= 18          |
| pnpm    | 10.24.0        |
| Docker  | 최신 버전 권장 |

---

## 시작하기

### 1. 레포지토리 클론

```bash
git clone https://github.com/boostcampwm2025/web11-MMH.git
cd web11-MMH
```

### 2. 의존성 설치

pnpm이 설치되어 있지 않다면 먼저 설치합니다.

```bash
npm install -g pnpm
```

이후 프로젝트 의존성을 설치합니다.

```bash
pnpm install
```

### 3. 환경 변수 설정

`apps/api/.env` 파일을 생성하고 아래 내용을 참고하여 설정합니다.

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=malmanhae

# 환경 설정
NODE_ENV=development

# Gemini API 설정
GEMINI_API_KEY=your_api_key
GEMINI_GRADING_MODEL=gemini-3-flash-preview
GEMINI_DEFAULT_MODEL=gemini-2.5-pro
```

### 4. 인프라 실행

Docker Compose를 사용하여 데이터베이스 등 인프라를 실행합니다.

```bash
pnpm infra
```

### 5. 개발 서버 실행

```bash
# 전체 실행 (web + api)
pnpm dev
```

개별 실행이 필요한 경우:

```bash
# 프론트엔드만 실행
pnpm dev-web

# 백엔드만 실행
pnpm dev-api
```

---

## 스크립트 명령어

| 명령어             | 설명                            |
| ------------------ | ------------------------------- |
| `pnpm dev`         | 전체 개발 서버 실행 (web + api) |
| `pnpm dev-web`     | 프론트엔드 개발 서버만 실행     |
| `pnpm dev-api`     | 백엔드 개발 서버만 실행         |
| `pnpm build`       | 프로덕션 빌드                   |
| `pnpm lint`        | ESLint 실행                     |
| `pnpm format`      | Prettier로 코드 포맷팅          |
| `pnpm check-types` | TypeScript 타입 체크            |
| `pnpm storybook`   | Storybook 실행                  |
| `pnpm infra`       | Docker Compose로 인프라 실행    |

---

## 만든 사람들

| [<img src="https://github.com/AYEOOON.png" width="100px">](https://github.com/AYEOOON) | [<img src="https://github.com/kimjihyo.png" width="100px">](https://github.com/kimjihyo) | [<img src="https://github.com/dltnwjd308.png" width="100px">](https://github.com/dltnwjd308) | [<img src="https://github.com/rwaeng.png" width="100px">](https://github.com/rwaeng) | [<img src="https://github.com/swgivenchy.png" width="100px">](https://github.com/swgivenchy) |
| :------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: |
|                       [J050\_김아연](https://github.com/AYEOOON)                       |                       [J073\_김지효](https://github.com/kimjihyo)                        |                        [J192\_이수정](https://github.com/dltnwjd308)                         |                      [J252\_조아령](https://github.com/rwaeng)                       |                        [J272\_최준호](https://github.com/swgivenchy)                         |
|                                          해리                                          |                                           조엘                                           |                                             조이                                             |                                         알로                                         |                                             루이                                             |
|                                        **INfP**                                        |                                         **INFj**                                         |                                           **ISTJ**                                           |                                       **ISFJ**                                       |                                           **ISfP**                                           |

> 서로 다른 내향인 5명이 모였어요!
