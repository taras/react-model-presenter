import { Model } from 'react-model-presenter';

describe('create', () => {
  class Person {
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }

    get born() {
      return new Date(this.birthYear);
    }
  }
  let instance;
  beforeEach(() => {
    instance = Model.create(Person, {
      firstName: 'Taras',
      lastName: 'Mankovski',
      birthYear: '1982'
    });
  });
  it('returns instance of passed in type', () => {
    expect(instance).toMatchObject({
      firstName: 'Taras',
      lastName: 'Mankovski',
      fullName: 'Taras Mankovski'
    });
  });
  it('has stable getters', () => {
    expect(instance.born).toBe(instance.born);
  });
});
