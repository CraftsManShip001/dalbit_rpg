/// <reference lib="webworker" />

import { runYaksokCode } from '../lib/yaksok'
import type { WorkerRequest, WorkerResponse } from '../lib/workerProtocol'

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  try {
    const outputs = await runYaksokCode(event.data.code)
    const response: WorkerResponse = { type: 'success', outputs }
    self.postMessage(response)
  } catch (error) {
    const response: WorkerResponse = {
      type: 'error',
      message: String(error),
    }
    self.postMessage(response)
  }
}
