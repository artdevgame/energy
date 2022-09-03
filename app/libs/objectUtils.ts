export const sortObjectByKeys = (obj: Record<string, unknown>, reverse = false) => {
  const sorted = Object.keys(obj).sort()
  const ordered = reverse ? sorted.reverse() : sorted;

  return ordered.reduce((o, k) => {
    o[k] = obj[k];
    return o;
  }, {} as Record<string, unknown>)
}