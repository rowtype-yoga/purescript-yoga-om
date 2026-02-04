import * as Effect$dAVar from "../Effect.AVar/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
const tryTake = x => Effect$dAff._liftEffect(Effect$dAVar._tryTakeVar(Effect$dAVar.ffiUtil, x));
const tryRead = x => Effect$dAff._liftEffect(Effect$dAVar._tryReadVar(Effect$dAVar.ffiUtil, x));
const tryPut = value => x => Effect$dAff._liftEffect(Effect$dAVar._tryPutVar(Effect$dAVar.ffiUtil, value, x));
const take = avar => Effect$dAff.makeAff(k => {
  const $0 = Effect$dAVar._takeVar(Effect$dAVar.ffiUtil, avar, k);
  return () => {
    const c = $0();
    const $1 = Effect$dAff._liftEffect(c);
    return v => $1;
  };
});
const status = x => Effect$dAff._liftEffect(Effect$dAVar._status(Effect$dAVar.ffiUtil, x));
const read = avar => Effect$dAff.makeAff(k => {
  const $0 = Effect$dAVar._readVar(Effect$dAVar.ffiUtil, avar, k);
  return () => {
    const c = $0();
    const $1 = Effect$dAff._liftEffect(c);
    return v => $1;
  };
});
const put = value => avar => Effect$dAff.makeAff(k => {
  const $0 = Effect$dAVar._putVar(Effect$dAVar.ffiUtil, value, avar, k);
  return () => {
    const c = $0();
    const $1 = Effect$dAff._liftEffect(c);
    return v => $1;
  };
});
const $$new = x => Effect$dAff._liftEffect(Effect$dAVar._newVar(x));
const kill = error => x => Effect$dAff._liftEffect(Effect$dAVar._killVar(Effect$dAVar.ffiUtil, error, x));
const empty = /* #__PURE__ */ Effect$dAff._liftEffect(Effect$dAVar.empty);
export {empty, kill, $$new as new, put, read, status, take, tryPut, tryRead, tryTake};
