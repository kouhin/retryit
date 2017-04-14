import retryit from '../src/index';

describe('retryit', () => {
  it('retry when attempt succeeds', (done) => {
    let failed = 3;
    let callCount = 0;
    const expectedResult = 'success';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        failed -= 1;
        if (!failed) resolve(expectedResult);
        else reject(true); // respond with error
      });
    }
    retryit(fn)
      .then((result) => {
        expect(callCount).toBe(3);
        expect(result).toBe(expectedResult);
        done();
      }).catch(done);
  });

  it('retry when all attempts fail', (done) => {
    const times = 3;
    let callCount = 0;
    const error = 'ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(error + callCount);
      });
    }
    retryit(times, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch((err) => {
        expect(callCount).toBe(3);
        expect(err).toBe(error + times);
        done();
      });
  });

  it('retry when all attempts fail, receive prev error', (done) => {
    const times = 3;
    let callCount = 0;
    const error = 'ERROR';
    function fn(err) {
      if (callCount === 0) {
        expect(err).toBe(undefined);
      } else {
        expect(err).toBe(error + callCount);
      }
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(error + callCount);
      });
    }
    retryit(times, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch((err) => {
        expect(callCount).toBe(3);
        expect(err).toBe(error + times);
        done();
      });
  });

  it('retry fails with invalid arguments', (done) => {
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

  it('retry with interval when all attempts fail', (done) => {
    const times = 3;
    const interval = 50;
    let callCount = 0;
    const error = 'ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(error + callCount);
      });
    }
    const start = new Date().getTime();
    retryit({ times, interval }, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch((err) => {
        const now = new Date().getTime();
        const duration = now - start;
        expect(duration >= (interval * (times - 1))).toBeTruthy();
        expect(callCount).toBe(3);
        expect(err).toBe(error + times);
        done();
      });
  });

  it('retry with custom interval when all attempts fail', (done) => {
    const times = 3;
    const intervalFunc = retryCount => retryCount * 100;
    let callCount = 0;
    const error = 'ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(error + callCount);
      });
    }
    const start = new Date().getTime();
    retryit({ times, interval: intervalFunc }, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch((err) => {
        const now = new Date().getTime();
        const duration = now - start;
        expect(duration >= 300).toBeTruthy();
        expect(callCount).toBe(3);
        expect(err).toBe(error + times);
        done();
      });
  });

  it('retry does not precompute the intervals', (done) => {
    const callTimes = [];
    function intervalFunc() {
      callTimes.push(new Date().getTime());
      return 100;
    }
    function fn() {
      return Promise.reject({});
    }
    retryit({ times: 4, interval: intervalFunc }, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch(() => {
        expect(callTimes[1] - callTimes[0]).toBeGreaterThan(90);
        expect(callTimes[2] - callTimes[1]).toBeGreaterThan(90);
        done();
      });
  });

  it('retry calls fn immediately resolved if successful', (done) => {
    function fn() {
      return new Promise(resolve => resolve({ a: 1 }));
    }
    retryit(5, fn)
      .then((result) => {
        expect(result).toEqual({ a: 1 });
        done();
      }).catch(done);
  });

  it('retry when all attempts fail and error continue test returns true', (done) => {
    const times = 3;
    let callCount = 0;
    const error = 'ERROR';
    const special = 'SPECIAL_ERROR';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        reject(error + callCount);
      });
    }
    function errorTest(err) {
      return err && err !== special;
    }
    const options = {
      times,
      errorFilter: errorTest,
    };
    retryit(options, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch((err) => {
        expect(callCount).toBe(3);
        expect(err).toBe(error + times);
        done();
      });
  });

  it('retry when some attempts fail and error test returns false at some invokation', (done) => {
    let callCount = 0;
    const error = 'ERROR';
    const special = 'SPECIAL_ERROR';
    const erroredResult = 'RESULT';
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        const err = callCount === 2 ? special : error + callCount;
        if (err) {
          reject(err);
          return;
        }
        resolve(erroredResult + callCount);
      });
    }
    function errorTest(err) {
      return err && err === error + callCount; // just a different pattern
    }
    const options = {
      errorFilter: errorTest,
    };
    retryit(options, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch((err) => {
        expect(callCount).toBe(2);
        expect(err).toBe(special);
        done();
      });
  });

  it('retry with interval when some attempts fail and error test returns false at some invokation', (done) => {
    const interval = 50;
    let callCount = 0;
    const error = 'ERROR';
    const erroredResult = 'RESULT';
    const special = 'SPECIAL_ERROR';
    const specialCount = 3;
    function fn() {
      return new Promise((resolve, reject) => {
        callCount += 1;
        const err = callCount === specialCount ? special : error + callCount;
        if (err) {
          reject(err);
          return;
        }
        resolve(erroredResult + callCount);
      });
    }
    function errorTest(err) {
      return err && err !== special;
    }
    const start = new Date().getTime();
    retryit({ interval, errorFilter: errorTest }, fn)
      .then(() => {
        done('Incorrect result was returned');
      })
      .catch((err) => {
        const now = new Date().getTime();
        const duration = now - start;
        expect(duration >= (interval * (specialCount - 1))).toBeTruthy();
        expect(callCount).toBe(specialCount);
        expect(err).toBe(special);
        done();
      });
  });

  it('retry when first attempt succeeds and error test should not be called', (done) => {
    let callCount = 0;
    const error = 'ERROR';
    const erroredResult = 'RESULT';
    let continueTestCalled = false;
    function fn() {
      return new Promise((resolve) => {
        callCount += 1;
        resolve(erroredResult + callCount);
      });
    }
    function errorTest(err) {
      continueTestCalled = true;
      return err && err === error;
    }
    const options = {
      errorFilter: errorTest,
    };
    retryit(options, fn)
      .then((result) => {
        expect(callCount).toBe(1);
        expect(result).toBe(erroredResult + callCount);
        expect(continueTestCalled).not.toBeTruthy();
        done();
      })
      .catch(done);
  });
});
