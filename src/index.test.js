import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Simulate } from "react-dom/test-utils";
import present, { Model } from "react-model-presenter";
import { map } from "funcadelic";

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

class MyClass {}

describe("presenter component", function() {
  it("returns a function", () => {
    let result = present(MyClass);
    expect(result).toBeInstanceOf(Function);
  });

  it("expects a children function in the class", () => {
    let Result = present(MyClass);
    let div = document.createElement("div");

    class ErrorCatcher extends Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      componentDidCatch(error, info) {
        this.setState({ error });
      }
      render() {
        if (this.state.error) {
          return this.state.error.message;
        }
        return this.props.children;
      }
    }

    ReactDOM.render(
      <ErrorCatcher>
        <Result />
      </ErrorCatcher>,
      div
    );

    expect(div.textContent).toEqual(
      "Presentation components expect a children function"
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("re-renders children without reinstantiating model", () => {
    let Presenter = present(Bird);
    let div = document.createElement("div");

    let instances = [];

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

    let button;

    ReactDOM.render(
      <Stateful>
        {({ number, increment }) => (
          <Presenter color="yellow">
            {bird => {
              instances = [...instances, bird];
              return (
                <button onClick={increment} ref={node => (button = node)}>
                  Increment ({number})
                </button>
              );
            }}
          </Presenter>
        )}
      </Stateful>,
      div
    );

    expect(instances).toHaveLength(1);

    expect(button.textContent).toBe("Increment (0)");

    Simulate.click(button);

    expect(button.textContent).toBe("Increment (1)");

    expect(instances[0]).toBe(instances[1]);

    ReactDOM.unmountComponentAtNode(div);
  });

  it("sends an instance of MyClass to children function", () => {
    let Result = present(MyClass);
    let child = jest.fn().mockImplementation(() => null);

    let div = document.createElement("div");

    ReactDOM.render(<Result>{child}</Result>, div);

    expect(child.mock.calls.length).toEqual(1);
    expect(child.mock.calls[0][0]).toBeInstanceOf(MyClass);

    ReactDOM.unmountComponentAtNode(div);
  });

  it("passes its properties to the MyClass instance", () => {
    let Result = present(MyClass);

    let div = document.createElement("div");

    ReactDOM.render(
      <Result foo="bar">
        {instance => {
          expect(instance).toMatchObject({ foo: "bar" });
          return null;
        }}
      </Result>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  class Person {
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }

  describe("getter support", () => {
    it("allows getters to access passed in properties", () => {
      let Presenter = present(Person);
      let div = document.createElement("div");

      ReactDOM.render(
        <Presenter firstName="Najwa" lastName="Azer">
          {person => {
            expect(person.fullName).toEqual("Najwa Azer");
            return null;
          }}
        </Presenter>,
        div
      );

      ReactDOM.unmountComponentAtNode(div);
    });

    it("excludes children", () => {
      let Presenter = present(Person);
      let div = document.createElement("div");

      ReactDOM.render(
        <Presenter firstName="Najwa" lastName="Azer">
          {person => {
            expect(person.children).not.toBeDefined();
            return null;
          }}
        </Presenter>,
        div
      );

      ReactDOM.unmountComponentAtNode(div);
    });

    it("caches computation result", () => {
      let fn = jest.fn().mockImplementation(() => null);

      class Person {
        get formattedName() {
          return fn();
        }
      }

      let Result = present(Person);

      let div = document.createElement("div");

      ReactDOM.render(
        <Result>
          {person => {
            person.formattedName;
            person.formattedName;
            return null;
          }}
        </Result>,
        div
      );

      expect(fn.mock.calls.length).toEqual(1);

      ReactDOM.unmountComponentAtNode(div);
    });

    it("maintains scope of cached getter", () => {
      let fn = jest.fn().mockImplementation(() => null);

      class Person {
        get formattedName() {
          return fn(this);
        }
      }

      let Result = present(Person);

      let div = document.createElement("div");

      ReactDOM.render(
        <Result>
          {person => {
            person.formattedName;
            expect(fn.mock.calls[0][0]).toBe(person);

            return null;
          }}
        </Result>,
        div
      );

      ReactDOM.unmountComponentAtNode(div);
    });
  });

  class Bird {
    color = "blue";
  }

  describe("default values", () => {
    it("passes default property values to the instance", () => {
      let Presenter = present(Bird);
      let div = document.createElement("div");

      ReactDOM.render(
        <Presenter>
          {bird => {
            expect(bird.color).toEqual("blue");
            return null;
          }}
        </Presenter>,
        div
      );

      ReactDOM.unmountComponentAtNode(div);
    });
  });

  it("does not re-instantiate the model when children change", () => {
    let Presenter = present(Bird);
    let div = document.createElement("div");
  });
});

describe("mapping", () => {
  it("allows to map getters with funcadelic map", () => {
    class Input extends Model {
      get big() {
        return this.data;
      }

      get data() {
        return "data";
      }

      get value() {
        return this.text;
      }
    }

    class Box {
      get a() {
        return new Input({ text: "a" });
      }

      get capitalA() {
        let { a } = this;
        return Model.map((value, key) => () => a[key].toUpperCase(), a);
      }
    }

    let Presenter = present(Box);
    let div = document.createElement("div");

    ReactDOM.render(
      <Presenter>
        {box => {
          expect(box.capitalA).toBeInstanceOf(Input);
          expect(box.capitalA.value).toBe("A");
          expect(box.capitalA.big).toBe("DATA");
          return null;
        }}
      </Presenter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("allows to map getters with Model.map", () => {
    class Input extends Model {
      get big() {
        return this.data;
      }

      get data() {
        return "data";
      }

      get value() {
        return this.text;
      }
    }

    class Box {
      get a() {
        return new Input({ text: "a" });
      }

      get capitalA() {
        let { a } = this;
        return Model.map((value, key) => () => a[key].toUpperCase(), a);
      }
    }

    let Presenter = present(Box);
    let div = document.createElement("div");

    ReactDOM.render(
      <Presenter>
        {box => {
          expect(box.capitalA).toBeInstanceOf(Input);
          expect(box.capitalA.value).toBe("A");
          expect(box.capitalA.big).toBe("DATA");
          return null;
        }}
      </Presenter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });
});
