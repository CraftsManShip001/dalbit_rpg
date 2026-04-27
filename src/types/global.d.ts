declare global {
  interface Window {
    runWithWorker: typeof import('../lib/runWithWorker').runWithWorker
  }
}

export {}
