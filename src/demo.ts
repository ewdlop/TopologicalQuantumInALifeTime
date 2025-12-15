import { BellTest } from './BellTest';
import { QuantumState } from './QuantumState';
import { Complex } from './Complex';

/**
 * Demonstration of Bell's Inequality Test
 * 
 * This demonstrates that quantum mechanics violates Bell's inequality,
 * which means local hidden variable theories cannot explain quantum correlations.
 */

console.log('='.repeat(70));
console.log('Bell\'s Inequality Test - Quantum Entanglement Demonstration');
console.log('='.repeat(70));
console.log();

// Create a maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩) / √2
console.log('Creating Bell state |Φ+⟩ = (|00⟩ + |11⟩) / √2');
const bellState = QuantumState.createBellState('phi+');
console.log(bellState.toString());
console.log();

// Get optimal measurement angles for maximum CHSH violation
console.log('Optimal measurement angles for CHSH test:');
const [a, aPrime, b, bPrime] = BellTest.getOptimalCHSHAngles();
console.log(`  Alice's angles:  a = ${a.toFixed(4)} rad,  a' = ${aPrime.toFixed(4)} rad`);
console.log(`  Bob's angles:    b = ${b.toFixed(4)} rad,  b' = ${bPrime.toFixed(4)} rad`);
console.log();

// Calculate theoretical quantum correlations
console.log('Theoretical Quantum Correlations:');
const Eab = BellTest.calculateQuantumCorrelation(bellState, a, b);
const EabPrime = BellTest.calculateQuantumCorrelation(bellState, a, bPrime);
const EaPrimeb = BellTest.calculateQuantumCorrelation(bellState, aPrime, b);
const EaPrimebPrime = BellTest.calculateQuantumCorrelation(bellState, aPrime, bPrime);

console.log(`  E(a, b)     = ${Eab.toFixed(4)}`);
console.log(`  E(a, b')    = ${EabPrime.toFixed(4)}`);
console.log(`  E(a', b)    = ${EaPrimeb.toFixed(4)}`);
console.log(`  E(a', b')   = ${EaPrimebPrime.toFixed(4)}`);
console.log();

// Calculate CHSH value
console.log('CHSH Inequality Test:');
const chshTheoretical = BellTest.calculateCHSH(bellState, [a, aPrime, b, bPrime]);
console.log(`  Theoretical S = |E(a,b) - E(a,b') + E(a',b) + E(a',b')| = ${chshTheoretical.toFixed(4)}`);
console.log(`  Classical bound: S ≤ 2`);
console.log(`  Quantum maximum: S ≤ 2√2 ≈ ${(2 * Math.sqrt(2)).toFixed(4)}`);
console.log();

if (chshTheoretical > 2) {
  console.log(`  ✓ VIOLATION DETECTED! S = ${chshTheoretical.toFixed(4)} > 2`);
  console.log(`  This proves quantum entanglement and rules out local hidden variables!`);
} else {
  console.log(`  ✗ No violation: S = ${chshTheoretical.toFixed(4)} ≤ 2`);
}
console.log();

// Run empirical test with measurements
console.log('Running Empirical Bell Test (10,000 measurement trials)...');
const numTrials = 10000;
const chshEmpirical = BellTest.runEmpiricalCHSH(bellState, [a, aPrime, b, bPrime], numTrials);

console.log(`  Empirical S ≈ ${chshEmpirical.toFixed(4)}`);
console.log(`  Difference from theoretical: ${Math.abs(chshEmpirical - chshTheoretical).toFixed(4)}`);
console.log();

if (chshEmpirical > 2) {
  console.log(`  ✓ EMPIRICAL VIOLATION CONFIRMED! S = ${chshEmpirical.toFixed(4)} > 2`);
} else {
  console.log(`  Note: Due to statistical fluctuations, empirical value may vary.`);
}
console.log();

// Test with different Bell states
console.log('Testing all four Bell states:');
const bellStateTypes: Array<'phi+' | 'phi-' | 'psi+' | 'psi-'> = ['phi+', 'phi-', 'psi+', 'psi-'];
const stateNames = {
  'phi+': '|Φ+⟩ = (|00⟩ + |11⟩)/√2',
  'phi-': '|Φ-⟩ = (|00⟩ - |11⟩)/√2',
  'psi+': '|Ψ+⟩ = (|01⟩ + |10⟩)/√2',
  'psi-': '|Ψ-⟩ = (|01⟩ - |10⟩)/√2',
};

bellStateTypes.forEach(stateType => {
  const state = QuantumState.createBellState(stateType);
  const chsh = BellTest.calculateCHSH(state, [a, aPrime, b, bPrime]);
  const violation = chsh > 2 ? '✓ VIOLATES' : '✗ No violation';
  console.log(`  ${stateNames[stateType]}: S = ${chsh.toFixed(4)} ${violation}`);
});
console.log();

// Compare with separable (product) state
console.log('Comparison with separable (non-entangled) state:');
const productState = QuantumState.createProductState(
  [new Complex(1, 0), new Complex(0, 0)],
  [new Complex(1, 0), new Complex(0, 0)]
);
const chshProduct = BellTest.calculateCHSH(productState, [a, aPrime, b, bPrime]);
console.log(`  Product state |00⟩: S = ${chshProduct.toFixed(4)}`);
console.log(`  ${chshProduct > 2 ? '✓ VIOLATES' : '✗ No violation (as expected for separable states)'}`);
console.log();

console.log('='.repeat(70));
console.log('Conclusion:');
console.log('Quantum entangled states violate Bell\'s inequality, demonstrating that');
console.log('quantum mechanics cannot be explained by local hidden variable theories.');
console.log('This is one of the most profound results in quantum mechanics!');
console.log('='.repeat(70));
