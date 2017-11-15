/* @flow */

export const input = `

type IteratorResult<Yield,Return> =
  | { done: true, value?: Return }
  | { done: false, value: Yield };

interface $Iterator<+Yield,+Return,-Next> {
    next(value?: Next): IteratorResult<Yield,Return>;
}
type Iterator<+T> = $Iterator<T,void,void>;

interface $Iterable<+Yield,+Return,-Next> {
}
type Iterable<+T> = $Iterable<T,void,void>;

declare class Promise<+R> {
    constructor(callback: (
      resolve: (result: Promise<R> | R) => void,
      reject:  (error: any) => void
    ) => mixed): void;

    then<U>(
      onFulfill?: (value: R) => Promise<U> | U,
      onReject?: (error: any) => Promise<U> | U
    ): Promise<U>;

    catch<U>(
      onReject?: (error: any) => Promise<U> | U
    ): Promise<R | U>;

    static resolve<T>(object: Promise<T> | T): Promise<T>;
    static reject<T>(error?: any): Promise<T>;
    static all<T: Iterable<mixed>>(promises: T): Promise<$TupleMap<T, typeof $await>>;
    static race<T, Elem: Promise<T> | T>(promises: Array<Elem>): Promise<T>;
}

// we use this signature when typing await expressions
declare function $await<T>(p: Promise<T> | T): T;


`;

export const expected = `
  import t from "flow-runtime";
  const IteratorResult = t.type("IteratorResult", IteratorResult => {
    const Yield = IteratorResult.typeParameter("Yield"),
          Return = IteratorResult.typeParameter("Return");
    return t.union(t.object(t.property("done", t.boolean(true)), t.property("value", Return, true)), t.object(t.property("done", t.boolean(false)), t.property("value", Yield)));
  });
  const $Iterator = t.type("$Iterator", $Iterator => {
    const Yield = $Iterator.typeParameter("Yield"),
          Return = $Iterator.typeParameter("Return"),
          Next = $Iterator.typeParameter("Next");
    return t.object(t.property("next", t.function(t.param("value", Next, true), t.return(t.ref(IteratorResult, Yield, Return)))));
  });
  const Iterator = t.type("Iterator", Iterator => {
    const T = Iterator.typeParameter("T");
    return t.ref($Iterator, T, t.void(), t.void());
  });
  const $Iterable = t.type("$Iterable", $Iterable => {
    const Yield = $Iterable.typeParameter("Yield"),
          Return = $Iterable.typeParameter("Return"),
          Next = $Iterable.typeParameter("Next");
    return t.object();
  });
  const Iterable = t.type("Iterable", Iterable => {
    const T = Iterable.typeParameter("T");
    return t.ref($Iterable, T, t.void(), t.void());
  });
  t.declare(t.class("Promise", _Promise => {
    const R = _Promise.typeParameter("R");

    return [t.object(t.property("constructor", t.function(t.param("callback", t.function(t.param("resolve", t.function(t.param("result", t.union(t.ref("Promise", R), R)), t.return(t.void()))), t.param("reject", t.function(t.param("error", t.any()), t.return(t.void()))), t.return(t.mixed()))), t.return(t.void()))), t.property("then", t.function(_fn => {
      const U = _fn.typeParameter("U");

      return [t.param("onFulfill", t.function(t.param("value", R), t.return(t.union(t.ref("Promise", U), U))), true), t.param("onReject", t.function(t.param("error", t.any()), t.return(t.union(t.ref("Promise", U), U))), true), t.return(t.ref("Promise", U))];
    })), t.property("catch", t.function(_fn2 => {
      const U = _fn2.typeParameter("U");

      return [t.param("onReject", t.function(t.param("error", t.any()), t.return(t.union(t.ref("Promise", U), U))), true), t.return(t.ref("Promise", t.union(R, U)))];
    })), t.staticProperty("resolve", t.function(_fn3 => {
      const T = _fn3.typeParameter("T");

      return [t.param("object", t.union(t.ref("Promise", T), T)), t.return(t.ref("Promise", T))];
    })), t.staticProperty("reject", t.function(_fn4 => {
      const T = _fn4.typeParameter("T");

      return [t.param("error", t.any(), true), t.return(t.ref("Promise", T))];
    })), t.staticProperty("all", t.function(_fn5 => {
      const T = _fn5.typeParameter("T", t.ref(Iterable, t.mixed()));

      return [t.param("promises", T), t.return(t.ref("Promise", t.$tupleMap(T, t.ref("$await"))))];
    })), t.staticProperty("race", t.function(_fn6 => {
      const T = _fn6.typeParameter("T"),
            Elem = _fn6.typeParameter("Elem", t.union(t.ref("Promise", T), T));

      return [t.param("promises", t.array(Elem)), t.return(t.ref("Promise", T))];
    })))];
  }));

  // we use this signature when typing await expressions

  t.declare("$await", t.function(_fn7 => {
    const T = _fn7.typeParameter("T");

    return [t.param("p", t.union(t.ref("Promise", T), T)), t.return(T)];
  }));
`;