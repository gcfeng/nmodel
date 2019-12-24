import isPlainObject from './isPlainObject';

/**
 * Deep copy
 */
export default function extend(...args: any[]) {
  let target = args[0] || {};
  if (typeof target !== 'object') {
    target = {};
  }
  for (let i = 1, size = args.length; i < size; i += 1) {
    const options = args[i];
    if (!options) continue;
    Object.keys(options).forEach(name => {
      const src = target[name];
      const copy = options[name];
      const copyIsArray = Array.isArray(copy);
      if (target === copy) return;
      if (copy && (isPlainObject(copy) || copyIsArray)) {
        let clone;
        if (copyIsArray) {
          clone = src && Array.isArray(src) ? src : [];
        } else {
          clone = src && isPlainObject(src) ? src : {};
        }
        target[name] = extend(clone, copy);
      } else if (copy !== undefined) {
        target[name] = copy;
      }
    });
  }
  return target;
}
