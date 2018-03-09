import "jest";
import React, { Component } from "react";
import { mount } from "enzyme";
import present, { Model } from "react-model-presenter";
import { stubConsoleError } from "../setupTests";

class Bird {
  color = "blue";
}

class MyClass {}

it("returns a function", () => {
  expect(present(MyClass)).toBeInstanceOf(Function);
});

it("re-renders children without reinstantiating model", () => {
  let Presenter = present(Bird);

  class Stateful extends Component {
    constructor(props) {
      super(props);

      this.state = {
        number: 0
      };
    }

    increment = () =>
      this.setState({
        number: this.state.number + 1
      });

    render() {
      return this.props.children({
        number: this.state.number,
        increment: this.increment
      });
    }
  }

  let instances = [];

  let mounted = mount(
    <Stateful>
      {({ number, increment }) => (
        <Presenter color="yellow">
          {bird => {
            instances = [...instances, bird];
            return <button onClick={increment}>Increment ({number})</button>;
          }}
        </Presenter>
      )}
    </Stateful>
  );

  expect(instances).toHaveLength(1);

  let button = mounted.find("button");

  expect(button.text()).toBe("Increment (0)");

  mounted.find("button").simulate("click");

  expect(button.text()).toBe("Increment (1)");

  expect(instances[0]).toBe(instances[1]);
});

it("sends an instance of MyClass to children function", () => {
  let Result = present(MyClass);
  let child = jest.fn().mockImplementation(() => null);

  mount(<Result>{child}</Result>);

  expect(child.mock.calls.length).toEqual(1);
  expect(child.mock.calls[0][0]).toBeInstanceOf(MyClass);
});

it("passes its properties to the MyClass instance", () => {
  let Result = present(MyClass);

  mount(
    <Result foo="bar">
      {instance => {
        expect(instance).toMatchObject({ foo: "bar" });
        return null;
      }}
    </Result>
  );
});

class Person {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

describe("getter support", () => {
  it("allows getters to access passed in properties", () => {
    let Presenter = present(Person);

    mount(
      <Presenter firstName="Najwa" lastName="Azer">
        {person => {
          expect(person.fullName).toEqual("Najwa Azer");
          return null;
        }}
      </Presenter>
    );
  });

  it("excludes children", () => {
    let Presenter = present(Person);

    mount(
      <Presenter firstName="Najwa" lastName="Azer">
        {person => {
          expect(person.children).not.toBeDefined();
          return null;
        }}
      </Presenter>
    );
  });

  it("caches computation result", () => {
    let fn = jest.fn().mockImplementation(() => null);

    class Person {
      get formattedName() {
        return fn();
      }
    }

    let Result = present(Person);

    mount(
      <Result>
        {person => {
          person.formattedName;
          person.formattedName;
          return null;
        }}
      </Result>
    );

    expect(fn.mock.calls.length).toEqual(1);
  });

  it("maintains scope of cached getter", () => {
    let fn = jest.fn().mockImplementation(() => null);

    class Person {
      get formattedName() {
        return fn(this);
      }
    }

    let Result = present(Person);

    mount(
      <Result>
        {person => {
          person.formattedName;
          expect(fn.mock.calls[0][0]).toBe(person);

          return null;
        }}
      </Result>
    );
  });
});

it("passes default property values to the instance", () => {
  let Presenter = present(Bird);
  mount(
    <Presenter>
      {bird => {
        expect(bird.color).toEqual("blue");
        return null;
      }}
    </Presenter>
  );
});
