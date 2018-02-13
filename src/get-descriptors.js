import getOwnPropertyDescriptors from "object.getownpropertydescriptors";
import { append } from "funcadelic";

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
  return append(
    getPrototypeDescriptors(instance.constructor),
    getOwnPropertyDescriptors(instance)
  );
}
