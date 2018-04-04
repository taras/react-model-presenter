import { Component } from 'react';
import omit from 'lodash.omit';

import Model from './model';
import { CacheOne } from './cache';

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
export default function present(Class) {
  if (arguments.length !== 1) {
    throw new Error('present expects one argument');
  }

  if (typeof Class !== 'function') {
    throw new Error(
      `present expects a function as first argument, received ${typeof Class} instead`
    );
  }

  class ModelPresenter extends Component {
    cache = new CacheOne();

    constructor(props) {
      super(props);

      if (typeof props.children !== 'function') {
        throw new Error('Presentation components expect a children function');
      }

      this.model = this.maybeCached(props);
    }

    fromCache(cache, props) {
      let cached = cache.for(props);
      if (cached) {
        return cached;
      } else {
        let instance = Model.create(Class, props);
        cache.set(props, instance);
        return instance;
      }
    }

    maybeCached(props) {
      let { cache = this.cache } = props;
      return this.fromCache(cache, omit(props, ['cache', 'children']));
    }

    componentWillReceiveProps(nextProps) {
      this.model = this.maybeCached(nextProps);
    }

    render() {
      return this.props.children(this.model);
    }
  }

  ModelPresenter.displayName = `${Class.name}Presenter`;

  return ModelPresenter;
}
