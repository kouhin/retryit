import { fixedWait, incrementingWait, fibonacciWait, randomWait, exponentialWait } from '../src';

describe('waitStrategies', () => {
  describe('fixedWait', () => {
    it('fixedWait(1000), should always return 1000', () => {
      const wait = fixedWait(1000);
      expect(wait(1)).toBe(1000);
      expect(wait(2)).toBe(1000);
      expect(wait(3)).toBe(1000);
    });

    it('fixedWait(0), should always return 0', () => {
      const wait = fixedWait(0);
      expect(wait(1)).toBe(0);
      expect(wait(2)).toBe(0);
      expect(wait(3)).toBe(0);
    });
  });

  describe('incrementingWait', () => {
    it('incrementingWait(), should return 0, 1000, 2000, 3000, 4000', () => {
      const wait = incrementingWait();
      expect(wait(1)).toBe(0);
      expect(wait(2)).toBe(1000);
      expect(wait(3)).toBe(2000);
      expect(wait(4)).toBe(3000);
      expect(wait(5)).toBe(4000);
    });

    it('incrementingWait(1000, 2000), should return 1000, 3000, 5000, 7000, 9000', () => {
      const wait = incrementingWait(1000, 2000);
      expect(wait(1)).toBe(1000);
      expect(wait(2)).toBe(3000);
      expect(wait(3)).toBe(5000);
      expect(wait(4)).toBe(7000);
      expect(wait(5)).toBe(9000);
    });

    it('incrementingWait(), when pass a negative number, 0 will be used as count', () => {
      const wait = incrementingWait(1000, 2000);
      expect(wait(-1)).toBe(1000);
      expect(wait(-2)).toBe(1000);
      expect(wait(-3)).toBe(1000);
    });

    it('incrementingWait(1000, 2000, 8000), should return 1000, 3000, 5000, 7000, 8000', () => {
      const wait = incrementingWait(1000, 2000, 8000);
      expect(wait(1)).toBe(1000);
      expect(wait(2)).toBe(3000);
      expect(wait(3)).toBe(5000);
      expect(wait(4)).toBe(7000);
      expect(wait(5)).toBe(8000);
    });
  });

  describe('fibonacciWait', () => {
    it('fibonacciWait(), should return 1, 1, 2, 3, 5, 8, 13', () => {
      const wait = fibonacciWait();
      expect(wait(1)).toBe(1);
      expect(wait(2)).toBe(1);
      expect(wait(3)).toBe(2);
      expect(wait(4)).toBe(3);
      expect(wait(5)).toBe(5);
      expect(wait(6)).toBe(8);
      expect(wait(7)).toBe(13);
    });

    it('fibonacciWait(), when pass a negative number, 0 will be used as count', () => {
      const wait = fibonacciWait();
      expect(wait(-1)).toBe(1);
      expect(wait(-2)).toBe(1);
      expect(wait(-3)).toBe(1);
    });

    it('fibonacciWait(4, 2), should return 2, 2, 2, 2, 2', () => {
      const wait = fibonacciWait(4, 2);
      expect(wait(1)).toBe(2);
      expect(wait(2)).toBe(2);
      expect(wait(3)).toBe(2);
      expect(wait(4)).toBe(2);
      expect(wait(5)).toBe(2);
    });

    it('fibonacciWait(100), should return 100, 100, 200, 300, 500, 800, 1300', () => {
      const wait = fibonacciWait(100);
      expect(wait(1)).toBe(100);
      expect(wait(2)).toBe(100);
      expect(wait(3)).toBe(200);
      expect(wait(4)).toBe(300);
      expect(wait(5)).toBe(500);
      expect(wait(6)).toBe(800);
      expect(wait(7)).toBe(1300);
    });

    it('fibonacciWait(100, 800), should return 100, 100, 200, 300, 500, 800, 800', () => {
      const wait = fibonacciWait(100, 800);
      expect(wait(1)).toBe(100);
      expect(wait(2)).toBe(100);
      expect(wait(3)).toBe(200);
      expect(wait(4)).toBe(300);
      expect(wait(5)).toBe(500);
      expect(wait(6)).toBe(800);
      expect(wait(7)).toBe(800);
    });
  });

  describe('randomWait', () => {
    it('randomWait(35, 45), should return a number between 35 and 45', () => {
      const wait = randomWait(35, 45);
      expect(wait(1)).toBeGreaterThanOrEqual(35);
      expect(wait(1)).toBeLessThanOrEqual(45);
      expect(wait(2)).toBeGreaterThanOrEqual(35);
      expect(wait(2)).toBeLessThanOrEqual(45);
      expect(wait(3)).toBeGreaterThanOrEqual(35);
      expect(wait(3)).toBeLessThanOrEqual(45);
      expect(wait(4)).toBeGreaterThanOrEqual(35);
      expect(wait(4)).toBeLessThanOrEqual(45);
      expect(wait(5)).toBeGreaterThanOrEqual(35);
      expect(wait(5)).toBeLessThanOrEqual(45);
      expect(wait(6)).toBeGreaterThanOrEqual(35);
      expect(wait(6)).toBeLessThanOrEqual(45);
      expect(wait(7)).toBeGreaterThanOrEqual(35);
      expect(wait(7)).toBeLessThanOrEqual(45);
      expect(wait(8)).toBeGreaterThanOrEqual(35);
      expect(wait(8)).toBeLessThanOrEqual(45);
      expect(wait(9)).toBeGreaterThanOrEqual(35);
      expect(wait(9)).toBeLessThanOrEqual(45);
      expect(wait(10)).toBeGreaterThanOrEqual(35);
      expect(wait(10)).toBeLessThanOrEqual(45);
      expect(wait(11)).toBeGreaterThanOrEqual(35);
      expect(wait(11)).toBeLessThanOrEqual(45);
      expect(wait(12)).toBeGreaterThanOrEqual(35);
      expect(wait(12)).toBeLessThanOrEqual(45);
      expect(wait(13)).toBeGreaterThanOrEqual(35);
      expect(wait(13)).toBeLessThanOrEqual(45);
      expect(wait(14)).toBeGreaterThanOrEqual(35);
      expect(wait(14)).toBeLessThanOrEqual(45);
      expect(wait(15)).toBeGreaterThanOrEqual(35);
      expect(wait(15)).toBeLessThanOrEqual(45);
    });

    it('randomWait(), 0 will be used as min and max, should always return 0', () => {
      const wait = randomWait();
      expect(wait(1)).toBe(0);
      expect(wait(2)).toBe(0);
      expect(wait(3)).toBe(0);
    });
  });

  describe('exponentialWait', () => {
    it('exponentialWait(), should return 2, 4, 8, 16, 32, 64', () => {
      const wait = exponentialWait();
      expect(wait(1)).toBe(2);
      expect(wait(2)).toBe(4);
      expect(wait(3)).toBe(8);
      expect(wait(4)).toBe(16);
      expect(wait(5)).toBe(32);
      expect(wait(6)).toBe(64);
    });

    it('exponentialWait(100, 3200), should return 200, 400, 800, 1600, 3200, 3200', () => {
      const wait = exponentialWait(100, 3200);
      expect(wait(1)).toBe(200);
      expect(wait(2)).toBe(400);
      expect(wait(3)).toBe(800);
      expect(wait(4)).toBe(1600);
      expect(wait(5)).toBe(3200);
      expect(wait(6)).toBe(3200);
    });
  });
});
