import 'jest';
import template from '../../src/utils/template';

class Foo {}
class Bar {}

it('returns instance of class', () => {
  expect(template(Foo)).toBeInstanceOf(Foo);
  expect(template(Bar)).toBeInstanceOf(Bar);
});

it('caches result', () => {
  expect(template(Foo)).toBe(template(Foo));
  expect(template(Bar)).toBe(template(Bar));
});

it('returns different object for each type', () => {
  expect(template(Foo)).not.toBe(template(Bar));
});
