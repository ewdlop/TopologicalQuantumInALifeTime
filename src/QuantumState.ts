import { Complex } from './Complex';

/**
 * Quantum state representation using state vectors
 * For a two-qubit system, the state is represented as a 4D vector
 */
export class QuantumState {
  /**
   * @param amplitudes - Complex amplitudes for basis states |00>, |01>, |10>, |11>
   */
  constructor(public amplitudes: Complex[]) {
    if (amplitudes.length !== 4) {
      throw new Error('Two-qubit system requires 4 amplitudes');
    }
    this.normalize();
  }

  /**
   * Normalize the quantum state so that sum of |amplitude|^2 = 1
   */
  private normalize(): void {
    const sumSquared = this.amplitudes.reduce(
      (sum, amp) => sum + amp.magnitudeSquared(),
      0
    );
    const norm = Math.sqrt(sumSquared);
    
    if (norm < 1e-10) {
      throw new Error('Cannot normalize zero state');
    }

    this.amplitudes = this.amplitudes.map((amp) => amp.scale(1 / norm));
  }

  /**
   * Get probability of measuring a specific basis state
   * @param stateIndex - 0 for |00>, 1 for |01>, 2 for |10>, 3 for |11>
   */
  getProbability(stateIndex: number): number {
    if (stateIndex < 0 || stateIndex >= 4) {
      throw new Error('State index must be between 0 and 3');
    }
    return this.amplitudes[stateIndex]?.magnitudeSquared() ?? 0;
  }

  /**
   * Create a Bell state (maximally entangled state)
   * @param type - Type of Bell state: 'phi+', 'phi-', 'psi+', 'psi-'
   * @returns Bell state
   */
  static createBellState(type: 'phi+' | 'phi-' | 'psi+' | 'psi-'): QuantumState {
    const sqrt2 = Math.sqrt(2);
    const amplitudes: Complex[] = [];

    switch (type) {
      case 'phi+':
        // |Φ+⟩ = (|00⟩ + |11⟩) / √2
        amplitudes.push(new Complex(1 / sqrt2, 0));
        amplitudes.push(new Complex(0, 0));
        amplitudes.push(new Complex(0, 0));
        amplitudes.push(new Complex(1 / sqrt2, 0));
        break;
      case 'phi-':
        // |Φ-⟩ = (|00⟩ - |11⟩) / √2
        amplitudes.push(new Complex(1 / sqrt2, 0));
        amplitudes.push(new Complex(0, 0));
        amplitudes.push(new Complex(0, 0));
        amplitudes.push(new Complex(-1 / sqrt2, 0));
        break;
      case 'psi+':
        // |Ψ+⟩ = (|01⟩ + |10⟩) / √2
        amplitudes.push(new Complex(0, 0));
        amplitudes.push(new Complex(1 / sqrt2, 0));
        amplitudes.push(new Complex(1 / sqrt2, 0));
        amplitudes.push(new Complex(0, 0));
        break;
      case 'psi-':
        // |Ψ-⟩ = (|01⟩ - |10⟩) / √2
        amplitudes.push(new Complex(0, 0));
        amplitudes.push(new Complex(1 / sqrt2, 0));
        amplitudes.push(new Complex(-1 / sqrt2, 0));
        amplitudes.push(new Complex(0, 0));
        break;
    }

    return new QuantumState(amplitudes);
  }

  /**
   * Create a product state (separable, not entangled)
   * @param qubit1 - State of first qubit [|0> amplitude, |1> amplitude]
   * @param qubit2 - State of second qubit [|0> amplitude, |1> amplitude]
   */
  static createProductState(
    qubit1: [Complex, Complex],
    qubit2: [Complex, Complex]
  ): QuantumState {
    const amplitudes = [
      qubit1[0].multiply(qubit2[0]), // |00>
      qubit1[0].multiply(qubit2[1]), // |01>
      qubit1[1].multiply(qubit2[0]), // |10>
      qubit1[1].multiply(qubit2[1]), // |11>
    ];
    return new QuantumState(amplitudes);
  }

  /**
   * String representation of the quantum state
   */
  toString(): string {
    return `QuantumState:\n` +
      `  |00⟩: ${this.amplitudes[0]?.toString()} (P=${this.getProbability(0).toFixed(4)})\n` +
      `  |01⟩: ${this.amplitudes[1]?.toString()} (P=${this.getProbability(1).toFixed(4)})\n` +
      `  |10⟩: ${this.amplitudes[2]?.toString()} (P=${this.getProbability(2).toFixed(4)})\n` +
      `  |11⟩: ${this.amplitudes[3]?.toString()} (P=${this.getProbability(3).toFixed(4)})`;
  }
}
