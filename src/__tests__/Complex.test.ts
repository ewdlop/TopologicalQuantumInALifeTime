import { Complex } from '../Complex';

describe('Complex', () => {
  describe('constructor', () => {
    it('should create a complex number with real and imaginary parts', () => {
      const c = new Complex(3, 4);
      expect(c.real).toBe(3);
      expect(c.imag).toBe(4);
    });

    it('should default imaginary part to 0', () => {
      const c = new Complex(5);
      expect(c.real).toBe(5);
      expect(c.imag).toBe(0);
    });
  });

  describe('add', () => {
    it('should add two complex numbers', () => {
      const c1 = new Complex(1, 2);
      const c2 = new Complex(3, 4);
      const result = c1.add(c2);
      expect(result.real).toBe(4);
      expect(result.imag).toBe(6);
    });
  });

  describe('subtract', () => {
    it('should subtract two complex numbers', () => {
      const c1 = new Complex(5, 7);
      const c2 = new Complex(2, 3);
      const result = c1.subtract(c2);
      expect(result.real).toBe(3);
      expect(result.imag).toBe(4);
    });
  });

  describe('multiply', () => {
    it('should multiply two complex numbers', () => {
      const c1 = new Complex(1, 2);
      const c2 = new Complex(3, 4);
      const result = c1.multiply(c2);
      // (1+2i)(3+4i) = 3 + 4i + 6i + 8i^2 = 3 + 10i - 8 = -5 + 10i
      expect(result.real).toBe(-5);
      expect(result.imag).toBe(10);
    });

    it('should multiply by i correctly', () => {
      const c1 = new Complex(3, 0);
      const i = new Complex(0, 1);
      const result = c1.multiply(i);
      expect(result.real).toBe(0);
      expect(result.imag).toBe(3);
    });
  });

  describe('scale', () => {
    it('should scale by a scalar', () => {
      const c = new Complex(2, 3);
      const result = c.scale(2);
      expect(result.real).toBe(4);
      expect(result.imag).toBe(6);
    });
  });

  describe('conjugate', () => {
    it('should return complex conjugate', () => {
      const c = new Complex(3, 4);
      const conj = c.conjugate();
      expect(conj.real).toBe(3);
      expect(conj.imag).toBe(-4);
    });
  });

  describe('magnitude', () => {
    it('should calculate magnitude correctly', () => {
      const c = new Complex(3, 4);
      expect(c.magnitude()).toBe(5);
    });

    it('should calculate magnitude of purely real number', () => {
      const c = new Complex(5, 0);
      expect(c.magnitude()).toBe(5);
    });

    it('should calculate magnitude of purely imaginary number', () => {
      const c = new Complex(0, 5);
      expect(c.magnitude()).toBe(5);
    });
  });

  describe('magnitudeSquared', () => {
    it('should calculate magnitude squared', () => {
      const c = new Complex(3, 4);
      expect(c.magnitudeSquared()).toBe(25);
    });
  });

  describe('isApproximatelyEqual', () => {
    it('should return true for approximately equal numbers', () => {
      const c1 = new Complex(1.0000000001, 2.0000000001);
      const c2 = new Complex(1.0, 2.0);
      expect(c1.isApproximatelyEqual(c2, 1e-8)).toBe(true);
    });

    it('should return false for different numbers', () => {
      const c1 = new Complex(1, 2);
      const c2 = new Complex(1, 3);
      expect(c1.isApproximatelyEqual(c2)).toBe(false);
    });
  });
});
