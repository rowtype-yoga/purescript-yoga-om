import * as $runtime from "../runtime.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dArray$dST from "../Data.Array.ST/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunction from "../Data.Function/index.js";
import * as Data$dMap$dInternal from "../Data.Map.Internal/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dSet from "../Data.Set/index.js";
import * as Effect from "../Effect/index.js";
import * as Effect$dTimer from "../Effect.Timer/index.js";
import * as Unsafe$dReference from "../Unsafe.Reference/index.js";
import {deleteObjHack, fastForeachE, fastForeachOhE, fastForeachThunk, insertObjHack, objHack} from "./foreign.js";
const for_ = /* #__PURE__ */ Data$dFoldable.for_(Effect.applicativeEffect);
const for_1 = /* #__PURE__ */ for_(Data$dFoldable.foldableMaybe);
const monoidEffect = /* #__PURE__ */ (() => {
  const semigroupEffect1 = {
    append: a => b => () => {
      a();
      b();
    }
  };
  return {mempty: () => {}, Semigroup0: () => semigroupEffect1};
})();
const mempty = v => {};
const mempty1 = /* #__PURE__ */ (() => Data$dSet.monoidSet(Effect$dTimer.ordTimeoutId).mempty)();
const for_2 = /* #__PURE__ */ for_(Data$dSet.foldableSet);
const Hot = x => x;
const Mailbox = x => x;
const Mailboxed = x => x;
const MakeEventO = x => x;
const MakeEvent = x => x;
const MakeLemmingEvent = x => x;
const MakePureEvent = x => x;
const Memoize = x => x;
const SubscribeO = x => x;
const SubscribePureO = x => x;
const SubscribePure = x => x;
const Subscribe = x => x;
const Subscriber = x => x;
const MakeLemmingEventO = x => x;
const Delay = x => x;
const CreatePureO = x => x;
const CreatePure = x => x;
const CreateO = x => x;
const Create = x => x;
const Bus = x => x;
const sampleOnRight = v => v1 => (b, k) => {
  let latest = Data$dMaybe.Nothing;
  const c1 = v(b, a => latest = Data$dMaybe.$Maybe("Just", a));
  const c2 = v1(
    b,
    f => {
      const o = latest;
      return for_1(o)(a => {
        const $0 = f(a);
        return () => k($0);
      })();
    }
  );
  return () => {
    c1();
    return c2();
  };
};
const sampleOnLeft = v => v1 => (b, k) => {
  let latest = Data$dMaybe.Nothing;
  const c1 = v(
    b,
    a => {
      const o = latest;
      return for_1(o)(f => {
        const $0 = f(a);
        return () => k($0);
      })();
    }
  );
  const c2 = v1(b, f => latest = Data$dMaybe.$Maybe("Just", f));
  return () => {
    c1();
    return c2();
  };
};
const merge = dictFoldable => {
  const foldMap = dictFoldable.foldMap(monoidEffect);
  return f => (tf, k) => {
    const a = [];
    foldMap(v => () => {
      const u = v(tf, k);
      a.push(u);
    })(f)();
    return () => {
      const o = [...a];
      return fastForeachThunk(o);
    };
  };
};
const mailbox$p = dictOrd => {
  const alter = Data$dMap$dInternal.alter(dictOrd);
  return () => {
    let r = Data$dMap$dInternal.Leaf;
    return {
      event: a => (v, k2) => {
        const $0 = alter(v1 => {
          if (v1.tag === "Nothing") { return Data$dMaybe.$Maybe("Just", [k2]); }
          if (v1.tag === "Just") { return Data$dMaybe.$Maybe("Just", [...v1._1, k2]); }
          $runtime.fail();
        })(a);
        const $1 = r;
        r = $0($1);
        const $2 = alter(v1 => {
          if (v1.tag === "Nothing") { return Data$dMaybe.Nothing; }
          if (v1.tag === "Just") { return Data$dMaybe.$Maybe("Just", Data$dArray.deleteBy(Unsafe$dReference.reallyUnsafeRefEq)(k2)(v1._1)); }
          $runtime.fail();
        })(a);
        return () => {
          const $3 = r;
          r = $2($3);
        };
      },
      push: v => {
        const $0 = v.address;
        const $1 = v.payload;
        const o = r;
        const go = go$a0$copy => {
          let go$a0 = go$a0$copy, go$c = true, go$r;
          while (go$c) {
            const v$1 = go$a0;
            if (v$1.tag === "Leaf") {
              go$c = false;
              go$r = Data$dMaybe.Nothing;
              continue;
            }
            if (v$1.tag === "Node") {
              const v1 = dictOrd.compare($0)(v$1._3);
              if (v1 === "LT") {
                go$a0 = v$1._5;
                continue;
              }
              if (v1 === "GT") {
                go$a0 = v$1._6;
                continue;
              }
              if (v1 === "EQ") {
                go$c = false;
                go$r = Data$dMaybe.$Maybe("Just", v$1._4);
                continue;
              }
            }
            $runtime.fail();
          }
          return go$r;
        };
        const v1 = go(o);
        if (v1.tag === "Nothing") { return; }
        if (v1.tag === "Just") { return fastForeachE(v1._1, i => i($1)); }
        $runtime.fail();
      }
    };
  };
};
const keepLatest = v => (tf, k) => {
  let cancelInner = () => {};
  const cancelOuter = v(
    tf,
    v1 => {
      const ci = cancelInner;
      ci();
      const c = v1(tf, k);
      return cancelInner = c;
    }
  );
  return () => {
    const ci = cancelInner;
    ci();
    return cancelOuter();
  };
};
const functorEvent = {
  map: f => v => (b, k) => v(
    b,
    a => {
      const $0 = f(a);
      return k($0);
    }
  )
};
const filter = p => v => (tf, k) => v(
  tf,
  a => {
    const v1 = p(a);
    if (v1.tag === "Just") {
      const $0 = v1._1;
      return k($0);
    }
    if (v1.tag === "Nothing") { return; }
    $runtime.fail();
  }
);
const filter$p = f => v => (tf, k) => v(tf, a => {if (f(a)) { return k(a); }});
const create$p = () => {
  const subscribers = objHack();
  let idx = 0;
  return {
    event: (v, k) => {
      const rk = {value: k};
      const ix = idx;
      insertObjHack(ix, rk, subscribers);
      const $0 = idx;
      idx = $0 + 1 | 0;
      return () => {
        rk.value = mempty;
        deleteObjHack(ix, subscribers);
      };
    },
    push: a => fastForeachOhE(
      subscribers,
      rk => {
        const k = rk.value;
        return k(a);
      }
    )
  };
};
const fix = f => (tf, k) => {
  const v = create$p();
  const c2 = v.event(tf, k);
  const c1 = f(v.event)(tf, v.push);
  return () => {
    c1();
    return c2();
  };
};
const compactableEvent = {
  compact: v => (tf, k) => v(
    tf,
    a => {
      if (a.tag === "Just") {
        const $0 = a._1;
        return k($0);
      }
      if (a.tag === "Nothing") { return; }
      $runtime.fail();
    }
  ),
  separate: xs => (
    {
      left: (tf, k) => xs(
        tf,
        a => {
          if (a.tag === "Left") {
            const $0 = a._1;
            return k($0);
          }
          if (a.tag === "Right") { return; }
          $runtime.fail();
        }
      ),
      right: (tf, k) => xs(
        tf,
        a => {
          if (a.tag === "Right") {
            const $0 = a._1;
            return k($0);
          }
          if (a.tag === "Left") { return; }
          $runtime.fail();
        }
      )
    }
  )
};
const filterableEvent = {
  filter: filter$p,
  filterMap: filter,
  partition: p => xs => ({yes: (tf, k) => xs(tf, a => {if (p(a)) { return k(a); }}), no: (tf, k) => xs(tf, a => {if (!p(a)) { return k(a); }})}),
  partitionMap: f => xs => (
    {
      left: filterableEvent.filterMap(x => {
        const $0 = f(x);
        if ($0.tag === "Left") { return Data$dMaybe.$Maybe("Just", $0._1); }
        if ($0.tag === "Right") { return Data$dMaybe.Nothing; }
        $runtime.fail();
      })(xs),
      right: filterableEvent.filterMap(x => {
        const $0 = f(x);
        if ($0.tag === "Left") { return Data$dMaybe.Nothing; }
        if ($0.tag === "Right") { return Data$dMaybe.$Maybe("Just", $0._1); }
        $runtime.fail();
      })(xs)
    }
  ),
  Compactable0: () => compactableEvent,
  Functor1: () => functorEvent
};
const biSampleOn = v => v1 => (tf, k) => {
  let latest1 = Data$dMaybe.Nothing;
  const replay1 = [];
  let latest2 = Data$dMaybe.Nothing;
  const replay2 = [];
  let capturing = true;
  const c1 = v(
    tf,
    a => {
      const o = capturing;
      if (o) {
        replay1.push(a);
        return;
      }
      latest1 = Data$dMaybe.$Maybe("Just", a);
      const res = latest2;
      return for_1(res)(f => {
        const $0 = f(a);
        return () => k($0);
      })();
    }
  );
  const c2 = v1(
    tf,
    f => {
      const o = capturing;
      if (o) {
        replay2.push(f);
        return;
      }
      latest2 = Data$dMaybe.$Maybe("Just", f);
      const res = latest1;
      return for_1(res)(a => {
        const $0 = f(a);
        return () => k($0);
      })();
    }
  );
  capturing = false;
  const samples1 = [...replay1];
  const samples2 = [...replay2];
  if (samples1.length === 0) {
    const $0 = samples2.length - 1 | 0;
    latest2 = $0 >= 0 && $0 < samples2.length ? Data$dMaybe.$Maybe("Just", samples2[$0]) : Data$dMaybe.Nothing;
  } else {
    fastForeachE(
      samples1,
      a => {
        latest1 = Data$dMaybe.$Maybe("Just", a);
        return fastForeachE(
          samples2,
          f => {
            latest2 = Data$dMaybe.$Maybe("Just", f);
            return k(f(a));
          }
        );
      }
    );
  }
  Data$dArray$dST.splice(0)(samples1.length)([])(replay1)();
  Data$dArray$dST.splice(0)(samples2.length)([])(replay2)();
  return () => {
    c1();
    return c2();
  };
};
const subscribe = i => backdoor$lazy().subscribe(i);
const create = () => backdoor$lazy().create();
const backdoor$lazy = /* #__PURE__ */ $runtime.binding(() => {
  const create_ = () => {
    const subscribers = objHack();
    let idx = 0;
    return {
      event: (v, k) => {
        const rk = {value: k};
        const ix = idx;
        insertObjHack(ix, rk, subscribers);
        const $0 = idx;
        idx = $0 + 1 | 0;
        return () => {
          rk.value = mempty;
          deleteObjHack(ix, subscribers);
        };
      },
      push: a => () => fastForeachOhE(
        subscribers,
        rk => {
          const k = rk.value;
          return k(a);
        }
      )
    };
  };
  return {
    createO: create$p,
    makeEvent: e => (tf, k) => {
      if (tf) { return () => {}; }
      return e(a => () => k(a))();
    },
    makeEventO: e => (tf, k) => {
      if (tf) { return () => {}; }
      return e(k);
    },
    makePureEvent: e => (v, k) => e(a => () => k(a))(),
    makeLemmingEvent: e => (tf, k) => e(v => kx => () => v(tf, $0 => kx($0)()))(a => () => k(a))(),
    makeLemmingEventO: e => (tf, k) => e((v, kx) => v(tf, kx), k),
    create: create_,
    createPure: create_,
    createPureO: create$p,
    subscribe: v => k => () => v(false, $0 => k($0)()),
    subscribeO: (v, k) => v(false, k),
    subscribePureO: (v, k) => v(true, k),
    subscribePure: v => k => () => v(true, $0 => k($0)()),
    bus: f => (v, k) => {
      const v1 = backdoor$lazy().create();
      k(f(v1.push)(v1.event));
      return () => {};
    },
    memoize: v => f => (b, k) => {
      const v1 = create$p();
      k(f(v1.event));
      return v(b, v1.push);
    },
    hot: e => () => {
      const v = backdoor$lazy().create();
      const unsubscribe = backdoor$lazy().subscribe(e)(v.push)();
      return {event: v.event, unsubscribe};
    },
    mailbox: dictOrd => {
      const $0 = mailbox$p(dictOrd);
      return () => {
        const v = $0();
        return {event: v.event, push: k => () => v.push(k)};
      };
    },
    mailboxed: dictOrd => {
      const mailbox$p1 = mailbox$p(dictOrd);
      return v => f => (b, k) => {
        const v1 = mailbox$p1();
        k(f(v1.event));
        return v(b, v1.push);
      };
    },
    delay: n => v => (tf, k) => {
      let tid = mempty1;
      const canceler = v(
        tf,
        a => {
          let localId = Data$dMaybe.Nothing;
          const id = Effect$dTimer.setTimeoutImpl(n)(() => {
            k(a);
            const lid = localId;
            if (lid.tag === "Nothing") { return; }
            if (lid.tag === "Just") {
              const $0 = tid;
              tid = Data$dMap$dInternal.delete(Effect$dTimer.ordTimeoutId)(lid._1)($0);
              return;
            }
            $runtime.fail();
          })();
          localId = Data$dMaybe.$Maybe("Just", id);
          const $0 = tid;
          tid = Data$dMap$dInternal.unsafeUnionWith(
            Effect$dTimer.ordTimeoutId.compare,
            Data$dFunction.const,
            Data$dMap$dInternal.$$$Map("Node", 1, 1, id, undefined, Data$dMap$dInternal.Leaf, Data$dMap$dInternal.Leaf),
            $0
          );
        }
      );
      return () => {
        const ids = tid;
        for_2(ids)(Effect$dTimer.clearTimeoutImpl)();
        return canceler();
      };
    }
  };
});
const backdoor = /* #__PURE__ */ backdoor$lazy();
const bus = i => backdoor.bus(i);
const createO = () => backdoor.createO();
const createPure = () => backdoor.createPure();
const createPureO = () => backdoor.createPureO();
const delay = i => backdoor.delay(i);
const hot = i => backdoor.hot(i);
const mailbox = dictOrd => () => backdoor.mailbox(dictOrd)();
const mailboxed = dictOrd => i => backdoor.mailboxed(dictOrd)(i);
const makeEvent = i => backdoor.makeEvent(i);
const makeEventO = i => backdoor.makeEventO(i);
const makeLemmingEvent = i => backdoor.makeLemmingEvent(i);
const makeLemmingEventO = i => backdoor.makeLemmingEventO(i);
const makePureEvent = i => backdoor.makePureEvent(i);
const memoize = i => backdoor.memoize(i);
const subscribeO = /* #__PURE__ */ (() => backdoor.subscribeO)();
const subscribePure = i => backdoor.subscribePure(i);
const subscribePureO = /* #__PURE__ */ (() => backdoor.subscribePureO)();
const applyEvent = {apply: a => b => biSampleOn(a)((b$1, k) => b(b$1, a$1 => k(Data$dFunction.applyFlipped(a$1)))), Functor0: () => functorEvent};
const semigroupEvent = dictSemigroup => (
  {
    append: a => b => applyEvent.apply((b$1, k) => a(
      b$1,
      a$1 => {
        const $0 = dictSemigroup.append(a$1);
        return k($0);
      }
    ))(b)
  }
);
const applicativeEvent = {
  pure: a => (v, k) => {
    k(a);
    return () => {};
  },
  Apply0: () => applyEvent
};
const heytingAlgebraEvent = dictHeytingAlgebra => (
  {
    tt: (() => {
      const $0 = dictHeytingAlgebra.tt;
      return (v, k) => {
        k($0);
        return () => {};
      };
    })(),
    ff: (() => {
      const $0 = dictHeytingAlgebra.ff;
      return (v, k) => {
        k($0);
        return () => {};
      };
    })(),
    not: v => (b, k) => v(
      b,
      a => {
        const $0 = dictHeytingAlgebra.not(a);
        return k($0);
      }
    ),
    implies: a => b => applyEvent.apply((b$1, k) => a(
      b$1,
      a$1 => {
        const $0 = dictHeytingAlgebra.implies(a$1);
        return k($0);
      }
    ))(b),
    conj: a => b => applyEvent.apply((b$1, k) => a(
      b$1,
      a$1 => {
        const $0 = dictHeytingAlgebra.conj(a$1);
        return k($0);
      }
    ))(b),
    disj: a => b => applyEvent.apply((b$1, k) => a(
      b$1,
      a$1 => {
        const $0 = dictHeytingAlgebra.disj(a$1);
        return k($0);
      }
    ))(b)
  }
);
const monoidEvent = dictMonoid => {
  const semigroupEvent1 = semigroupEvent(dictMonoid.Semigroup0());
  return {
    mempty: (() => {
      const $0 = dictMonoid.mempty;
      return (v, k) => {
        k($0);
        return () => {};
      };
    })(),
    Semigroup0: () => semigroupEvent1
  };
};
const semiringEvent = dictSemiring => (
  {
    zero: (() => {
      const $0 = dictSemiring.zero;
      return (v, k) => {
        k($0);
        return () => {};
      };
    })(),
    one: (() => {
      const $0 = dictSemiring.one;
      return (v, k) => {
        k($0);
        return () => {};
      };
    })(),
    add: a => b => applyEvent.apply((b$1, k) => a(
      b$1,
      a$1 => {
        const $0 = dictSemiring.add(a$1);
        return k($0);
      }
    ))(b),
    mul: a => b => applyEvent.apply((b$1, k) => a(
      b$1,
      a$1 => {
        const $0 = dictSemiring.mul(a$1);
        return k($0);
      }
    ))(b)
  }
);
const ringEvent = dictRing => {
  const semiringEvent1 = semiringEvent(dictRing.Semiring0());
  return {
    sub: a => b => applyEvent.apply((b$1, k) => a(
      b$1,
      a$1 => {
        const $0 = dictRing.sub(a$1);
        return k($0);
      }
    ))(b),
    Semiring0: () => semiringEvent1
  };
};
const altEvent = {
  alt: v => v1 => (tf, k) => {
    const a$p = v(tf, k);
    const a$p$1 = v1(tf, k);
    return () => {
      a$p();
      return a$p$1();
    };
  },
  Functor0: () => functorEvent
};
const burning = i => v => () => {
  let r = i;
  const v1 = create$p();
  const unsubscribe = v(
    true,
    x => {
      r = x;
      return v1.push(x);
    }
  );
  return {
    event: (tf, k) => {
      const a$p = v1.event(tf, k);
      const o = r;
      k(o);
      return () => {a$p();};
    },
    unsubscribe
  };
};
const plusEvent = {empty: (v, v1) => () => {}, Alt0: () => altEvent};
const alternativeEvent = {Applicative0: () => applicativeEvent, Plus1: () => plusEvent};
const eventIsEvent = {keepLatest, sampleOnRight, sampleOnLeft, fix, Alternative0: () => alternativeEvent, Filterable1: () => filterableEvent};
export {
  Bus,
  Create,
  CreateO,
  CreatePure,
  CreatePureO,
  Delay,
  Hot,
  Mailbox,
  Mailboxed,
  MakeEvent,
  MakeEventO,
  MakeLemmingEvent,
  MakeLemmingEventO,
  MakePureEvent,
  Memoize,
  Subscribe,
  SubscribeO,
  SubscribePure,
  SubscribePureO,
  Subscriber,
  altEvent,
  alternativeEvent,
  applicativeEvent,
  applyEvent,
  backdoor,
  biSampleOn,
  burning,
  bus,
  compactableEvent,
  create,
  create$p,
  createO,
  createPure,
  createPureO,
  delay,
  eventIsEvent,
  filter,
  filter$p,
  filterableEvent,
  fix,
  for_,
  for_1,
  for_2,
  functorEvent,
  heytingAlgebraEvent,
  hot,
  keepLatest,
  mailbox,
  mailbox$p,
  mailboxed,
  makeEvent,
  makeEventO,
  makeLemmingEvent,
  makeLemmingEventO,
  makePureEvent,
  memoize,
  mempty,
  mempty1,
  merge,
  monoidEffect,
  monoidEvent,
  plusEvent,
  ringEvent,
  sampleOnLeft,
  sampleOnRight,
  semigroupEvent,
  semiringEvent,
  subscribe,
  subscribeO,
  subscribePure,
  subscribePureO
};
export * from "./foreign.js";
