# Bell Test Implementation

A TypeScript implementation of Bell's inequality test demonstrating quantum entanglement and the violation of local realism.

## What is Bell's Test?

Bell's theorem is one of the most profound results in quantum mechanics. It proves that quantum mechanics cannot be explained by local hidden variable theories. In other words, quantum entanglement is real and cannot be explained by classical physics.

### Key Concepts

1. **Entanglement**: Two particles can be correlated in ways that classical physics cannot explain
2. **Local Hidden Variables**: The idea that particles have predetermined properties (hidden variables) that are determined locally
3. **CHSH Inequality**: A mathematical inequality that must be satisfied by any local realistic theory

### The CHSH Inequality

The CHSH (Clauser-Horne-Shimony-Holt) inequality states:

```
S = |E(a,b) - E(a,b') + E(a',b) + E(a',b')| ≤ 2
```

Where:
- `E(a,b)` is the correlation between measurements at angles `a` and `b`
- Classical (local realistic) theories must satisfy `S ≤ 2`
- Quantum mechanics allows `S ≤ 2√2 ≈ 2.828`

When quantum systems violate this inequality (S > 2), it proves that local hidden variable theories cannot explain quantum mechanics.

## Installation

```bash
npm install
```

## Usage

### Running Tests

```bash
npm test
```

### Running the Demo

```bash
npm run demo
```

The demo will:
1. Create a Bell state (maximally entangled state)
2. Calculate theoretical quantum correlations
3. Compute the CHSH value
4. Demonstrate the violation of Bell's inequality
5. Test all four Bell states
6. Compare with a separable (non-entangled) state

### Using in Your Code

```typescript
import { BellTest, QuantumState } from './src';

// Create a Bell state |Φ+⟩ = (|00⟩ + |11⟩) / √2
const bellState = QuantumState.createBellState('phi+');

// Get optimal measurement angles for CHSH test
const [a, aPrime, b, bPrime] = BellTest.getOptimalCHSHAngles();

// Calculate CHSH value
const chshValue = BellTest.calculateCHSH(bellState, [a, aPrime, b, bPrime]);

console.log(`CHSH value: ${chshValue}`);
console.log(`Classical bound: 2`);
console.log(`Quantum maximum: ${2 * Math.sqrt(2)}`);

if (chshValue > 2) {
  console.log('Bell inequality violated! Quantum entanglement confirmed!');
}
```

## Implementation Details

### Bell States

The implementation supports all four Bell states:

1. **|Φ+⟩ = (|00⟩ + |11⟩) / √2**
2. **|Φ-⟩ = (|00⟩ - |11⟩) / √2**
3. **|Ψ+⟩ = (|01⟩ + |10⟩) / √2**
4. **|Ψ-⟩ = (|01⟩ - |10⟩) / √2**

All four states are maximally entangled and violate Bell's inequality.

### Quantum Correlations

For a Bell state with measurement angles `a` and `b`, the quantum correlation is:

```
E(a,b) = cos(a - b)
```

This correlation is what enables the violation of Bell's inequality.

### Optimal Angles

For maximum CHSH violation, the optimal measurement angles are:
- Alice: a = 0, a' = π/2
- Bob: b = π/4, b' = 3π/4

These angles yield S = 2√2 ≈ 2.828, the maximum violation allowed by quantum mechanics.

## Project Structure

```
src/
├── Complex.ts          # Complex number implementation
├── QuantumState.ts     # Quantum state representation
├── BellTest.ts         # Bell test implementation
├── demo.ts             # Demonstration program
├── index.ts            # Public API exports
└── __tests__/
    ├── Complex.test.ts
    ├── QuantumState.test.ts
    └── BellTest.test.ts
```

## Testing

The project includes comprehensive tests covering:

- Complex number arithmetic
- Quantum state creation and normalization
- Bell state generation
- Quantum correlation calculations
- CHSH inequality calculations
- Product (separable) state behavior

Run tests with:

```bash
npm test
```

## Scientific Background

### References

1. Bell, J.S. (1964). "On the Einstein Podolsky Rosen Paradox". Physics Physique Физика. 1 (3): 195–200.

2. Clauser, J.F.; Horne, M.A.; Shimony, A.; Holt, R.A. (1969). "Proposed experiment to test local hidden-variable theories". Physical Review Letters. 23 (15): 880–884.

3. Aspect, A.; Dalibard, J.; Roger, G. (1982). "Experimental Test of Bell's Inequalities Using Time-Varying Analyzers". Physical Review Letters. 49 (25): 1804–1807.

### Nobel Prize 2022

The 2022 Nobel Prize in Physics was awarded to Alain Aspect, John Clauser, and Anton Zeilinger for experiments with entangled photons, establishing the violation of Bell inequalities and pioneering quantum information science.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
