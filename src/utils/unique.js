
//去除重复
export function unique(arr, key) {
  if (!arr) return arr;
  if (!key) return [...new Set(arr)];
  const map = {
    string: (e) => e[key],
    function: (e) => key(e),
  };
  const fn = map[typeof key];
  const obj = arr.reduce((o, e) => ((o[fn(e)] = e), o), {});
  return Object.values(obj);
}
