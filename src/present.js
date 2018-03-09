import React, { PureComponent } from "react";
import Model from "./model";
import { filter } from "funcadelic";
import isShallowEqual from "shallowequal";

const withoutChildren = props => filter(({ key }) => key !== "children", props);

/**
 * ModelWrapper is a factory for HoC that build view specific models. The component
 * that is created by this factory has the responsibility of instantiating models from
 * props that are passed to the component.
 *
 * These props become part of the model. The props provide initial values that are used by
 * getters and context specific computations that can be added when the model is instantiated.
 *
 * The models that are created by these components are immutable. Their purpose is to reduce
 * the number of repetitive computations by caching getters.
 *
 * To use this component,
 *
 * class Person {
 *
 *  get fullName() {
 *    return this.firstName + ' ' + this.lastName;
 *  }
 * }
 *
 * let PersonComponent = ModelWrapper(Person);
 *
 * <PersonComponent firstName='Taras' lastName='Mankovski'>
 *  {model => (
 *    <span>model.fullName</span>
 *  )}
 * </PersonComponent>
 */
export default function present(Type) {
  if (arguments.length !== 1) {
    throw new Error("present expects one argument");
  }

  if (typeof Type !== "function") {
    throw new Error(
      `present expects a function as first argument, received ${typeof Type} instead`
    );
  }

  class ModelPresenter extends PureComponent {
    constructor(props) {
      super(props);

      if (typeof props.children !== "function") {
        throw new Error("Presentation components expect a children function");
      }

      this.model = this.createModel(props);
    }

    createModel(props) {
      let model = Model.create(Type, withoutChildren(props));
      Object.freeze(model);
      return model;
    }

    componentWillReceiveProps(nextProps) {
      if (
        !isShallowEqual(withoutChildren(this.props), withoutChildren(nextProps))
      ) {
        this.model = this.createModel(nextProps);
      }
    }

    render() {
      return this.props.children(this.model);
    }
  }

  ModelPresenter.displayName = `${Type.name}Presenter`;

  return ModelPresenter;
}
