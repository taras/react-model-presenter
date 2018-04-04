import memoize from 'fast-memoize';
import getPrototypeDescriptors from './get-prototype-descriptors';
import { append } from 'funcadelic';

function createTemplateInstance(Class) {
  // create object that owns all descriptors
  let prototype = Object.create(
    Class.prototype,
    getPrototypeDescriptors(Class)
  );
  // allow constructors to be called for this class to capture field properties
  let instance = new Class();
  return append(prototype, instance);
}

export default memoize(createTemplateInstance, {
  serializer: Class => Class.name
});
