import { fixedWait } from './waitStrategies';

const DEFAULT_TIMES = 5;
const DEFAULT_INTERVAL = 0;

const DEFAULT_OPTIONS = {
  times: DEFAULT_TIMES,
  interval: DEFAULT_INTERVAL,
  errorFilter: () => true,
};

export default function retryit(opts, task) {
  let taskFn;
  let options;
  if (!task) {
    taskFn = opts;
    options = DEFAULT_OPTIONS;
  } else {
    taskFn = task;
    options = {
      ...DEFAULT_OPTIONS,
      ...(typeof opts === 'object' ? opts : { times: opts }),
    };
  }

  if (!taskFn) {
    throw new Error('Invalid arguments for retryit, task is undefined');
  }

  const intervalFunc = typeof opts.interval === 'function' ? opts.interval : fixedWait(opts.interval);

  let attempt = 1;
  function retryAttempt() {
    return taskFn()
      .catch((err) => {
        if (attempt < options.times && options.errorFilter(err)) {
          attempt += 1;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(retryAttempt());
            }, intervalFunc(attempt));
          });
        }
        return Promise.reject(err);
      });
  }
  return retryAttempt();
}
