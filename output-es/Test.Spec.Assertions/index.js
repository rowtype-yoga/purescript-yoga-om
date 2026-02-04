import * as $runtime from "../runtime.js";
import * as Control$dMonad$dError$dClass from "../Control.Monad.Error.Class/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import {unsafeStringify} from "./foreign.js";
const AnyShow = x => x;
const showAnyShow = {show: unsafeStringify};
const newtypeAnyShow = {Coercible0: () => {}};
const eqAnyShow = dictEq => dictEq;
const fail = dictMonadThrow => x => dictMonadThrow.throwError(Effect$dException.error(x));
const shouldContain = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return dictShow => dictEq => dictShow1 => dictFoldable => {
    const any1 = dictFoldable.foldMap((() => {
      const semigroupDisj1 = {append: v => v1 => v || v1};
      return {mempty: false, Semigroup0: () => semigroupDisj1};
    })());
    return c => e => {
      const $1 = dictMonadThrow.throwError(Effect$dException.error(dictShow.show(e) + " ∉ " + dictShow1.show(c)));
      if (!any1(dictEq.eq(e))(c)) { return $1; }
      return $0.pure();
    };
  };
};
const shouldEqual = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return dictShow => dictEq => v1 => v2 => {
    const $1 = dictMonadThrow.throwError(Effect$dException.error(dictShow.show(v1) + " ≠ " + dictShow.show(v2)));
    if (!dictEq.eq(v1)(v2)) { return $1; }
    return $0.pure();
  };
};
const shouldReturn = dictMonadThrow => {
  const shouldEqual1 = shouldEqual(dictMonadThrow);
  return dictEq => dictShow => {
    const shouldEqual2 = shouldEqual1(dictShow)(dictEq);
    return ft => t => dictMonadThrow.Monad0().Bind1().bind(ft)(v => shouldEqual2(v)(t));
  };
};
const shouldNotContain = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return dictShow => dictEq => dictShow1 => dictFoldable => {
    const any1 = dictFoldable.foldMap((() => {
      const semigroupDisj1 = {append: v => v1 => v || v1};
      return {mempty: false, Semigroup0: () => semigroupDisj1};
    })());
    return c => e => {
      const $1 = dictMonadThrow.throwError(Effect$dException.error(dictShow.show(e) + " ∈ " + dictShow1.show(c)));
      if (any1(dictEq.eq(e))(c)) { return $1; }
      return $0.pure();
    };
  };
};
const shouldNotEqual = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return dictShow => dictEq => v1 => v2 => {
    const $1 = dictMonadThrow.throwError(Effect$dException.error(dictShow.show(v1) + " = " + dictShow.show(v2)));
    if (dictEq.eq(v1)(v2)) { return $1; }
    return $0.pure();
  };
};
const shouldNotReturn = dictMonadThrow => {
  const shouldNotEqual1 = shouldNotEqual(dictMonadThrow);
  return dictEq => dictShow => {
    const shouldNotEqual2 = shouldNotEqual1(dictShow)(dictEq);
    return ft => t => dictMonadThrow.Monad0().Bind1().bind(ft)(v => shouldNotEqual2(v)(t));
  };
};
const shouldNotSatisfy = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return dictShow => v => pred => {
    const $1 = dictMonadThrow.throwError(Effect$dException.error(dictShow.show(v) + " satisfies predicate, but should not"));
    if (pred(v)) { return $1; }
    return $0.pure();
  };
};
const shouldSatisfy = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return dictShow => v => pred => {
    const $1 = pred(v);
    const $2 = dictMonadThrow.throwError(Effect$dException.error(dictShow.show(v) + " doesn't satisfy predicate"));
    if (!$1) { return $2; }
    if ($1) { return $0.pure(); }
    $runtime.fail();
  };
};
const expectError = dictMonadError => {
  const MonadThrow0 = dictMonadError.MonadThrow0();
  const Monad0 = MonadThrow0.Monad0();
  const $$try = Control$dMonad$dError$dClass.try(dictMonadError);
  return a => Monad0.Bind1().bind($$try(a))(e => {
    if (e.tag === "Left") { return Monad0.Applicative0().pure(); }
    if (e.tag === "Right") { return MonadThrow0.throwError(Effect$dException.error("Expected error")); }
    $runtime.fail();
  });
};
export {
  AnyShow,
  eqAnyShow,
  expectError,
  fail,
  newtypeAnyShow,
  shouldContain,
  shouldEqual,
  shouldNotContain,
  shouldNotEqual,
  shouldNotReturn,
  shouldNotSatisfy,
  shouldReturn,
  shouldSatisfy,
  showAnyShow
};
export * from "./foreign.js";
