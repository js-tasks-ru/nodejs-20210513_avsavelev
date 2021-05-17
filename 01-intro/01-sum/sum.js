function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else {
    throw new TypeError('a and b should be numbers');
  }
}

module.exports = sum;
