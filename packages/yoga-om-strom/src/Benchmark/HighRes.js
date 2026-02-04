export const nowMs = () => {
  if (typeof globalThis !== "undefined") {
    const perf = globalThis.performance;
    if (perf && typeof perf.now === "function") {
      return perf.now();
    }
  }
  return Date.now();
};
