import getOwnPropertyDescriptors from "object.getownpropertydescriptors";
import { append, filter } from "funcadelic";
import isSymbol from "is-symbol";

const { getPrototypeOf } = Object;

export function getPrototypeDescriptors(Class) {
  let prototype = getPrototypeOf(Class);
  if (prototype && prototype !== getPrototypeOf(Object)) {
    return append(
      getPrototypeDescriptors(prototype),
      getOwnPropertyDescriptors(Class.prototype)
    );
  } else {
    return getOwnPropertyDescriptors(Class.prototype);
  }
}

export default function getDescriptors(instance) {
  let descriptors = append(
    getPrototypeDescriptors(instance.constructor),
    getOwnPropertyDescriptors(instance)
  );
  return filter(({ key }) => !isSymbol(key), descriptors);
}
