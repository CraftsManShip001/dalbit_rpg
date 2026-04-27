# ADR 03 — 유형별 판정 전략

## 상태
결정됨

## 컨텍스트

플레이어 제출 코드를 문제 유형별로 판정해야 한다.

- `quick` / `algorithm`: 실행 결과 출력 비교
- `copy`: 문자열 완전 일치 비교

추가로, 현재 게임 규칙은 엔드리스 전투 구조라서 오답/타임아웃에 대한 패널티 정책이 전투 난이도와 직접 연결된다.

## 출력 캡처 방식 선택

### 선택지

1. `console.log` 인터셉트
2. `YaksokSession`의 `stdout` 콜백

### 결정

`stdout` 콜백을 사용한다.

- 전역 오염이 없다.
- 출력 순서를 안정적으로 수집할 수 있다.
- 런타임 공식 API 사용 방식과 일치한다.

`stderr`는 콜백 내부 즉시 throw 대신 에러를 수집한 뒤 `runModule` 완료 후 throw하는 패턴을 사용한다.

## 판정 규칙 결정

### quick / algorithm

`runWithWorker(code, timeoutMs)` 실행 후 결과를 분기한다.

- `TIMEOUT` → timeout 또는 wrong 취급 + 패널티
- `RUNTIME_ERROR` → wrong + 패널티
- 출력 일치 → correct
- 출력 불일치 → wrong + 패널티

### copy

런타임 실행 없이 문자열 비교한다.

```ts
const normalize = (s: string) => s.replace(/\r\n/g, '\n').trimEnd()
normalize(code) === normalize(question.codeToType)
```

## 현재 효과 정책 (코드 기준)

- `quick`
  - 정답: `damageEnemy`
  - 오답/실행오류: `damagePlayer(WRONG_PENALTY)`
  - 시간초과: `damagePlayer(TIMEOUT_PENALTY)`
- `copy`
  - 정답: `healPlayer`
  - 오답/시간초과: `damagePlayer` (소량)
- `algorithm`
  - 정답: `damageEnemy` (대량)
  - 오답/실행오류/시간초과: `damagePlayer(hpPenalty)`

또한 문제 타이머가 0이 되면 `BattlePage`에서 `judgeTimeout()`을 호출해 자동 오답 처리 후 다음 문제로 진행한다.

## 책임 경계

`useJudge`는 판정 결과(`JudgeResult`)만 반환한다.

- 포함: 판정 로직, `isJudging` 상태
- 제외: 스토어 직접 변경

스토어 액션 호출(`damageEnemy`, `healPlayer`, `damagePlayer`)은 `BattlePage` 책임으로 유지한다.

## 결과

- 유형별 분기가 명시적이며, 에러/타임아웃 경로까지 모두 커버한다.
- 판정 로직과 상태 변경 로직이 분리되어 테스트/확장이 쉽다.
