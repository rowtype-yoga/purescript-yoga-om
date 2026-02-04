import * as Om from '../../output-es/Yoga.Om/index.js';
import * as Strom from '../../output-es/Yoga.Om.Strom/index.js';

console.log('Testing optimized mergeND...');
const start = Date.now();

const s1 = Strom.rangeStrom(1)(1000001);
const s2 = Strom.rangeStrom(1000001)(2000001);
const merged = Strom.mergeND(s1)(s2);

try {
  await Om.runOm({})({ exception: e => { throw e; } })(Strom.runDrain(merged))();
  const elapsed = Date.now() - start;
  console.log(`mergeND 2x1M completed in ${elapsed}ms`);
} catch(e) {
  console.error('Error:', e);
}
