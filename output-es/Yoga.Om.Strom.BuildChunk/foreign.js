// Fast imperative loop to build array chunks
export const buildChunkImpl = (f) => (initial) => (size) => {
  const arr = new Array(size);
  let val = initial;
  for (let i = 0; i < size; i++) {
    arr[i] = val;
    val = f(val);
  }
  return { arr, nextVal: val };
};
