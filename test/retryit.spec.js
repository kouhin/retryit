import { retryit } from '../src/index';

describe('retryit', () => {
  it('retry when attempt succeeds', async () => {
    let failed = 3;
    let callCount = 0;
    const expectedResult = 'success';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        failed -= 1;
        if (!failed) resolve(expectedResult);
        else reject(new Error(true)); // respond with error
      });
    }
    await expect(retryit(fn)).resolves.toEqual(expectedResult);
    expect(callCount).toBe(3);
  });

  it('retry when all attempts fail', async () => {
    const times = 3;
    let callCount = 0;
    const error = 'ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(new Error(error));
      });
    }
    await expect(retryit(times, fn)).rejects.toThrow(error);
    expect(callCount).toBe(3);
  });

  it('retry when all attempts fail, receive prev error', async () => {
    const times = 3;
    let callCount = 0;
    const error = 'ERROR';
    function fn(err) {
      if (callCount === 0) {
        expect(err).toBe(undefined);
      } else {
        expect(err.message).toBe(`${error}_${callCount}`);
      }
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(new Error(`${error}_${callCount}`));
      });
    }
    await expect(retryit(times, fn)).rejects.toThrow(`${error}_${times}`);
    expect(callCount).toBe(3);
  });

  it('retry fails with invalid arguments', done => {
    expect(() => {
      retryit('');
    }).toThrow();
    expect(() => {
      retryit();
    }).toThrow();
    expect(() => {
      retryit(() => {}, 2, () => {});
    }).toThrow();
    done();
  });

  it('retry with interval when all attempts fail', async () => {
    const times = 3;
    const interval = 50;
    let callCount = 0;
    const error = 'ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(new Error(error + callCount));
      });
    }
    const start = new Date().getTime();
    await expect(retryit({ times, interval }, fn)).rejects.toThrow(
      error + times
    );
    const now = new Date().getTime();
    const duration = now - start;
    expect(duration >= interval * (times - 1)).toBeTruthy();
    expect(callCount).toBe(3);
  });

  it('retry with custom interval when all attempts fail', async () => {
    const times = 3;
    const intervalFunc = retryCount => retryCount * 100;
    let callCount = 0;
    const error = 'ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(new Error(error + callCount));
      });
    }
    const start = new Date().getTime();
    await expect(
      retryit({ times, interval: intervalFunc }, fn)
    ).rejects.toThrow(error + times);
    const now = new Date().getTime();
    const duration = now - start;
    expect(duration >= 300).toBeTruthy();
    expect(callCount).toBe(3);
  });

  it('retry does not precompute the intervals', async () => {
    const callTimes = [];
    function intervalFunc() {
      callTimes.push(new Date().getTime());
      return 100;
    }
    function fn() {
      return Promise.reject(new Error());
    }
    await expect(
      retryit({ times: 4, interval: intervalFunc }, fn)
    ).rejects.toThrow();
    expect(callTimes[1] - callTimes[0]).toBeGreaterThan(90);
    expect(callTimes[2] - callTimes[1]).toBeGreaterThan(90);
  });

  it('retry calls fn immediately resolved if successful', async () => {
    function fn() {
      return new Promise(resolve => resolve({ a: 1 }));
    }
    await expect(retryit(5, fn)).resolves.toEqual({ a: 1 });
  });

  it('retry when all attempts fail and error continue test returns true', async () => {
    const times = 3;
    let callCount = 0;
    const error = 'ERROR';
    const special = 'SPECIAL_ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(new Error(error + callCount));
      });
    }
    function errorTest(err) {
      return err && err.message !== special;
    }
    const options = {
      times,
      errorFilter: errorTest
    };
    await expect(retryit(options, fn)).rejects.toThrow(error + times);
    expect(callCount).toBe(3);
  });

  it('retry when some attempts fail and error test returns false at some invocation', async () => {
    let callCount = 0;
    const error = 'ERROR';
    const special = 'SPECIAL_ERROR';
    const erroredResult = 'RESULT';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        const err =
          callCount === 2 ? new Error(special) : new Error(error + callCount);
        if (err) {
          reject(err);
          return;
        }
        resolve(erroredResult + callCount);
      });
    }
    function errorTest(err) {
      return err && err.message === error + callCount; // just a different pattern
    }
    const options = {
      errorFilter: errorTest
    };
    await expect(retryit(options, fn)).rejects.toThrow(special);
    expect(callCount).toBe(2);
  });

  it('retry with interval when some attempts fail and error test returns false at some invokation', async () => {
    const interval = 50;
    let callCount = 0;
    const error = 'ERROR';
    const erroredResult = 'RESULT';
    const special = 'SPECIAL_ERROR';
    const specialCount = 3;
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        const err =
          callCount === specialCount
            ? new Error(special)
            : new Error(error + callCount);
        if (err) {
          reject(err);
          return;
        }
        resolve(erroredResult + callCount);
      });
    }
    function errorTest(err) {
      return err && err.message !== special;
    }
    const start = new Date().getTime();
    await expect(
      retryit({ interval, errorFilter: errorTest }, fn)
    ).rejects.toThrow(special);
    const now = new Date().getTime();
    const duration = now - start;
    expect(duration >= interval * (specialCount - 1)).toBeTruthy();
    expect(callCount).toBe(specialCount);
  });

  it('retry when first attempt succeeds and error test should not be called', async () => {
    let callCount = 0;
    const error = 'ERROR';
    const erroredResult = 'RESULT';
    let continueTestCalled = false;
    function fn() {
      return new Promise(resolve => {
        callCount += 1;
        resolve(erroredResult + callCount);
      });
    }
    function errorTest(err) {
      continueTestCalled = true;
      return err && err.message === error;
    }
    const options = {
      errorFilter: errorTest
    };
    expect(retryit(options, fn)).resolves.toEqual(erroredResult + callCount);
    expect(callCount).toBe(1);
    expect(continueTestCalled).not.toBeTruthy();
  });
});
