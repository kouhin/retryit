import retryit from './retryit';
import {
  fixedWait,
  exponentialWait,
  fibonacciWait,
  incrementingWait,
  randomWait,
} from './waitStrategies';

export {
  retryit as default,
  fixedWait,
  exponentialWait,
  fibonacciWait,
  incrementingWait,
  randomWait,
};
