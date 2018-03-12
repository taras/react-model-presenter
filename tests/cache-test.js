import 'jest';
import React from 'react';
import { mount } from 'enzyme';

import present, { Cache } from 'react-model-presenter';

class ColorModel {}

let Color = present(ColorModel);

describe('cache', () => {
  let cache, mounted;

  let colors = [
    { name: 'red', hex: '#FF0000' },
    { name: 'yellow', hex: '#FFFF00' },
    { name: 'black', hex: '#000000' }
  ];

  beforeEach(() => {
    cache = new Cache(({ name }) => name);

    mounted = mount(
      <ul>
        {colors.map(c => (
          <li key={c.name}>
            <Color cache={cache} name={c.name} hex={c.hex}>
              {color => color.name}
            </Color>
          </li>
        ))}
      </ul>
    );
  });

  it('renders every item', () => {
    expect(mounted.exists('li:contains(red)')).toBe(true);
    expect(mounted.exists('li:contains(yellow)')).toBe(true);
    expect(mounted.exists('li:contains(blue)')).toBe(true);
  });
});
