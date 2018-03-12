import isShallowEqual from 'shallowequal';

export default class Cache {
  getKey = ({ id }) => id;

  constructor(getKey) {
    if (getKey) {
      this.getKey = getKey;
    }
  }

  props = new Map();
  values = new Map();

  for(props) {
    let key = this.getKey(props);
    if (key && this.props.has(key)) {
      if (isShallowEqual(this.props.get(key), props)) {
        return this.values.get(key);
      }
    }
  }

  set(props, value) {
    let key = this.getKey(props);
    if (key) {
      this.props.set(key, props);
      this.values.set(key, value);
    }
  }
}

export class CacheOne {
  for(props) {
    if (isShallowEqual(this.props, props)) {
      return this.value;
    }
  }
  set(props, value) {
    this.props = props;
    this.value = value;
  }
}
