import { append } from 'funcadelic';

import template from './utils/template';

export default class Model {
  static create(Class, properties) {
    return append(template(Class), properties);
  }
}
