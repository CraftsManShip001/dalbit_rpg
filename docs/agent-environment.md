# 에이전트 환경 구성

## 시스템 프롬프트/규칙 파일

- `AGENTS.md`
  - 프로젝트 구조, 달빛약속 문법 주의사항, 아키텍처/금지사항 정의
- `CLAUDE.md`
  - 협업/코딩 원칙 및 작업 규칙 기록
- `ANTIGRAVITY-PROMPT.md`
  - 브라우저 테스트/검증용 프롬프트
- `REVIEW-PROMPT.md`
  - 코드 리뷰 기준 프롬프트

## 사용한 에이전트

- Codex
  - 주요 구현 작업 전반
- Claude
  - 코드 리뷰 및 누락 분기 점검
- antigravity
  - 브라우저 상호작용 기반 동작 검증

## MCP 서버/스킬 사용 내역

이번 과제 저장소 작업 범위에서는 별도 외부 MCP 서버를 의존하지 않았다.

- 로컬 코드 편집/빌드 검증 중심
- 브라우저 검증은 antigravity 워크플로우로 수행

## 검증에 사용한 주요 명령

- `pnpm build`
- `pnpm dev`
- (필요 시) `pnpm lint`
