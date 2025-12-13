/**
 * Complex number representation for quantum mechanics
 */
export class Complex {
  constructor(public real: number, public imag: number = 0) {}

  /**
   * Add two complex numbers
   */
  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  /**
   * Subtract two complex numbers
   */
  subtract(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  /**
   * Multiply two complex numbers
   */
  multiply(other: Complex): Complex {
    const real = this.real * other.real - this.imag * other.imag;
    const imag = this.real * other.imag + this.imag * other.real;
    return new Complex(real, imag);
  }

  /**
   * Multiply by a scalar
   */
  scale(scalar: number): Complex {
    return new Complex(this.real * scalar, this.imag * scalar);
  }

  /**
   * Complex conjugate
   */
  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  /**
   * Magnitude (absolute value)
   */
  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  /**
   * Magnitude squared
   */
  magnitudeSquared(): number {
    return this.real * this.real + this.imag * this.imag;
  }

  /**
   * String representation
   */
  toString(): string {
    if (this.imag >= 0) {
      return `${this.real.toFixed(4)} + ${this.imag.toFixed(4)}i`;
    } else {
      return `${this.real.toFixed(4)} - ${Math.abs(this.imag).toFixed(4)}i`;
    }
  }

  /**
   * Check if two complex numbers are approximately equal
   */
  isApproximatelyEqual(other: Complex, epsilon: number = 1e-10): boolean {
    return (
      Math.abs(this.real - other.real) < epsilon &&
      Math.abs(this.imag - other.imag) < epsilon
    );
  }
}
