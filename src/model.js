import { map, append } from "funcadelic";
import getOwnPropertyDescriptors from "object.getownpropertydescriptors";
import getDescriptors from "./get-descriptors";

const { create, getPrototypeOf } = Object;

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

export default class Model {
  constructor(props = {}) {
    Object.assign(this, props);
  }
  static create(Type, props) {
    // Convert all functions that accept one argument to getters that will be cached.
    let getterFunctionsFromProps = map(
      functionToGetter,
      getOwnPropertyDescriptors(props)
    );

    // take descriptors from prototype and combine them with those created by class properties
    let ownDescriptors = getDescriptors(new Type());

    // combine getters from model with getters from props
    let descriptors = append(ownDescriptors, getterFunctionsFromProps);

    // wrapped getters in caching
    let cached = map(cacheGetters, descriptors);

    return create(Type.prototype, cached);
  }
}
