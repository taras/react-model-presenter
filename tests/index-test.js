import "jest";
import React, { Component } from "react";
import { mount } from "enzyme";
import present, { Model } from "react-model-presenter";
import { map } from "funcadelic";
import { stubConsoleError } from "../setupTests";

describe("present function", () => {
  it("exports a function", () => {
    expect(present).toBeInstanceOf(Function);
  });

  it("throws an error when model is not specified", () => {
    expect(() => {
      present();
    }).toThrow(/present expects one argument/);
  });

  it("throws an error when first argument is not a function", () => {
    expect(() => {
      present("hello world");
    }).toThrow(
      /present expects a function as first argument, received string instead/
    );
  });
});

describe("rendering without child", () => {
  stubConsoleError();
  it("expects a children function in the class", () => {
    let Result = present(class MyClass {});

    expect(() => {
      mount(<Result />);
    }).toThrowError(/Presentation components expect a children function/);
  });
});
