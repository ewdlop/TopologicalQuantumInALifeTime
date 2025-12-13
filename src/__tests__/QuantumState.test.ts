import { Complex } from '../Complex';
import { QuantumState } from '../QuantumState';

describe('QuantumState', () => {
  describe('constructor', () => {
    it('should create a quantum state and normalize it', () => {
      const amplitudes = [
        new Complex(1, 0),
        new Complex(0, 0),
        new Complex(0, 0),
        new Complex(1, 0),
      ];
      const state = new QuantumState(amplitudes);

      // Should be normalized: |1/√2|^2 + |1/√2|^2 = 1
      const prob00 = state.getProbability(0);
      const prob11 = state.getProbability(3);
      
      expect(prob00).toBeCloseTo(0.5);
      expect(prob11).toBeCloseTo(0.5);
    });

    it('should throw error for wrong number of amplitudes', () => {
      const amplitudes = [new Complex(1, 0), new Complex(0, 0)];
      expect(() => new QuantumState(amplitudes)).toThrow();
    });

    it('should throw error for zero state', () => {
      const amplitudes = [
        new Complex(0, 0),
        new Complex(0, 0),
        new Complex(0, 0),
        new Complex(0, 0),
      ];
      expect(() => new QuantumState(amplitudes)).toThrow('Cannot normalize zero state');
    });
  });

  describe('createBellState', () => {
    it('should create |Φ+⟩ Bell state', () => {
      const state = QuantumState.createBellState('phi+');
      
      // |Φ+⟩ = (|00⟩ + |11⟩) / √2
      expect(state.getProbability(0)).toBeCloseTo(0.5); // |00⟩
      expect(state.getProbability(1)).toBeCloseTo(0);   // |01⟩
      expect(state.getProbability(2)).toBeCloseTo(0);   // |10⟩
      expect(state.getProbability(3)).toBeCloseTo(0.5); // |11⟩
    });

    it('should create |Φ-⟩ Bell state', () => {
      const state = QuantumState.createBellState('phi-');
      
      // |Φ-⟩ = (|00⟩ - |11⟩) / √2
      expect(state.getProbability(0)).toBeCloseTo(0.5);
      expect(state.getProbability(1)).toBeCloseTo(0);
      expect(state.getProbability(2)).toBeCloseTo(0);
      expect(state.getProbability(3)).toBeCloseTo(0.5);
    });

    it('should create |Ψ+⟩ Bell state', () => {
      const state = QuantumState.createBellState('psi+');
      
      // |Ψ+⟩ = (|01⟩ + |10⟩) / √2
      expect(state.getProbability(0)).toBeCloseTo(0);
      expect(state.getProbability(1)).toBeCloseTo(0.5);
      expect(state.getProbability(2)).toBeCloseTo(0.5);
      expect(state.getProbability(3)).toBeCloseTo(0);
    });

    it('should create |Ψ-⟩ Bell state', () => {
      const state = QuantumState.createBellState('psi-');
      
      // |Ψ-⟩ = (|01⟩ - |10⟩) / √2
      expect(state.getProbability(0)).toBeCloseTo(0);
      expect(state.getProbability(1)).toBeCloseTo(0.5);
      expect(state.getProbability(2)).toBeCloseTo(0.5);
      expect(state.getProbability(3)).toBeCloseTo(0);
    });

    it('all Bell states should be properly normalized', () => {
      const states: Array<'phi+' | 'phi-' | 'psi+' | 'psi-'> = ['phi+', 'phi-', 'psi+', 'psi-'];
      
      states.forEach(type => {
        const state = QuantumState.createBellState(type);
        const totalProb = 
          state.getProbability(0) +
          state.getProbability(1) +
          state.getProbability(2) +
          state.getProbability(3);
        
        expect(totalProb).toBeCloseTo(1);
      });
    });
  });

  describe('createProductState', () => {
    it('should create |00⟩ product state', () => {
      const state = QuantumState.createProductState(
        [new Complex(1, 0), new Complex(0, 0)], // |0⟩
        [new Complex(1, 0), new Complex(0, 0)]  // |0⟩
      );
      
      expect(state.getProbability(0)).toBeCloseTo(1); // |00⟩
      expect(state.getProbability(1)).toBeCloseTo(0);
      expect(state.getProbability(2)).toBeCloseTo(0);
      expect(state.getProbability(3)).toBeCloseTo(0);
    });

    it('should create |11⟩ product state', () => {
      const state = QuantumState.createProductState(
        [new Complex(0, 0), new Complex(1, 0)], // |1⟩
        [new Complex(0, 0), new Complex(1, 0)]  // |1⟩
      );
      
      expect(state.getProbability(0)).toBeCloseTo(0);
      expect(state.getProbability(1)).toBeCloseTo(0);
      expect(state.getProbability(2)).toBeCloseTo(0);
      expect(state.getProbability(3)).toBeCloseTo(1); // |11⟩
    });

    it('should create |+⟩|+⟩ product state', () => {
      const sqrt2 = Math.sqrt(2);
      const state = QuantumState.createProductState(
        [new Complex(1/sqrt2, 0), new Complex(1/sqrt2, 0)], // |+⟩
        [new Complex(1/sqrt2, 0), new Complex(1/sqrt2, 0)]  // |+⟩
      );
      
      // |+⟩|+⟩ = (|0⟩+|1⟩)(|0⟩+|1⟩)/2 = (|00⟩+|01⟩+|10⟩+|11⟩)/2
      expect(state.getProbability(0)).toBeCloseTo(0.25);
      expect(state.getProbability(1)).toBeCloseTo(0.25);
      expect(state.getProbability(2)).toBeCloseTo(0.25);
      expect(state.getProbability(3)).toBeCloseTo(0.25);
    });
  });

  describe('getProbability', () => {
    it('should throw error for invalid state index', () => {
      const state = QuantumState.createBellState('phi+');
      expect(() => state.getProbability(-1)).toThrow();
      expect(() => state.getProbability(4)).toThrow();
    });
  });
});
