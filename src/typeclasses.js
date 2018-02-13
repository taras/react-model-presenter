import { append, Functor, foldr } from "funcadelic";
import Model from "./model";
import getDescriptors from "./get-descriptors";

const { create, getPrototypeOf } = Object;

Functor.instance(Model, {
  map(fn, instance) {
    let properties = foldr(
      function(properties, entry) {
        let descriptor = entry.value;
        let { key } = entry;

        if (!!descriptor.get) {
          return append(properties, {
            [key]: {
              enumerable: descriptor.enumerable,
              get() {
                return fn(descriptor.get.apply(this), key);
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
      getDescriptors(instance)
    );

    let prototype = getPrototypeOf(instance);

    return Object.create(prototype, properties);
  }
});
