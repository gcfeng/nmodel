function isObject(val: any) {
  return val !== null && typeof val === 'object' && Array.isArray(val) === false;
}

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export default function isPlainObject(obj: any) {
  if (!isObject(obj)) return false;

  // Modified the constructor
  const ctor = obj.constructor;
  if (typeof ctor !== 'function') return false;

  // Modified the prototype
  const prot = ctor.prototype;
  if (!isObject(prot)) return false;

  return prot.hasOwnProperty('isPrototypeOf');
}
