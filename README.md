# react-model-presenter

Write declarative render functions with cached models!

JSX is awesome because it allows you to pass results on JavaScript expressions your components. 
This works well when you have a few expressions and you only use them in one place. As your application grows,
you'll likely need to reuse the result of a computation or use several computations to create derived state. 

You can assign your expressions to variables at the top of the render function. Overtime this can add up to many calculations
at the top of your render function. If you're not careful, this can add up to a performance problem. Take a look at the following,
example.

```js
class FilteredProducts extends React.Component {
  render() {
    let { user, products } = this.props;
    return <ProductsList products={products.filter(product => product.user === user)} />;
  }
}
```

This component looks simple, but it's hiding a subtle performance problem. The `ProductsList` component will re-render everytime that
the render function is called. The `ProductsList` component will re-render because `products.filter(product => product.user === user)` returns a new array
every time that it's executed. 

Ideally, there would be a way to represent the result of this calculation such that it'd only recompute when `user` or `products` changed. Otherwise,
it should return the same array as previously calculated. This kind of caching is what `react-model-presenter` is designed for.

