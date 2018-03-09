import isPlainObject from '../../src/utils/isPlainObject';

describe('utils/isPlainObject', () => {
  it('returns true only if plain object', () => {
    function Test () {
      this.prop = 1;
    }

    expect(isPlainObject(new Test())).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject([1, 2, 4, 3])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject()).toBe(false);
    expect(isPlainObject({ x: 1, y: 2 })).toBe(true);
  });
});
