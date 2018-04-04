import 'jest';
import React from 'react';
import present from 'react-model-presenter';

describe('present function', () => {
  it('exports a function', () => {
    expect(present).toBeInstanceOf(Function);
  });

  it('throws an error when model is not specified', () => {
    expect(() => {
      present();
    }).toThrow(/present expects one argument/);
  });

  it('throws an error when first argument is not a function', () => {
    expect(() => {
      present('hello world');
    }).toThrow(
      /present expects a function as first argument, received string instead/
    );
  });
});
