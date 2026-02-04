import * as $runtime from "../runtime.js";
import * as Bolson$dCore from "../Bolson.Core/index.js";
import * as Control$dMonad$dST$dInternal from "../Control.Monad.ST.Internal/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dFunctorWithIndex from "../Data.FunctorWithIndex/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dSemigroup from "../Data.Semigroup/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as FRP$dEvent$dClass from "../FRP.Event.Class/index.js";
import * as Foreign$dObject from "../Foreign.Object/index.js";
import {mutAr, readAr, unsafeUpdateMutAr} from "./foreign.js";
const $Stage = tag => tag;
const mapAccum = /* #__PURE__ */ FRP$dEvent$dClass.mapAccum(FRP$dEvent.eventIsEvent);
const merge = /* #__PURE__ */ FRP$dEvent.merge(Data$dFoldable.foldableArray);
const for_ = /* #__PURE__ */ Data$dFoldable.for_(Control$dMonad$dST$dInternal.applicativeST);
const for_1 = /* #__PURE__ */ for_(Data$dFoldable.foldableMaybe);
const for_2 = /* #__PURE__ */ for_(Data$dFoldable.foldableArray);
const identity = x => x;
const traverse_ = /* #__PURE__ */ Data$dFoldable.traverse_(Control$dMonad$dST$dInternal.applicativeST)(Data$dFoldable.foldableArray);
const Begin = /* #__PURE__ */ $Stage("Begin");
const Middle = /* #__PURE__ */ $Stage("Middle");
const End = /* #__PURE__ */ $Stage("End");
const switcher = f => event => Bolson$dCore.$Entity(
  "DynamicChildren'",
  (() => {
    const $0 = FRP$dEvent.backdoor.memoize(mapAccum(a => b => Data$dTuple.$Tuple(a + 1 | 0, Data$dTuple.$Tuple(b, a)))(0)(event))(cenv => (b, k) => cenv(
      b,
      a => {
        const $0 = merge([
          (() => {
            const $0 = a._2 + 1 | 0;
            return (b$1, k$1) => cenv(b$1, a$1 => {if ($0 === a$1._2) { return k$1(Bolson$dCore.Remove); }});
          })(),
          (() => {
            const $0 = Bolson$dCore.$Child("Insert", f(a._1));
            return (v, k$1) => {
              k$1($0);
              return () => {};
            };
          })()
        ]);
        return k($0);
      }
    ));
    return (tf, k) => {
      let cancelInner = () => {};
      const cancelOuter = $0(
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
  })()
);
const internalPortalComplexSimple = () => () => () => isGlobal => scopeF => v => toBeam => closure => v.fromEltO2(psr => interpreter => FRP$dEvent.backdoor.makeLemmingEventO((
  v1,
  k
) => {
  const av = mutAr(Data$dFunctor.arrayMap(v$1 => ({id: "", entity: Bolson$dCore.$Entity("EventfulElement'", FRP$dEvent.plusEvent.empty)}))(toBeam))();
  const u0 = v1(
    merge(Data$dFunctorWithIndex.mapWithIndexArray(ix => {
      const go = go$a0$copy => {
        let go$a0 = go$a0$copy, go$c = true, go$r;
        while (go$c) {
          const x = go$a0;
          if (x.tag === "Element'") {
            go$c = false;
            go$r = v.toEltO1(x._1)({...psr, parent: Data$dMaybe.Nothing, scope: scopeF(psr.scope), raiseId: id => unsafeUpdateMutAr(ix)({id, entity: x})(av)})(interpreter);
            continue;
          }
          go$a0 = v.wrapElt(x);
        }
        return go$r;
      };
      return go;
    })(toBeam)),
    k
  );
  let av2 = () => {};
  const idz = readAr(av)();
  const u = v1(
    v.toEltO2(closure(Data$dFunctor.arrayMap(v2 => {
      const $0 = v2.entity;
      const $1 = v2.id;
      return specialization => Bolson$dCore.$Entity(
        "Element'",
        v.fromEltO1(psr2 => itp => FRP$dEvent.backdoor.makeLemmingEventO((v3, k2) => {
          psr2.raiseId($1)();
          for_1(psr2.parent)(pt => {
            const $2 = v.giveNewParent(itp)({...psr2, id: $1, parent: pt})($0)(specialization);
            return () => k2($2);
          })();
          return () => {};
        }))
      );
    })(idz)))(psr)(interpreter),
    k
  );
  av2 = u;
  return () => {
    u0();
    const $0 = for_2(idz)(v3 => {
      const $0 = v.deleteFromCache(interpreter)({id: v3.id});
      return () => k($0);
    });
    if (!isGlobal) { $0(); }
    const av2c = av2;
    return av2c();
  };
}));
const portalComplexSimple = () => () => () => portalArgs => toBeam => closure => internalPortalComplexSimple()()()(false)(identity)(portalArgs)(toBeam)(closure);
const globalPortalComplexSimple = () => () => () => portalArgs => toBeam => closure => internalPortalComplexSimple()()()(true)(v => Bolson$dCore.Global)(portalArgs)(toBeam)(closure);
const flatten = v => psr => interpreter => v1 => {
  if (v1.tag === "FixedChildren'") { return merge(Data$dFunctor.arrayMap(flatten(v)(psr)(interpreter))(v1._1)); }
  if (v1.tag === "EventfulElement'") {
    const $0 = flatten(v)(psr)(interpreter);
    return (tf, k) => {
      let cancelInner = () => {};
      const cancelOuter = v1._1(
        tf,
        a => {
          const $1 = $0(a);
          const ci = cancelInner;
          ci();
          const c = $1(tf, k);
          return cancelInner = c;
        }
      );
      return () => {
        const ci = cancelInner;
        ci();
        return cancelOuter();
      };
    };
  }
  if (v1.tag === "Element'") { return v.toElt(v1._1)(psr)(interpreter); }
  if (v1.tag === "DynamicChildren'") {
    const $0 = v1._1;
    return FRP$dEvent.backdoor.makeLemmingEventO((v2, v3) => {
      let cancelInner = Foreign$dObject.empty;
      const cancelOuter = v2(
        $0,
        inner => {
          const myUnsubId = v.ids(interpreter)();
          let myUnsub = () => {};
          const eltsUnsubId = v.ids(interpreter)();
          let eltsUnsub = () => {};
          let myIds = [];
          let myImmediateCancellation = () => {};
          const $1 = (() => {
            if (psr.scope.tag === "Global") { return v.ids(interpreter)(); }
            if (psr.scope.tag === "Local") {
              const a$p = v.ids(interpreter)();
              return psr.scope._1 + "!" + a$p;
            }
            $runtime.fail();
          })();
          let stageRef = Begin;
          const c0 = v2(
            inner,
            kid$p => {
              const stage = stageRef;
              if (stage === "Middle") {
                if (kid$p.tag === "Logic") {
                  const $2 = kid$p._1;
                  const curId = myIds;
                  return traverse_(i => {
                    const $3 = v.doLogic($2)(interpreter)(i);
                    return () => v3($3);
                  })(curId)();
                }
                if (kid$p.tag === "Remove") {
                  stageRef = End;
                  const mic = () => {
                    const idRef = myIds;
                    for_2(idRef)(old => for_1(psr.parent)(pnt => {
                      const $2 = v.disconnectElement(interpreter)({id: old, parent: pnt, scope: Bolson$dCore.$Scope("Local", $1)});
                      return () => v3($2);
                    }))();
                    const myu = myUnsub;
                    myu();
                    const eltu = eltsUnsub;
                    eltu();
                    const $2 = cancelInner;
                    cancelInner = Foreign$dObject.mutate($3 => () => {
                      delete $3[myUnsubId];
                      return $3;
                    })($2);
                    const $3 = cancelInner;
                    cancelInner = Foreign$dObject.mutate($4 => () => {
                      delete $4[eltsUnsubId];
                      return $4;
                    })($3);
                  };
                  myImmediateCancellation = mic;
                  return mic();
                }
                return;
              }
              if (kid$p.tag === "Insert" && stage === "Begin") {
                stageRef = Middle;
                const c1 = v2(
                  flatten(v)({
                    ...psr,
                    scope: Bolson$dCore.$Scope("Local", $1),
                    raiseId: id => {
                      const $2 = Data$dSemigroup.concatArray([id]);
                      return () => {
                        const $3 = myIds;
                        myIds = $2($3);
                      };
                    }
                  })(interpreter)(kid$p._1),
                  v3
                );
                const $2 = cancelInner;
                cancelInner = Foreign$dObject.mutate($3 => () => {
                  $3[eltsUnsubId] = c1;
                  return $3;
                })($2);
                eltsUnsub = c1;
              }
            }
          );
          myUnsub = c0;
          const $2 = cancelInner;
          cancelInner = Foreign$dObject.mutate($3 => () => {
            $3[myUnsubId] = c0;
            return $3;
          })($2);
          const mican = myImmediateCancellation;
          return mican();
        }
      );
      const $1 = Foreign$dObject.fold(z => v$1 => b => () => {
        z();
        return b();
      })(() => {});
      return () => {
        const $2 = cancelInner;
        $1($2)();
        return cancelOuter();
      };
    });
  }
  $runtime.fail();
};
const internalPortalComplexComplex = () => () => () => isGlobal => scopeF => flatArgs => v => toBeam => closure => Bolson$dCore.$Entity(
  "Element'",
  v.fromEltO2(psr => interpreter => FRP$dEvent.backdoor.makeLemmingEventO((v1, k) => {
    const av = mutAr(Data$dFunctor.arrayMap(v$1 => ({id: "", entity: Bolson$dCore.$Entity("EventfulElement'", FRP$dEvent.plusEvent.empty)}))(toBeam))();
    const u0 = v1(
      merge(Data$dFunctorWithIndex.mapWithIndexArray(ix => {
        const go = go$a0$copy => {
          let go$a0 = go$a0$copy, go$c = true, go$r;
          while (go$c) {
            const x = go$a0;
            if (x.tag === "Element'") {
              go$c = false;
              go$r = v.toElt(x._1)({...psr, parent: Data$dMaybe.Nothing, scope: scopeF(psr.scope), raiseId: id => unsafeUpdateMutAr(ix)({id, entity: x})(av)})(interpreter);
              continue;
            }
            go$a0 = v.wrapElt(x);
          }
          return go$r;
        };
        return go;
      })(toBeam)),
      k
    );
    let av2 = () => {};
    const idz = readAr(av)();
    const u = v1(
      flatten(flatArgs)(psr)(interpreter)(closure(Data$dFunctor.arrayMap(v2 => {
        const $0 = v2.entity;
        const $1 = v2.id;
        return specialization => Bolson$dCore.$Entity(
          "Element'",
          v.fromEltO1(psr2 => itp => FRP$dEvent.backdoor.makeLemmingEventO((v3, k2) => {
            psr2.raiseId($1)();
            for_1(psr2.parent)(pt => {
              const $2 = v.giveNewParent(itp)({...psr2, id: $1, parent: pt})($0)(specialization);
              return () => k2($2);
            })();
            return () => {};
          }))
        );
      })(idz))),
      k
    );
    av2 = u;
    return () => {
      u0();
      const $0 = for_2(idz)(v2 => {
        const $0 = v.deleteFromCache(interpreter)({id: v2.id});
        return () => k($0);
      });
      if (!isGlobal) { $0(); }
      const av2c = av2;
      return av2c();
    };
  }))
);
const globalPortalComplexComplex = () => () => () => flatArgs => portalArgs => toBeam => closure => internalPortalComplexComplex()()()(true)(v => Bolson$dCore.Global)(flatArgs)(portalArgs)(toBeam)(closure);
const portalComplexComplex = () => () => () => flatArgs => portalArgs => toBeam => closure => internalPortalComplexComplex()()()(false)(identity)(flatArgs)(portalArgs)(toBeam)(closure);
const internalPortalSimpleComplex = () => () => () => isGlobal => scopeF => flatArgs => v => toBeam => closure => Bolson$dCore.$Entity(
  "Element'",
  v.fromEltO2(psr => interpreter => FRP$dEvent.backdoor.makeLemmingEventO((v1, k) => {
    const av = mutAr(Data$dFunctor.arrayMap(v$1 => ({id: "", entity: Bolson$dCore.$Entity("EventfulElement'", FRP$dEvent.plusEvent.empty)}))(toBeam))();
    const u0 = v1(
      merge(Data$dFunctorWithIndex.mapWithIndexArray(ix => entity => v.toElt(entity)({
        ...psr,
        parent: Data$dMaybe.Nothing,
        scope: scopeF(psr.scope),
        raiseId: id => unsafeUpdateMutAr(ix)({id, entity: Bolson$dCore.$Entity("Element'", entity)})(av)
      })(interpreter))(toBeam)),
      k
    );
    let av2 = () => {};
    const idz = readAr(av)();
    const u = v1(
      flatten(flatArgs)(psr)(interpreter)(closure(Data$dFunctor.arrayMap(v2 => {
        const $0 = v2.entity;
        const $1 = v2.id;
        return specialization => v.fromEltO1(psr2 => itp => FRP$dEvent.backdoor.makeLemmingEventO((v3, k2) => {
          psr2.raiseId($1)();
          for_1(psr2.parent)(pt => {
            const $2 = v.giveNewParent(itp)({...psr2, id: $1, parent: pt})($0)(specialization);
            return () => k2($2);
          })();
          return () => {};
        }));
      })(idz))),
      k
    );
    av2 = u;
    return () => {
      u0();
      const $0 = for_2(idz)(v2 => {
        const $0 = v.deleteFromCache(interpreter)({id: v2.id});
        return () => k($0);
      });
      if (!isGlobal) { $0(); }
      const av2c = av2;
      return av2c();
    };
  }))
);
const globalPortalSimpleComplex = () => () => () => flatArgs => portalArgs => toBeam => closure => internalPortalSimpleComplex()()()(true)(v => Bolson$dCore.Global)(flatArgs)(portalArgs)(toBeam)(closure);
const portalSimpleComplex = () => () => () => flatArgs => portalArgs => toBeam => closure => internalPortalSimpleComplex()()()(false)(identity)(flatArgs)(portalArgs)(toBeam)(closure);
const fixComplexComplex = flatArgs => v => f => Bolson$dCore.$Entity(
  "Element'",
  v.fromElt(i => interpret => FRP$dEvent.backdoor.makeLemmingEventO((v1, k) => {
    let av = Data$dMaybe.Nothing;
    return v1(
      flatten(flatArgs)({
        ...i,
        parent: i.parent,
        scope: i.scope,
        raiseId: s => {
          const $0 = i.raiseId(s);
          return () => {
            $0();
            av = Data$dMaybe.$Maybe("Just", s);
          };
        }
      })(interpret)(f(Bolson$dCore.$Entity(
        "Element'",
        v.fromElt(ii => v2 => FRP$dEvent.backdoor.makeLemmingEventO((v3, k0) => {
          const v4 = av;
          if (v4.tag === "Nothing") {

          } else if (v4.tag === "Just") {
            const $0 = v4._1;
            for_1(ii.parent)(p$p => {
              const $1 = ii.raiseId($0);
              if ($0 !== p$p) {
                return () => {
                  $1();
                  return k0(v.connectToParent(interpret)({id: $0, parent: p$p}));
                };
              }
              return () => {};
            })();
          } else {
            $runtime.fail();
          }
          return () => {};
        }))
      ))),
      k
    );
  }))
);
export {
  $Stage,
  Begin,
  End,
  Middle,
  fixComplexComplex,
  flatten,
  for_,
  for_1,
  for_2,
  globalPortalComplexComplex,
  globalPortalComplexSimple,
  globalPortalSimpleComplex,
  identity,
  internalPortalComplexComplex,
  internalPortalComplexSimple,
  internalPortalSimpleComplex,
  mapAccum,
  merge,
  portalComplexComplex,
  portalComplexSimple,
  portalSimpleComplex,
  switcher,
  traverse_
};
export * from "./foreign.js";
