export const shrinkImpl = keys => record => {
  return keys.reduce((acc, key) => {
    acc[key] = record[key];
    return acc;
  }, {});
}
