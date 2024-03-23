import type middy from "@middy/core";
import log from "lesslog";

function logError({ message, stack, ...details }: Error) {
  log.error(message, { error: { ...details, message, stack } });
}

export default function lesslogMiddleware(): Required<middy.MiddlewareObj> {
  return {
    after({ error, response }) {
      log.debug("Response", { response });

      if (error) {
        logError(error);
      } else {
        log.clear();
      }

      log.label = "";
    },
    before({ context, event }) {
      log.label = context.awsRequestId;

      log.debug("Request", { context, event });
    },
    onError({ error }) {
      if (error) {
        logError(error);
      }

      log.label = "";
    },
  };
}
