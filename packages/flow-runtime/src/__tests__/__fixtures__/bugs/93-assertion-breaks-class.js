/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {

  t.declare(t.class('HTMLElement', t.object()));

  @t.annotate(
    t.class(
      "Component",
      t.property("el", t.nullable(t.ref("HTMLElement"))),
      t.staticProperty("selectors", t.array(t.string())),
      t.method("constructor", t.param("el", t.nullable(t.ref("HTMLElement")))),
      t.method("init", t.param("el", t.ref("HTMLElement")))
    )
  )
  class Component {
    el: *;
    @t.decorate(t.array(t.string()))
    static selectors = [];

    constructor(el) {
      let _elType = t.nullable(t.ref("HTMLElement"));

      t.param("el", _elType).assert(el);
    }

    init(el) {
      let _elType2 = t.ref("HTMLElement");

      t.param("el", _elType2).assert(el);

      this.el = el;
    }
  }

  @t.annotate(
    t.class(
      "About",
      t.extends(Component),
      t.staticProperty("selectors", t.array(t.string())),
      t.method("init", t.param("el", t.ref("HTMLElement")))
    )
  )
  class About extends Component {
    @t.decorate(t.array(t.string()))
    static selectors = [".section.about"];

    init(el: *) {
      let _elType3 = t.ref("HTMLElement");

      t.param("el", _elType3).assert(el);

      super.init(el);
      // do something
    }
  }

  return new About();
}


export function fail (t: TypeContext) {
  
  t.declare(t.class("HTMLElement", t.object()));

  @t.annotate(t.class("Component", t.property("el", t.nullable(t.ref("HTMLElement"))), t.staticProperty("selectors", t.array(t.string())), t.method("constructor", t.param("el", t.nullable(t.ref("HTMLElement")))), t.method("init", t.param("el", t.ref("HTMLElement")))))
  class Component {
    el: *;
    @t.decorate(t.array(t.string()))
    static selectors = [];

    constructor(el) {
      let _elType = t.nullable(t.ref("HTMLElement"));

      t.param("el", _elType).assert(el);
    }

    init(el) {
      let _elType2 = t.ref("HTMLElement");

      t.param("el", _elType2).assert(el);

      this.el = el;
    }
  }

  @t.annotate(t.class("About", t.extends(Component), t.staticProperty("selectors", t.array(t.string())), t.method("init", t.param("el", t.ref("HTMLElement")))))
  class About extends Component {
    @t.decorate(t.array(t.string()))
    static selectors = [".section.about"];

    init(el: *) {
      let _elType3 = t.ref("HTMLElement");

      t.param("el", _elType3).assert(el);

      super.init(el);
      // do something
    }
  }

  return new About(false);
}