import extend from '../../src/utils/extend';

describe('utils/extend', () => {
  it('deep copy', () => {
    expect(extend({}, { x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    expect(extend({}, null)).toEqual({});
    expect(extend(null, { x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    expect(extend({
      x: [1, 2, 3],
      y: { y1: { y2: 1 } },
    }, {
      x: [1, 2],
      y: { y1: { y2: 2, y3: 3 } },
    })).toEqual({ x: [1, 2, 3], y: { y1: { y2: 2, y3: 3 } } });
    expect(extend([], [1, 2, 3])).toEqual([1, 2, 3]);
  });
});
