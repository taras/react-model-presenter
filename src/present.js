import React, { Component } from 'react';
import omit from 'lodash.omit';
import createReactContext from 'create-react-context';

import Model from './model';
import { CacheOne } from './cache';

/**
 * `present` is a factory for HoC that build view specific models. The component
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
 * let PersonComponent = present(Person);
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

  const Context = createReactContext();

  class ModelPresenter extends Component {
    cache = new CacheOne();

    constructor(props) {
      super(props);

      this.state = {
        value: this.maybeCached(props)
      };
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
      let value = this.maybeCached(nextProps);

      if (this.state.value !== value) {
        this.setState({
          value
        });
      }
    }

    render() {
      let { value } = this.state;
      let { children } = this.props;

      return (
        <Context.Provider value={value}>
          {children.call ? children(value) : children}
        </Context.Provider>
      );
    }
  }

  ModelPresenter.displayName = `${Class.name}Presenter`;
  ModelPresenter.Consumer = Context.Consumer;

  return ModelPresenter;
}
