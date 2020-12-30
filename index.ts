import middy from '@middy/core'
import {
  clear as logClear,
  debug as logDebug,
  error as logError,
  tag,
  untag,
} from 'lesslog'

interface ILogMiddyMiddleware {
  after: middy.MiddlewareFunction<any, any>
  before: middy.MiddlewareFunction<any, any>
  onError: middy.MiddlewareFunction<any, any>
}

export default function log(): ILogMiddyMiddleware {
  return {
    after({ response }, next) {
      logDebug('Response', { response })
      logClear()
      untag()
      next()
    },
    before({ context, event }, next) {
      tag(context.awsRequestId)
      logDebug('Request', { context, event })
      next()
    },
    onError({ error }, next) {
      if (error) {
        const { message, stack, ...details } = error

        logError(message, { error: { ...details, message, stack } })
        untag()

        next(error)
      } else {
        next()
      }
    },
  }
}
