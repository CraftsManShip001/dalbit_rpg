import { YaksokSession } from '@dalbit-yaksok/core'

export async function runYaksokCode(code: string): Promise<string[]> {
  const outputs: string[] = []
  let runtimeError: Error | null = null

  const session = new YaksokSession({
    stdout: (message: string) => {
      outputs.push(message)
    },
    stderr: (message: string) => {
      runtimeError = new Error(message)
    },
  })

  session.addModule('main', code)
  await session.runModule('main')

  if (runtimeError) {
    throw runtimeError
  }

  return outputs
}
