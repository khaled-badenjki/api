import { sum } from '../../../src/utils/sum';
const expect = require('chai').expect;

console.log(sum(1, 2));

describe('testing sum function', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).to.be.equal(3);
  });
});
