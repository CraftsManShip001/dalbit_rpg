# ADR 03 — 유형별 판정 전략

## 상태
결정됨

## 컨텍스트

플레이어가 제출한 달빛약속 코드가 정답인지 판정해야 한다. 판정 방식은 문제 유형에 따라 다르다. 출력값 비교가 필요한 유형과 문자열 비교로 충분한 유형이 있다.

출력값 비교를 위해 `보여주기`의 출력을 JavaScript에서 캡처하는 방법을 먼저 결정해야 했다.

## 출력 캡처 방식 선택

### 선택지

**console.log 인터셉트**
`console.log`를 전역에서 오버라이드해서 출력을 캡처한다. 전역 오염이 발생한다. 다른 라이브러리나 디버깅 로그와 충돌할 수 있다. 캡처 시작/종료 타이밍 관리가 어렵다.

**YaksokSession stdout 콜백**
`YaksokSession` 생성 시 `stdout` 콜백을 전달한다. `보여주기` 호출마다 콜백이 실행된다. 공식 API이며 전역 오염이 없다. 출력 순서가 보장된다.

### 결정

**stdout 콜백 방식**을 선택한다.

공식 문서에서 확인한 API다. 전역 오염이 없고 출력 순서가 보장된다. `console.log` 인터셉트 방식은 신뢰성이 낮아 선택하지 않았다.

구현 시 주의사항: `stderr` 콜백 내부에서 즉시 `throw`하면 `YaksokSession`이 콜백을 내부적으로 `try/catch`로 감싸 에러가 전파되지 않을 수 있다. `runtimeError` 변수에 수집 후 `runModule` 완료 후 `throw`하는 패턴을 사용한다.

## 유형별 판정 전략

### 빠른 문제 (quick) / 알고리즘 (algorithm)

`runWithWorker`로 코드를 실행하고 출력값 배열을 `expectedOutputs`와 비교한다.

```
runWithWorker(code, timeoutMs)
  → TIMEOUT: verdict 'timeout'
  → RUNTIME_ERROR: verdict 'wrong'
  → outputs 일치: verdict 'correct'
  → outputs 불일치: verdict 'wrong'
```

알고리즘 문제는 오답/타임아웃 시 `damagePlayer` effect를 반환한다. 빠른 문제는 패널티 없음.

### 따라치기 (copy)

런타임 실행 없이 문자열 직접 비교한다. 정확한 타이핑이 목적이므로 출력값 비교가 불필요하다. 런타임 실행은 오버헤드만 추가한다.

개행 처리를 위해 normalize를 적용한다.

```ts
const normalize = (s: string) => s.replace(/\r\n/g, '\n').trimEnd()
normalize(code) === normalize(question.codeToType)
```

### useJudge의 책임 경계

`useJudge`는 `JudgeResult`를 반환하기만 하고 `useGameStore`를 직접 호출하지 않는다. 스토어 액션 호출(`damageEnemy`, `healPlayer`, `damagePlayer`)은 호출자인 `BattlePage`의 책임이다.

판정 로직과 상태 변경 책임을 분리하면 `useJudge`를 독립적으로 테스트할 수 있고, 판정 결과에 따른 추가 처리(애니메이션 트리거 등)를 `BattlePage`에서 자유롭게 확장할 수 있다.

## 결과

Claude 코드 리뷰에서 `RUNTIME_ERROR` 명시적 분기 누락이 발견되었다. `TIMEOUT` 이후 fallthrough 방식으로 처리되던 것을 명시적 `if` 분기로 교정했다. 판정 로직의 모든 경로가 명시적으로 처리된다.