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

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      clearTimeout(timeout)
      worker.terminate()

      if (event.data.type === 'success') {
        resolve({ outputs: event.data.outputs })
        return
      }

      resolve({ error: 'RUNTIME_ERROR', message: event.data.message })
    }

    worker.onerror = (event: ErrorEvent) => {
      clearTimeout(timeout)
      worker.terminate()
      resolve({ error: 'RUNTIME_ERROR', message: event.message })
    }

    const request: WorkerRequest = { code }
    worker.postMessage(request)
  })
}
