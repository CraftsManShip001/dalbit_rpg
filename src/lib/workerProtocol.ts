export type WorkerRequest = { code: string }

export type WorkerResponse =
  | { type: 'success'; outputs: string[] }
  | { type: 'error'; message: string }
