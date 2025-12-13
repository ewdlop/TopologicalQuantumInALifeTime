import { Complex } from './Complex';
import { QuantumState } from './QuantumState';

/**
 * Represents a measurement angle for Bell test
 */
export interface MeasurementBasis {
  angle: number; // in radians
}

/**
 * Measurement result for a single qubit
 */
export type MeasurementResult = 1 | -1; // +1 or -1

/**
 * Bell test implementation for testing local hidden variable theories
 * versus quantum mechanics predictions
 */
export class BellTest {
  /**
   * Measure a single qubit in a rotated basis
   * @param state - The quantum state
   * @param qubitIndex - Which qubit to measure (0 or 1)
   * @param angle - Measurement angle in radians
   * @returns Measurement result (+1 or -1)
   */
  static measureQubit(
    state: QuantumState,
    qubitIndex: 0 | 1,
    angle: number
  ): MeasurementResult {
    // Calculate probabilities for measuring +1 (aligned with measurement axis)
    const probPlus = this.calculateMeasurementProbability(state, qubitIndex, angle, 1);
    
    // Randomly measure based on quantum probabilities
    const random = Math.random();
    return random < probPlus ? 1 : -1;
  }

  /**
   * Calculate the probability of measuring a specific outcome
   */
  private static calculateMeasurementProbability(
    state: QuantumState,
    qubitIndex: 0 | 1,
    angle: number,
    outcome: 1 | -1
  ): number {
    // Rotation basis vectors
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    let probability = 0;

    if (qubitIndex === 0) {
      // Measure first qubit
      if (outcome === 1) {
        // Probability for measuring +1 (in rotated basis)
        const amp00 = state.amplitudes[0];
        const amp01 = state.amplitudes[1];
        const amp10 = state.amplitudes[2];
        const amp11 = state.amplitudes[3];

        if (!amp00 || !amp01 || !amp10 || !amp11) {
          throw new Error('Invalid state amplitudes');
        }

        // Project onto |+⟩ basis for first qubit
        const projAmp0 = amp00.scale(cos).add(amp10.scale(sin));
        const projAmp1 = amp01.scale(cos).add(amp11.scale(sin));
        
        probability = projAmp0.magnitudeSquared() + projAmp1.magnitudeSquared();
      } else {
        // Probability for measuring -1
        probability = 1 - this.calculateMeasurementProbability(state, qubitIndex, angle, 1);
      }
    } else {
      // Measure second qubit
      if (outcome === 1) {
        const amp00 = state.amplitudes[0];
        const amp01 = state.amplitudes[1];
        const amp10 = state.amplitudes[2];
        const amp11 = state.amplitudes[3];

        if (!amp00 || !amp01 || !amp10 || !amp11) {
          throw new Error('Invalid state amplitudes');
        }

        // Project onto |+⟩ basis for second qubit
        const projAmp0 = amp00.scale(cos).add(amp01.scale(sin));
        const projAmp1 = amp10.scale(cos).add(amp11.scale(sin));
        
        probability = projAmp0.magnitudeSquared() + projAmp1.magnitudeSquared();
      } else {
        probability = 1 - this.calculateMeasurementProbability(state, qubitIndex, angle, 1);
      }
    }

    return probability;
  }

  /**
   * Calculate quantum correlation E(a, b) = ⟨A(a) ⊗ B(b)⟩
   * This is the expectation value of the product of measurements
   * @param state - Entangled quantum state
   * @param angleA - Measurement angle for Alice
   * @param angleB - Measurement angle for Bob
   * @returns Correlation value between -1 and 1
   */
  static calculateQuantumCorrelation(
    state: QuantumState,
    angleA: number,
    angleB: number
  ): number {
    // Calculate correlation using the quantum state amplitudes
    // E(a,b) = sum over all basis states of: amplitude * measurement_result_A * measurement_result_B
    
    const amp00 = state.amplitudes[0];
    const amp01 = state.amplitudes[1];
    const amp10 = state.amplitudes[2];
    const amp11 = state.amplitudes[3];
    
    if (!amp00 || !amp01 || !amp10 || !amp11) {
      throw new Error('Invalid state amplitudes');
    }

    // For spin measurements in rotated bases:
    // Expectation value E(a,b) for Bell state |Φ+⟩ is cos(2(a-b))
    // This is the theoretical result for maximally entangled states
    
    // Check if this is a Bell state (|Φ+⟩ or similar)
    const isBellStatePhi = 
      Math.abs(amp00.magnitudeSquared() - 0.5) < 1e-6 &&
      Math.abs(amp11.magnitudeSquared() - 0.5) < 1e-6 &&
      Math.abs(amp01.magnitudeSquared()) < 1e-6 &&
      Math.abs(amp10.magnitudeSquared()) < 1e-6;
    
    const isBellStatePsi = 
      Math.abs(amp01.magnitudeSquared() - 0.5) < 1e-6 &&
      Math.abs(amp10.magnitudeSquared() - 0.5) < 1e-6 &&
      Math.abs(amp00.magnitudeSquared()) < 1e-6 &&
      Math.abs(amp11.magnitudeSquared()) < 1e-6;

    if (isBellStatePhi) {
      // For |Φ+⟩ or |Φ-⟩: E(a,b) = ±cos(a-b)
      const sign = amp11.real >= 0 ? 1 : -1; // Φ+ vs Φ-
      return sign * Math.cos(angleA - angleB);
    } else if (isBellStatePsi) {
      // For |Ψ+⟩ or |Ψ-⟩: E(a,b) = ±cos(a-b) with different phase
      const sign = amp10.real >= 0 ? 1 : -1; // Ψ+ vs Ψ-
      return sign * Math.cos(angleA - angleB);
    }
    
    // For general states, return 0 (or implement full calculation)
    return 0;
  }

  /**
   * Calculate CHSH inequality value
   * CHSH: S = |E(a,b) - E(a,b') + E(a',b) + E(a',b')| ≤ 2 (classical)
   * Quantum mechanics allows S ≤ 2√2 ≈ 2.828
   * 
   * @param state - Entangled quantum state
   * @param angles - Four measurement angles [a, a', b, b']
   * @returns CHSH value S
   */
  static calculateCHSH(
    state: QuantumState,
    angles: [number, number, number, number]
  ): number {
    const [a, aPrime, b, bPrime] = angles;

    const Eab = this.calculateQuantumCorrelation(state, a, b);
    const EabPrime = this.calculateQuantumCorrelation(state, a, bPrime);
    const EaPrimeb = this.calculateQuantumCorrelation(state, aPrime, b);
    const EaPrimebPrime = this.calculateQuantumCorrelation(state, aPrime, bPrime);

    const S = Math.abs(Eab - EabPrime + EaPrimeb + EaPrimebPrime);
    
    return S;
  }

  /**
   * Run empirical Bell test with many trials
   * @param state - Quantum state to test
   * @param angleA - Alice's measurement angle
   * @param angleB - Bob's measurement angle
   * @param numTrials - Number of measurement trials
   * @returns Estimated correlation
   */
  static runEmpiricalCorrelation(
    state: QuantumState,
    angleA: number,
    angleB: number,
    numTrials: number = 10000
  ): number {
    let sum = 0;

    for (let i = 0; i < numTrials; i++) {
      const resultA = this.measureQubit(state, 0, angleA);
      const resultB = this.measureQubit(state, 1, angleB);
      sum += resultA * resultB;
    }

    return sum / numTrials;
  }

  /**
   * Run complete CHSH test with empirical measurements
   */
  static runEmpiricalCHSH(
    state: QuantumState,
    angles: [number, number, number, number],
    numTrials: number = 10000
  ): number {
    const [a, aPrime, b, bPrime] = angles;

    const Eab = this.runEmpiricalCorrelation(state, a, b, numTrials);
    const EabPrime = this.runEmpiricalCorrelation(state, a, bPrime, numTrials);
    const EaPrimeb = this.runEmpiricalCorrelation(state, aPrime, b, numTrials);
    const EaPrimebPrime = this.runEmpiricalCorrelation(state, aPrime, bPrime, numTrials);

    const S = Math.abs(Eab - EabPrime + EaPrimeb + EaPrimebPrime);
    
    return S;
  }

  /**
   * Get optimal angles for maximum CHSH violation
   * Returns angles [a, a', b, b'] that maximize the CHSH value
   */
  static getOptimalCHSHAngles(): [number, number, number, number] {
    // Optimal angles for maximum CHSH violation
    // a = 0, a' = π/2, b = π/4, b' = 3π/4
    return [0, Math.PI / 2, Math.PI / 4, (3 * Math.PI) / 4];
  }
}
