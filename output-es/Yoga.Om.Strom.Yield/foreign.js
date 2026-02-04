// Fast async yield using microtask queue instead of timer queue
// Much faster than setTimeout(fn, 0) used by delay

export const yieldAff = () => Promise.resolve();
