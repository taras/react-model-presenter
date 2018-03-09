import 'jest';

import React from 'react';
import { mount } from 'enzyme';
import present, { Model } from 'react-model-presenter';

it('allows to map getters with funcadelic map', () => {
  class Input extends Model {
    get big() {
      return this.data;
    }

    get data() {
      return 'data';
    }

    get value() {
      return this.text;
    }
  }

  class Box {
    get a() {
      return new Input({ text: 'a' });
    }

    get capitalA() {
      let { a } = this;
      return Model.map((value, key) => () => a[key].toUpperCase(), a);
    }
  }

  let Presenter = present(Box);
  mount(
    <Presenter>
      {box => {
        expect(box.capitalA).toBeInstanceOf(Input);
        expect(box.capitalA.value).toBe('A');
        expect(box.capitalA.big).toBe('DATA');
        return null;
      }}
    </Presenter>
  );
});

it('allows to map getters with Model.map', () => {
  class Input extends Model {
    get big() {
      return this.data;
    }

    get data() {
      return 'data';
    }

    get value() {
      return this.text;
    }
  }

  class Box {
    get a() {
      return new Input({ text: 'a' });
    }

    get capitalA() {
      let { a } = this;
      return Model.map((value, key) => () => a[key].toUpperCase(), a);
    }
  }

  let Presenter = present(Box);

  mount(
    <Presenter>
      {box => {
        expect(box.capitalA).toBeInstanceOf(Input);
        expect(box.capitalA.value).toBe('A');
        expect(box.capitalA.big).toBe('DATA');
        return null;
      }}
    </Presenter>
  );
});
