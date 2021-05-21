import middy from '@middy/core'
import {
  clear as logClear,
  debug as logDebug,
  error as logError,
  tag,
  untag,
} from 'lesslog'

export default function log(): Required<middy.MiddlewareObj> {
  return {
    after({ response }) {
      logDebug('Response', { response })
      logClear()
      untag()
    },
    before({ context, event }) {
      tag(context.awsRequestId)
      logDebug('Request', { context, event })
    },
    onError({ error }) {
      if (error) {
        const { message, stack, ...details } = error

        logError(message, { error: { ...details, message, stack } })
        untag()
      }
    },
  }
}
