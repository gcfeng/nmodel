export const NAMESPACE_SEP = '/';

export function prefixed (namespace, type) {
  if (!namespace || type.indexOf(`${namespace}${NAMESPACE_SEP}`) === 0) {
    return type;
  }
  return `${namespace}${NAMESPACE_SEP}${type}`;
}
