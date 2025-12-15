import { BellTest } from '../BellTest';
import { QuantumState } from '../QuantumState';

describe('BellTest', () => {
  describe('calculateQuantumCorrelation', () => {
    it('should calculate correlation for Bell state with same angles', () => {
      const state = QuantumState.createBellState('phi+');
      
      // When both measure at same angle, perfect correlation
      const correlation = BellTest.calculateQuantumCorrelation(state, 0, 0);
      expect(correlation).toBeCloseTo(1);
    });

    it('should calculate correlation for orthogonal measurements', () => {
      const state = QuantumState.createBellState('phi+');
      
      // When measuring at 45 degrees apart
      const correlation = BellTest.calculateQuantumCorrelation(
        state,
        0,
        Math.PI / 4
      );
      
      // E(0, π/4) = cos(π/4) = 1/√2 ≈ 0.707
      expect(correlation).toBeCloseTo(1 / Math.sqrt(2), 5);
    });

    it('should calculate correlation for opposite measurements', () => {
      const state = QuantumState.createBellState('phi+');
      
      // 90 degrees apart
      const correlation = BellTest.calculateQuantumCorrelation(
        state,
        0,
        Math.PI / 2
      );
      
      // E(0, π/2) = cos(π/2) = 0
      expect(correlation).toBeCloseTo(0, 5);
    });
  });

  describe('calculateCHSH', () => {
    it('should violate classical bound for optimal angles', () => {
      const state = QuantumState.createBellState('phi+');
      const optimalAngles = BellTest.getOptimalCHSHAngles();
      
      const chshValue = BellTest.calculateCHSH(state, optimalAngles);
      
      // Quantum mechanics allows up to 2√2 ≈ 2.828
      // Classical bound is 2
      expect(chshValue).toBeGreaterThan(2);
      expect(chshValue).toBeLessThanOrEqual(2 * Math.sqrt(2) + 0.01); // with small tolerance
    });

    it('should produce maximum violation with optimal angles', () => {
      const state = QuantumState.createBellState('phi+');
      const [a, aPrime, b, bPrime] = BellTest.getOptimalCHSHAngles();
      
      const chshValue = BellTest.calculateCHSH(state, [a, aPrime, b, bPrime]);
      
      // Maximum violation is 2√2
      expect(chshValue).toBeCloseTo(2 * Math.sqrt(2), 3);
    });

    it('should work with all Bell states', () => {
      const bellStates: Array<'phi+' | 'phi-' | 'psi+' | 'psi-'> = [
        'phi+', 'phi-', 'psi+', 'psi-'
      ];
      const optimalAngles = BellTest.getOptimalCHSHAngles();
      
      bellStates.forEach(stateType => {
        const state = QuantumState.createBellState(stateType);
        const chshValue = BellTest.calculateCHSH(state, optimalAngles);
        
        // All maximally entangled states should violate classical bound
        expect(chshValue).toBeGreaterThan(2);
      });
    });

    it('should not violate for product states', () => {
      // Create a separable (product) state
      const state = QuantumState.createProductState(
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(1, 0), new Complex(0, 0)]
      );
      
      const optimalAngles = BellTest.getOptimalCHSHAngles();
      const chshValue = BellTest.calculateCHSH(state, optimalAngles);
      
      // Product states should not violate (or violate very little due to numerical errors)
      expect(chshValue).toBeLessThanOrEqual(2.1); // Small tolerance for numerical errors
    });
  });

  describe('getOptimalCHSHAngles', () => {
    it('should return correct optimal angles', () => {
      const [a, aPrime, b, bPrime] = BellTest.getOptimalCHSHAngles();
      
      expect(a).toBeCloseTo(0);
      expect(aPrime).toBeCloseTo(Math.PI / 2);
      expect(b).toBeCloseTo(Math.PI / 4);
      expect(bPrime).toBeCloseTo((3 * Math.PI) / 4);
    });
  });

  describe('measureQubit', () => {
    it('should return +1 or -1', () => {
      const state = QuantumState.createBellState('phi+');
      
      for (let i = 0; i < 100; i++) {
        const result = BellTest.measureQubit(state, 0, 0);
        expect([1, -1]).toContain(result);
      }
    });

    it('should produce results consistent with probabilities', () => {
      // Create |0⟩|0⟩ state - should always measure +1 in computational basis
      const state = QuantumState.createProductState(
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(1, 0), new Complex(0, 0)]
      );
      
      let sumResults = 0;
      const numTrials = 1000;
      
      for (let i = 0; i < numTrials; i++) {
        const result = BellTest.measureQubit(state, 0, 0);
        sumResults += result;
      }
      
      // Since we're in |0⟩ state and measuring in computational basis,
      // we should get mostly +1
      const avgResult = sumResults / numTrials;
      expect(avgResult).toBeGreaterThan(0.5); // Majority should be +1
    });
  });

  describe('runEmpiricalCorrelation', () => {
    it('should return values between -1 and 1', () => {
      const state = QuantumState.createBellState('phi+');
      
      const empirical = BellTest.runEmpiricalCorrelation(state, 0, Math.PI / 4, 1000);
      
      // Correlation should be in valid range
      expect(empirical).toBeGreaterThanOrEqual(-1);
      expect(empirical).toBeLessThanOrEqual(1);
    });
  });

  describe('runEmpiricalCHSH', () => {
    it('should return reasonable CHSH value', () => {
      const state = QuantumState.createBellState('phi+');
      const optimalAngles = BellTest.getOptimalCHSHAngles();
      
      const empirical = BellTest.runEmpiricalCHSH(state, optimalAngles, 5000);
      
      // Empirical should be in valid range (0 to 4)
      expect(empirical).toBeGreaterThanOrEqual(0);
      expect(empirical).toBeLessThanOrEqual(4);
    });
  });
});

// Import Complex for product state test
import { Complex } from '../Complex';
