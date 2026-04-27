# T02 — 달빛약속 런타임 POC

## 전제 파일 (T01 완료)

- `@dalbit-yaksok/core` 이미 설치 완료 (`jsr:^6.0.5`). 추가 설치 불필요
- import 경로: `import { YaksokSession } from '@dalbit-yaksok/core'`
- `src/lib/` 디렉터리 없으면 새로 생성

## 목표

달빛약속 코드를 브라우저에서 실행하고, `보여주기` 출력값을 `string[]`로 캡처하는 유틸 함수를 만든다.

## 구현

`src/lib/yaksok.ts` 생성:

```ts
import { YaksokSession } from '@dalbit-yaksok/core'

export async function runYaksokCode(code: string): Promise<string[]> {
  const outputs: string[] = []

  const session = new YaksokSession({
    stdout: (message: string) => outputs.push(message),
    stderr: (message: string) => { throw new Error(message) }
  })

  session.addModule('main', code)
  await session.runModule('main')

  return outputs
}
```

- 반환 타입 `string[]` 고정
- `any` 타입 금지
- 런타임 에러 발생 시 `Error`로 throw

## 완료 기준

- [ ] `runYaksokCode('"안녕" 보여주기')` → `["안녕"]`
- [ ] `runYaksokCode('1 + 2 보여주기')` → `["3"]`
- [ ] `runYaksokCode('나이 = 25\n나이 보여주기')` → `["25"]`
- [ ] 존재하지 않는 변수 실행 시 Error throw
- [ ] TypeScript 컴파일 에러 없음

## Claude 코드 리뷰 체크리스트

- `stdout` 콜백으로 출력 캡처하는가 (console.log 인터셉트 방식 아닌지)
- 반환 타입이 `Promise<string[]>`인가
- `any` 타입 없는가
