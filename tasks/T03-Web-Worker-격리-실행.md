# T03 — Web Worker 격리 실행

## 전제 파일 (T02 완료)

- `src/lib/yaksok.ts` — `runYaksokCode(code)` 구현 완료. Worker 내부에서 이걸 호출
- `src/workers/yaksok.worker.ts` — 빈 스텁 존재, 이 태스크에서 구현

## 목표

달빛약속 코드 실행을 Web Worker로 격리해서, 무한루프/느린 코드가 UI를 블로킹하지 않게 한다.
5초 타임아웃 초과 시 Worker를 강제 종료한다.

## 구현

### 워커 통신 타입 (`src/lib/workerProtocol.ts` 신규 생성)

```ts
export type WorkerRequest = { code: string }

export type WorkerResponse =
  | { type: 'success'; outputs: string[] }
  | { type: 'error'; message: string }
```

### `src/workers/yaksok.worker.ts`

```ts
import { runYaksokCode } from '../lib/yaksok'
import type { WorkerRequest, WorkerResponse } from '../lib/workerProtocol'

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  try {
    const outputs = await runYaksokCode(e.data.code)
    const res: WorkerResponse = { type: 'success', outputs }
    self.postMessage(res)
  } catch (err) {
    const res: WorkerResponse = { type: 'error', message: String(err) }
    self.postMessage(res)
  }
}
```

### `src/lib/runWithWorker.ts`

```ts
import type { WorkerRequest, WorkerResponse } from './workerProtocol'

export type WorkerResult =
  | { outputs: string[] }
  | { error: 'TIMEOUT' | 'RUNTIME_ERROR'; message?: string }

export async function runWithWorker(
  code: string,
  timeoutMs: number = 5000
): Promise<WorkerResult> {
  return new Promise((resolve) => {
    const worker = new Worker(
      new URL('../workers/yaksok.worker.ts', import.meta.url),
      { type: 'module' }
    )

    const timeout = setTimeout(() => {
      worker.terminate()
      resolve({ error: 'TIMEOUT' })
    }, timeoutMs)

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      clearTimeout(timeout)
      worker.terminate()
      if (e.data.type === 'success') {
        resolve({ outputs: e.data.outputs })
      } else {
        resolve({ error: 'RUNTIME_ERROR', message: e.data.message })
      }
    }

    worker.onerror = () => {
      clearTimeout(timeout)
      worker.terminate()
      resolve({ error: 'RUNTIME_ERROR' })
    }

    const req: WorkerRequest = { code }
    worker.postMessage(req)
  })
}
```

### 설계 원칙

- 매 실행마다 새 Worker 생성 (무한루프 terminate 후 재사용 불가 문제 방지)
- `reject` 대신 `resolve`로 에러 반환 — 호출자가 try/catch 없이 결과 타입으로 분기 가능

## 완료 기준

- [ ] 정상 코드 → `{ outputs: ["안녕"] }` 반환
- [ ] 무한루프 코드 → 5초 후 `{ error: 'TIMEOUT' }` 반환
- [ ] 타임아웃 중 UI 버튼 클릭 가능 (블로킹 없음)
- [ ] 런타임 에러 코드 → `{ error: 'RUNTIME_ERROR', message: '...' }` 반환
- [ ] TypeScript 컴파일 에러 없음

## Claude 코드 리뷰 체크리스트

- `clearTimeout` + `worker.terminate()` 가 성공/에러/타임아웃 모든 경로에서 호출되는가
- `onerror` 핸들러 있는가
- `any` 타입 없는가
- Worker 생성 후 메시지 전송 전에 `onmessage`/`onerror` 핸들러 등록하는가 (순서 중요)

## antigravity 브라우저 테스트

```
테스트 1 — 정상 실행
코드: "안녕" 보여주기
기대: { outputs: ["안녕"] }, 콘솔 에러 없음

테스트 2 — 타임아웃
코드: 반복 (조건 없는 무한루프)
기대: 5초 후 { error: 'TIMEOUT' }, 그 동안 UI 버튼 클릭 가능

테스트 3 — 런타임 에러
코드: 없는변수 보여주기
기대: { error: 'RUNTIME_ERROR', message: 한글 에러 메시지 }
```
