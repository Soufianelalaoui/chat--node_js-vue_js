var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('Test length', () => {
  it('There must be 5 elements in this array', () => {

    const inputArray = [0, 1, 2, 3, 4]
    assert.equal(inputArray.length, 5)
  })
});