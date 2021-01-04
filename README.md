# middy-lesslog

**_Middy middleware wrapper for [`lesslog`](https://github.com/rschweizer/lesslog#readme)_**

The middleware registers `before`, `after` and `onError` handlers to log the incoming event, outgoing response or thrown error respectively.

Using [`lesslog`](https://github.com/rschweizer/lesslog) however this debug information will not be logged immediately, but buffered internally. Once an error is thrown any buffered logs will be emitted, preserving their original timestamp and context. No debug information is lost, while still maintaining clutter-free logs the rest of the time. You can learn more about how `lesslog` processes your logs by reading its [documentation](https://github.com/rschweizer/lesslog#readme).

## Installation

```shell
$ npm install middy-lesslog
```

## Usage

```javascript
import middy from '@middy/core'
import log from 'middy-lesslog'

async function handler(event, context) {
  // Do something meaningful

  return {
    statusCode: 200,
  }
}

export const handler = middy(handler).use(log())
```

### Configuration

There are no configuration options so far. Reach out or open an issue, if you want to see a specific option to be configurable!

### Debug

If the `DEBUG` environment variable is set to either `'1'`, `'on'`, `'true'`, or `'yes'`, the incoming event and outgoing response will not be buffered internally, but instead directly written to `process.env.stdout`. This behavior is built-in to `lesslog`.
