import getOwnPropertyDescriptors from "object.getownpropertydescriptors";
import { map, append } from "funcadelic";

const { create } = Object;

function functionToGetter(descriptor) {
  if (typeof descriptor.value === "function" && descriptor.value.length > 0) {
    return {
      get: function() {
        return descriptor.value(this);
      },
      enumerable: true
    };
  } else {
    return descriptor;
  }
}

function thunk(fn) {
  let evaluated = false;
  let result = undefined;
  return function evaluate() {
    if (evaluated) {
      return result;
    } else {
      result = fn.call(this);
      evaluated = true;
      return result;
    }
  };
}

function cacheGetters(descriptor) {
  if (descriptor.get) {
    return {
      get: thunk(descriptor.get),
      enumerable: true
    };
  } else {
    return descriptor;
  }
}

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
export default function present(Model) {
  if (arguments.length !== 1) {
    throw new Error("present expects one argument");
  }

  if (typeof Model !== "function") {
    throw new Error(
      `present expects a function as first argument, received ${typeof Model} instead`
    );
  }

  return function ModelWrapper(props) {
    let { children } = props;

    if (typeof children !== "function") {
      throw new Error("Presentation components expect a children function");
    }

    // Convert all functions that accept one argument to getters that will be cached.
    let getterFunctionsFromProps = map(
      functionToGetter,
      getOwnPropertyDescriptors(props)
    );

    // take descriptors from prototype and combine them with those created by class properties
    let ownDescriptors = append(
      getOwnPropertyDescriptors(Model.prototype),
      getOwnPropertyDescriptors(new Model())
    );

    // combine getters from model with getters from props
    let descriptors = append(ownDescriptors, getterFunctionsFromProps);

    // wrapped getters in caching
    let cached = map(cacheGetters, descriptors);

    let model = create(Model.prototype, cached);

    Object.freeze(model);

    return children(model);
  };
}
