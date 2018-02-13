import { append, Functor, foldr } from "funcadelic";
import Model from "./model";
import getPrototypeDescriptors from "./get-prototype-descriptors";
import getOwnPropertyDescriptors from "object.getownpropertydescriptors";

const { create, getPrototypeOf } = Object;

Functor.instance(Model, {
  map(fn, instance) {
    let prototype = getPrototypeOf(instance);

    let properties = foldr(
      function(properties, entry) {
        let descriptor = entry.value;
        let { key } = entry;

        if (!!descriptor.get) {
          return append(properties, {
            [key]: {
              enumerable: descriptor.enumerable,
              get() {
                return fn(descriptor.get.apply(instance), key);
              }
            }
          });
        }

        return append(properties, {
          [key]: {
            enumerable: descriptor.enumerable,
            get() {
              return fn(descriptor.value, key);
            }
          }
        });
      },
      {},
      getPrototypeDescriptors(instance.constructor)
    );

    return Object.create(prototype, properties);
  }
});
