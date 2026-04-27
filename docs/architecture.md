# 아키텍처 — 달빛약속 코딩 RPG

## 기술 스택

| 도구 | 용도 |
|------|------|
| React 18 | UI |
| PandaCSS | 스타일 (빌드타임 CSS 추출) |
| Vite 8 | 번들러 |
| @dalbit-yaksok/core (JSR) | 달빛약속 런타임 |
| CodeMirror 6 | 코드 에디터 |
| Zustand | 게임 전역 상태 |

## 디렉터리 구조

```text
src/
├── pages/
│   ├── HomePage.tsx          # 시작 화면, 최고기록, 규칙
│   ├── BattlePage.tsx        # 전투 화면. 훅 연결 및 effect 적용 책임
│   └── ResultPage.tsx        # 게임오버 결과 화면
├── components/
│   ├── game/
│   │   ├── BattleHUD.tsx     # 층/HP바/적 공격 타이머
│   │   ├── QuestionPanel.tsx # 문제 표시, 문제 타이머 게이지
│   │   ├── YaksokEditor.tsx  # CodeMirror 6 기반 코드 에디터
│   │   ├── DamagePopup.tsx   # 데미지/회복 숫자 팝업 애니메이션
│   │   └── JudgeFeedback.tsx # 판정 결과 배너
│   └── ui/
│       └── HealthBar.tsx     # HP바 공통 컴포넌트
├── hooks/
│   ├── useGameEngine.ts      # 적 공격 타이머, gameover 감지
│   ├── useQuestionGen.ts     # 층 가중치 기반 문제 랜덤 선택
│   └── useJudge.ts           # 3유형 판정 로직
├── workers/
│   └── yaksok.worker.ts      # 달빛약속 런타임 격리 실행
├── lib/
│   ├── yaksok.ts             # runYaksokCode — YaksokSession 래퍼
│   ├── runWithWorker.ts      # Worker 생성/통신/타임아웃 처리
│   ├── workerProtocol.ts     # Worker 통신 타입 정의
│   └── floorSystem.ts        # 엔드리스 층 스케일링, 최고기록 localStorage
├── data/
│   ├── stageConfig.ts        # 기본 난이도 설정/적 로테이션(순수 데이터)
│   └── questions.ts          # 문제 데이터(순수 데이터)
└── store/
    └── gameStore.ts          # Zustand — screen/floor/hp/bestFloor/phase
```

## 핵심 상태 모델

`gameStore`는 `screen`과 `turnPhase`를 분리한다.

- `screen`: `home | battle | result`
- `turnPhase`: `idle | questioning | judging | result | gameover`

화면 라우팅은 `screen`으로, 전투 중 내부 흐름은 `turnPhase`로 제어한다.

## 데이터 흐름

```text
HomePage 시작하기
    │
    ▼
useGameStore.startGame()
(screen=battle, floor=1)
    │
    ▼
BattlePage idle 진입
    │ startStage + pickQuestion
    ▼
questioning
    │
    ├─ (A) 사용자 제출: submit(code)
    │      └─ useJudge → JudgeResult(effect)
    │
    ├─ (B) 문제 시간 만료: judgeTimeout()
    │      └─ 자동 오답 처리
    │
    └─ (C) 적 공격 타이머: useGameEngine
           └─ 주기적으로 damagePlayer

JudgeResult effect 적용
(damageEnemy / healPlayer / damagePlayer)
    │
    ▼
turnPhase=result (피드백/팝업)
    │
    └─ 1.5초 후
       ├─ 적 처치 성공: advanceFloor() + 다음 문제
       └─ 미처치: 같은 층 다음 문제

playerHp <= 0
    │
    ▼
useGameEngine.endRun()
(screen=result)
```

## 컴포넌트 책임 분리

### 페이지 레이어

- `HomePage`: 최고기록 표시, 시작/규칙 UI
- `BattlePage`: 훅 연결, 판정 결과를 스토어 액션으로 변환, 다음 문제 전환, 이펙트 표시
- `ResultPage`: 게임오버 결과 및 재시작/홈 이동

### 훅 레이어

- `useGameEngine`: 적 공격 주기, 다음 공격 카운트다운, `playerHp <= 0` 감지
- `useQuestionGen`: 층별 가중치 기반 문제 유형 선택 + 랜덤 문제 선택
- `useJudge`: 판정 전담. 스토어 직접 변경 없이 `JudgeResult` 반환

### 데이터 레이어

- `data/`는 순수 정적 데이터만 유지
- 층 스케일링 계산 로직은 `lib/floorSystem.ts`로 분리

## 현재 게임 규칙 (구현 기준)

- 엔드리스 모드: 몬스터 1마리 처치 시 다음 층 진행
- 최고기록: `localStorage`에 최고 층 저장
- `quick` 정답: 적 피해, 오답: 소량 내 HP 감소
- `copy` 정답: 내 HP 회복, 오답: 소량 내 HP 감소
- `algorithm` 정답: 큰 적 피해, 오답/타임아웃: 큰 내 HP 감소
- 문제 타이머 만료 시 자동 오답 처리 후 다음 문제로 자동 진행
- 적 공격은 문제 풀이 중에도 계속 진행
- 달빛약속 실행은 Worker 격리 + 타임아웃 강제 종료

## 최근 UX 반영 사항

- `Cmd/Ctrl + Enter` 어디서든 실행
- 문제 전환 시 에디터 자동 포커스
- 문제 박스 길이 초과 시 내부 스크롤로 레이아웃 고정
- 문제 영역 텍스트 선택/복사/드래그/우클릭 차단
- 플레이어/적 체력바 색상 및 게이지 스타일 분리
- 문제 타이머/적 공격 타이머를 각각 게이지로 표시
