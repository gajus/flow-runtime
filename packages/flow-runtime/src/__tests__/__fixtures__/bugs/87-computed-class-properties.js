/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const someMethodName = 'someName';

  function mixinFactory(Component) {
    let _ComponentType = t.function();

    t.param('Component', _ComponentType).assert(Component);

    // eslint-disable-next-line
    return @t.annotate(t.class('ComponentInTree', t.extends(Component), t.indexer('key', t.union(t.number(), t.string(), t.symbol()), t.function())))
    class ComponentInTree extends Component {
      [someMethodName]() {}
    };
  }

  t.annotate(mixinFactory, t.function(t.param('Component', t.function())));

  return mixinFactory(@t.annotate(t.class('AnonymousClass')) class {});
}
