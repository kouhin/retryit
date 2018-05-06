import retryit from './retryit';
import {
  fixedWait,
  exponentialWait,
  fibonacciWait,
  incrementingWait,
  randomWait
} from './waitStrategies';

export {
  retryit,
  fixedWait,
  exponentialWait,
  fibonacciWait,
  incrementingWait,
  randomWait
};

export default retryit;
