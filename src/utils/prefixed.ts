export const NAMESPACE_SEP = '/';

export function prefixed(namespace: string, type: string) {
  if (!namespace || type.indexOf(`${namespace}${NAMESPACE_SEP}`) === 0) {
    return type;
  }

  return `${namespace}${NAMESPACE_SEP}${type}`;
}
