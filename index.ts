import middy from '@middy/core'
import {
  clear as logClear,
  debug as logDebug,
  error as logError,
  tag,
  untag,
} from 'lesslog'

const defaultOptions = {
  request: true,
  response: true,
}

type Options = {
  request?: boolean
  response?: boolean
}

export default function log(opts?: Options): Required<middy.MiddlewareObj> {
  const options = { ...defaultOptions, ...opts }

  return {
    after({ response }) {
      if (options.response) {
        logDebug('Response', { response })
      }
      logClear()
      untag()
    },
    before({ context, event }) {
      tag(context.awsRequestId)
      if (options.request) {
        logDebug('Request', { context, event })
      }
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
