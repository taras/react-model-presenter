import { map, append, filter } from "funcadelic";
import getOwnPropertyDescriptors from "object.getownpropertydescriptors";
import isSymbol from "is-symbol";
import getPrototypeDescriptors from "./get-prototype-descriptors";

const { create, getPrototypeOf } = Object;

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
    let propsDescriptors = getOwnPropertyDescriptors(props);

    // take descriptors from prototype and combine them with those created by class properties
    let instanceDescriptors = getOwnPropertyDescriptors(new Type());

    let prototypeDescriptors = filter(
      ({ key }) => !isSymbol(key),
      getPrototypeDescriptors(Type)
    );

    let ownDescriptors = append(instanceDescriptors, prototypeDescriptors);

    // combine getters from model with getters from props
    let descriptors = append(ownDescriptors, propsDescriptors);

    // wrapped getters in caching
    let cached = map(cacheGetters, descriptors);

    return create(Type.prototype, cached);
  }
}
