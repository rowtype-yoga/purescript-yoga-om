import * as $runtime from "../runtime.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Foreign$dObject from "../Foreign.Object/index.js";
import * as Node$dEncoding from "../Node.Encoding/index.js";
import * as Node$dFS$dAff from "../Node.FS.Aff/index.js";
import * as Node$dFS$dAsync from "../Node.FS.Async/index.js";
import * as Node$dProcess from "../Node.Process/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
import * as Yoga$dOm$dError from "../Yoga.Om.Error/index.js";
const writeTextFile = path => content => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff3(Node$dFS$dAsync.writeTextFile)(Node$dEncoding.UTF8)(path)(content))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const writeFile = path => buffer => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff2(Node$dFS$dAsync.writeFile)(path)(buffer))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const unlink = path => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff1(Node$dFS$dAsync.unlink)(path))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const setEnv = variable => value => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._liftEffect(() => Node$dProcess.setEnvImpl(variable, value)))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const rmdir = path => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff1(Node$dFS$dAsync.rmdir)(path))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const readTextFile = path => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff2(Node$dFS$dAsync.readTextFile)(Node$dEncoding.UTF8)(path))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(result => Yoga$dOm.applicativeOm.pure(result));
const readFile = path => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff1(Node$dFS$dAsync.readFile)(path))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(result => Yoga$dOm.applicativeOm.pure(result));
const mkdir = path => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff1(Node$dFS$dAsync.mkdir)(path))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const lookupEnv = variable => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._liftEffect(() => {
  const a$p = Node$dProcess.unsafeGetEnv();
  return Foreign$dObject._lookup(Data$dMaybe.Nothing, Data$dMaybe.Just, variable, a$p);
}))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const getEnv = variable => Yoga$dOm.bindOm.bind(lookupEnv(variable))(value => {
  const pure3 = Yoga$dOm.monadThrowVariantExceptio.Monad0().Applicative0().pure;
  const $0 = Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm$dError.singletonVariantRecord()()()({reflectSymbol: () => "envNotFound"}).singletonRecordToVariant({
    envNotFound: {variable}
  }));
  if (value.tag === "Nothing") { return $0; }
  if (value.tag === "Just") { return pure3(value._1); }
  $runtime.fail();
});
const exists = path => Yoga$dOm.handleErrors()()()({exception: v => Yoga$dOm.applicativeOm.pure(false)})(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._map(v => true)(Node$dFS$dAff.toAff1(Node$dFS$dAsync.stat)(path)))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}));
const cwd = /* #__PURE__ */ (() => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._liftEffect(Node$dProcess.cwd))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))();
const appendTextFile = path => content => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff3(Node$dFS$dAsync.appendTextFile)(Node$dEncoding.UTF8)(path)(content))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const appendFile = path => buffer => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Node$dFS$dAff.toAff2(Node$dFS$dAsync.appendFile)(path)(buffer))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
export {appendFile, appendTextFile, cwd, exists, getEnv, lookupEnv, mkdir, readFile, readTextFile, rmdir, setEnv, unlink, writeFile, writeTextFile};
