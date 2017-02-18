retryit
========

A Promise version of [async/retry](https://github.com/caolan/async). Also inclues serveral WaitStrategies that might be useful for situations where more well-behaved service polling is preferred.

**Thanks to [Caolan McMahon](https://github.com/caolan) for the great work!**

[![CircleCI](https://img.shields.io/circleci/project/github/kouhin/retryit.svg)](https://circleci.com/gh/kouhin/retryit/tree/develop)
[![npm](https://img.shields.io/npm/v/retryit.svg)](https://www.npmjs.com/package/retryit)
[![dependency status](https://david-dm.org/kouhin/react-router-hook.svg?style=flat-square)](https://david-dm.org/kouhin/react-router-hook)
[![airbnb style](https://img.shields.io/badge/code_style-airbnb-blue.svg)](https://github.com/airbnb/javascript)

## Installation

```sh
npm install retryit --save
```

# API && Usage

## retryit(opts, task)

#### Arguments

- `opts`: Object |  number <optional>
  - **Default**: `{ times: 5, interval: 0, errorFilter: () => true }`
  - *Description*:
    - `opts` can be either an object or a number.
    - `times` - The number of attempts to make before giving up. The default is `5`.
    - `interval` - The time to wait between retries, in milliseconds. The default is 0. The interval may also be specified as a function of the retry count (see example). This library provides serveral wait strategies that you can use it as interval.
    - `errorFilter` - An optional synchronous function that is invoked on erroneous result. If it returns `true` the retry attempts will continue; if the function returns `false` the retry flow is aborted with the current attempt's error and result being returned to the final callback. Invoked with (err).
    - If `opts` is a number, the number specifies the number of times to retry, with the default interval of `0`.
- `task`: function
  - *Description*:
    - A function which returns a Promise.

#### Returns

  - (Promise): A Promise object which will be resolved when the task has succeeded, or rejected with an error after the final failed attempt.

#### Example

``` javascript
import retryit from 'retyryit';

// The `retry` function can be used as a stand-alone control flow by passing
// a callback, as shown below:

// try calling getPromise 3 times
retryit(3, getPromise)
  .then(result => {
    // do something with the result
  })
  .catch(err => {
    // do something with the error
  });

// try calling getPromise 3 times, waiting 200 ms between each retry
retryit({ times: 3, interval: 200 }, getPromise)
  .then(result => {
    // do something with the result
  })
  .catch(err => {
    // do something with the error
  });

retryit({
  times: 10,
  interval: (retryCount) => {
    return 50 * Math.pow(2, retryCount);
  }
}, getPromise)
  .then(result => {
    // do something with the result
  })
  .catch(err => {
    // do something with the error
  });

// try calling getPromise the default 5 times no delay between each retry
retryit(getPromise)
  .then(result => {
    // do something with the result
  })
  .catch(err => {
    // do something with the error
  });

// try calling getPromise only when error condition satisfies, all other
// errors will abort the retry control flow and return to final callback
retryit({
  errorFilter: function(err) {
    return err.message === 'Temporary error'; // only retry on a specific error
  }
}, getPromise)
  .then(result => {
    // do something with the result
  })
  .catch(err => {
    // do something with the error
  });
```

## Build-in waitStrategies for opts.interval

**Inspired by [guava-retrying](https://github.com/rholder/guava-retrying)**

### `fixedWait(interval = 0)`

- Returns a wait strategy that sleeps a fixed amount of time before retrying (in millisecond).

### `exponentialWait(multiplier = 1, max = Number.MAX_VALUE)`

- Returns a strategy which sleeps for an exponential amount of time after the first failed attempt, and in exponentially incrementing amounts after each failed attempt up to the maximumTime.

### `fibonacciWait(multiplier = 1, max = Number.MAX_VALUE)`

- Returns a strategy which sleeps for an increasing amount of time after the first failed attempt and in Fibonacci increments after each failed attempt up to the maximumTime.

### `incrementingWait(initialSleepTime = 0, increment = 1000, max = Number.MAX_VALUE)`

- Returns a strategy that sleeps a fixed amount of time after the first failed attempt and in incrementing amounts of time after each additional failed attempt.

### `randomWait(min = 0, max = 0)`

- Returns a strategy that sleeps a random amount of time before retrying.

#### Example

``` javascript
import retryit, { exponentialWait } from 'retryit';

retryit({
  times: 10,
  interval: exponentialWait(2, 64),
}, getPromise)
  .then(result => {
    // do something with the result
  })
  .catch(err => {
    // do something with the error
  });
```

## LICENSE

MIT
