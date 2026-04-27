# 달빛약속 코딩 RPG — 태스크 목록

## 역할 분담

| 역할 | 담당 |
|------|------|
| 구현 | Codex |
| 코드 리뷰 | Claude |
| 브라우저 테스트 | antigravity or 정현 |
| 의사결정 / 방향 | 정현 |

## 워크플로우 (태스크당)

```
Codex 구현 → Claude 코드 리뷰 → antigravity 브라우저 테스트 → 통과 시 다음 태스크
```

리뷰/테스트에서 문제 발견 시 → Codex에 재작업 요청 → 재검증

---

## 태스크 목록

| # | 태스크 | Codex | Claude 리뷰 | 브라우저 테스트 | 문서 |
|---|--------|-------|-------------|----------------|------|
| T01 | 프로젝트 초기 세팅 | ✅ | ✅ | ✅ | agent/01 |
| T02 | 달빛약속 런타임 POC | ✅ | ✅ | ✅ | agent/02 |
| T03 | Web Worker 격리 실행 | ✅ | ✅ | ✅ | agent/02 |
| T04 | 게임 상태 스토어 | ✅ | ✅ | - | agent/03 |
| T05 | useGameEngine 훅 | ✅ | ✅ | - | agent/03 |
| T06 | 문제 데이터 구성 | ✅ | ✅ | - | agent/04 |
| T07 | useQuestionGen + useJudge | ✅ | ✅ | - | agent/04 |
| T08 | BattlePage 레이아웃 | ✅ | ✅ | ✅ | agent/05 |
| T09 | YaksokEditor (CodeMirror) | ✅ | ✅ | ✅ | agent/05 |
| T10 | BattleHUD + QuestionPanel | ✅ | ✅ | ✅ | agent/05 |
| T11 | 전투 이펙트 애니메이션 | ✅ | ✅ | ✅ | agent/05 |
| T12 | ResultPage + 스테이지 전환 | ✅ | ✅ | ✅ | agent/06 |
| D01 | 설계 문서 작성 (ideation, architecture, ADR) | - | - | - | - |
| D02 | 에이전트 협업 기록 작성 | - | - | - | - |
| D03 | 회고 작성 | - | - | - | - |

---

## 태스크 상세 설명

### T01 — 프로젝트 초기 세팅
**위임**: Codex 전부
**산출물**: Vite + React + PandaCSS + TypeScript strict 동작하는 빈 프로젝트
**검증**: `pnpm dev` 실행 확인, TS 컴파일 에러 없음

### T02 — 달빛약속 런타임 POC
**위임**: Codex (설치), 정현 (출력 캡처 방법 문서 확인 후 검증)
**산출물**: `"안녕" 보여주기` 실행 후 출력값 캡처하는 유틸 함수
**검증**: 출력값이 `["안녕"]` 형태로 반환됨을 확인

### T03 — Web Worker 격리 실행
**위임**: Codex
**산출물**: `yaksok.worker.ts` + 5초 타임아웃 + `runYaksok(code)` 유틸
**검증**: 무한루프 코드 넣었을 때 5초 후 에러 반환 확인

### T04 — 게임 상태 스토어
**위임**: Codex
**산출물**: Zustand `gameStore.ts` (플레이어 HP, 적 HP, 스테이지, 현재 턴 상태)
**검증**: Claude 코드 리뷰 (타입 안전성, 액션 설계)

### T05 — useGameEngine 훅
**위임**: Codex
**산출물**: 적 자동 공격 타이머, 턴 상태 전환 로직
**검증**: Claude 코드 리뷰 + `setInterval` cleanup 확인

### T06 — 문제 데이터 구성
**위임**: Codex
**산출물**: `questions.ts` (스테이지 1~2, 3유형 × 각 3문제 이상), `stageConfig.ts`
**검증**: Claude 코드 리뷰 (달빛약속 문법 정확성, 정답 키 검증)

### T07 — useQuestionGen + useJudge
**위임**: Codex
**산출물**: 랜덤 문제 선택 훅 + 3유형별 판정 로직
**검증**: Claude 코드 리뷰 + 유닛 테스트 (각 유형 정답/오답 케이스)

### T08 — BattlePage 레이아웃
**위임**: Codex
**산출물**: 기획서 전투 화면 구성 그대로 레이아웃 (PandaCSS)
**검증**: antigravity 브라우저 테스트 (1280px, 768px)

### T09 — YaksokEditor (CodeMirror 6)
**위임**: Codex
**산출물**: CodeMirror 6 기반 에디터 컴포넌트, 한글 입력 정상 동작
**검증**: antigravity 브라우저 테스트 + 한글 입력 직접 확인

### T10 — BattleHUD + QuestionPanel
**위임**: Codex
**산출물**: HP바 (플레이어/적), 남은 시간 표시, 문제 패널 (유형별 분기)
**검증**: antigravity 브라우저 테스트

### T11 — 전투 이펙트 애니메이션
**위임**: Codex
**산출물**: 데미지 숫자 팝업, HP 감소 애니메이션, 성공/실패 피드백
**검증**: antigravity 브라우저 테스트

### T12 — ResultPage + 스테이지 전환
**위임**: Codex
**산출물**: 게임오버/클리어 화면, 스테이지 2로 전환 흐름
**검증**: antigravity 브라우저 테스트 (전체 플로우 E2E)
