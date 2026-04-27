# 아키텍처 — 달빛약속 코딩 RPG

## 기술 스택

| 도구 | 용도 |
|------|------|
| React 18 | UI |
| PandaCSS | 스타일 (빌드타임 CSS 추출) |
| Vite | 번들러 |
| @dalbit-yaksok/core (JSR) | 달빛약속 런타임 |
| CodeMirror 6 | 코드 에디터 |
| Zustand | 게임 전역 상태 |

## 디렉터리 구조

```
src/
├── pages/
│   ├── BattlePage.tsx       # 전투 화면. 훅 연결 및 effect 적용 책임
│   └── ResultPage.tsx       # 게임오버/스테이지클리어/게임클리어 화면
├── components/
│   ├── game/
│   │   ├── BattleHUD.tsx    # HP바, 적 공격 카운트다운
│   │   ├── QuestionPanel.tsx # 문제 표시, 타이머바, 유형 배지
│   │   ├── YaksokEditor.tsx  # CodeMirror 6 기반 코드 에디터
│   │   ├── DamagePopup.tsx  # 데미지/회복 숫자 팝업 애니메이션
│   │   └── JudgeFeedback.tsx # 판정 결과 배너 (정답/오답/타임아웃)
│   └── ui/
│       └── HealthBar.tsx    # HP바 공통 컴포넌트
├── hooks/
│   ├── useGameEngine.ts     # 적 공격 타이머, HP 감지, 상태 전환
│   ├── useQuestionGen.ts    # 가중치 기반 문제 랜덤 선택
│   └── useJudge.ts          # 3유형 판정 로직
├── workers/
│   └── yaksok.worker.ts     # 달빛약속 런타임 격리 실행
├── lib/
│   ├── yaksok.ts            # runYaksokCode — YaksokSession 래퍼
│   ├── runWithWorker.ts     # Worker 생성/통신/타임아웃 처리
│   └── workerProtocol.ts    # Worker 통신 타입 정의
├── data/
│   ├── stageConfig.ts       # 스테이지별 적/타이머/가중치 설정 (순수 데이터)
│   └── questions.ts         # 문제 데이터 (순수 데이터)
└── store/
    └── gameStore.ts         # Zustand — HP/스테이지/turnPhase/enemyName
```

## 데이터 흐름

```
플레이어 코드 입력
    │
    ▼
YaksokEditor (CodeMirror 6)
    │ onChange
    ▼
BattlePage state (code: string)
    │ 실행 버튼 클릭
    ▼
useJudge.submit(code)
    │
    ▼
runWithWorker(code, timeoutMs)
    │ postMessage
    ▼
Web Worker (yaksok.worker.ts)
    │
    ▼
YaksokSession
    │ stdout 콜백
    ▼
outputs: string[]
    │ 출력값 비교 / 문자열 비교
    ▼
JudgeResult { verdict, effect }
    │ BattlePage에서 effect 해석
    ▼
useGameStore 액션 호출
(damageEnemy / healPlayer / damagePlayer)
    │
    ▼
useGameEngine — playerHp/enemyHp 감지
    │
    ▼
turnPhase 전환 (gameover / stageclear)
    │
    ▼
App.tsx — BattlePage / ResultPage 분기
```

## 컴포넌트 책임 분리

### 페이지 레이어

**BattlePage**는 훅을 연결하고 판정 결과의 effect를 스토어 액션으로 변환하는 책임을 가진다. useJudge가 반환한 `JudgeResult`를 받아서 `damageEnemy`, `healPlayer`, `damagePlayer` 중 적절한 액션을 호출한다. 판정 로직 자체는 가지지 않는다.

**ResultPage**는 `turnPhase`와 `stage`만 읽어서 화면을 분기한다. `resetGame()`, `nextStage()` 액션 호출 외의 로직은 없다.

### 훅 레이어

세 훅은 단일 책임을 갖도록 설계되었다.

**useGameEngine**: 적 자동 공격 타이머(`setInterval`)와 HP 감지(`useEffect`)만 담당한다. `playerHp <= 0`이면 `gameover`, `enemyHp <= 0`이면 `stageclear`로 전환한다. 문제 선택이나 판정에는 관여하지 않는다.

**useQuestionGen**: 스테이지 설정의 `questionWeights`를 기반으로 누적 확률 구간에서 유형을 결정하고, 해당 유형의 문제 풀에서 랜덤 선택한다. 판정 로직을 갖지 않는다.

**useJudge**: 3유형 판정 로직만 담당한다. `useGameStore`를 직접 호출하지 않고 `JudgeResult`를 반환만 한다. 스토어 액션 호출은 호출자인 BattlePage의 책임이다.

### 데이터 레이어

`data/` 디렉터리는 순수 데이터만 포함한다. `stageConfig.ts`와 `questions.ts` 어디에도 로직이 없다. 조건문, 함수 호출, 계산이 없다. 데이터 변경이 로직에 영향을 주지 않도록 완전히 분리되어 있다.

## 핵심 설계 결정

### Web Worker 격리 실행

달빛약속 코드는 반드시 Web Worker에서 실행한다. 플레이어가 실수로 무한루프를 작성하면 메인 스레드가 블로킹되어 게임 자체가 먹통이 된다. Worker는 매 실행마다 새로 생성하고, 5초 타임아웃 초과 시 `worker.terminate()`로 강제 종료한다. 재사용 방식은 `terminate` 후 재생성이 불가능해서 선택하지 않았다.

### useJudge의 책임 경계

`useJudge`는 판정 결과(`JudgeResult`)를 반환하기만 하고 스토어를 직접 호출하지 않는다. 스토어 액션 호출은 BattlePage가 담당한다. 판정 로직과 상태 변경 책임을 분리함으로써 useJudge를 독립적으로 테스트할 수 있고, 판정 결과에 따른 추가 처리(애니메이션 트리거 등)를 BattlePage에서 자유롭게 확장할 수 있다.

### turnPhase 기반 라우팅

react-router를 사용하지 않고 Zustand의 `turnPhase` 상태로 페이지를 분기한다. URL 기반 라우팅이 불필요한 단일 화면 게임 구조에 적합하고, 상태 전환과 화면 전환이 동일한 흐름에서 관리된다.