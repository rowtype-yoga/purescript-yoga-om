import * as Record$dBuilder from "../Record.Builder/index.js";
import * as Record$dUnsafe from "../Record.Unsafe/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const identity = x => x;
const mapUniformRecordNilRowRow = {mapUniformRecordBuilder: v => v1 => v2 => identity};
const mapUniformRecordBuilder = dict => dict.mapUniformRecordBuilder;
const mapUniformRecordCons = dictIsSymbol => () => () => () => dictMapUniformRecord => (
  {
    mapUniformRecordBuilder: v => fn => r => {
      const $0 = Record$dBuilder.insert()()(dictIsSymbol)(Type$dProxy.Proxy)(fn(Record$dUnsafe.unsafeGet(dictIsSymbol.reflectSymbol(Type$dProxy.Proxy))(r)));
      const $1 = dictMapUniformRecord.mapUniformRecordBuilder(Type$dProxy.Proxy)(fn)(r);
      return x => $0($1(x));
    }
  }
);
const mapUniformRecord = () => dictMapUniformRecord => fn => {
  const $0 = dictMapUniformRecord.mapUniformRecordBuilder(Type$dProxy.Proxy)(fn);
  return x => $0(x)({});
};
export {identity, mapUniformRecord, mapUniformRecordBuilder, mapUniformRecordCons, mapUniformRecordNilRowRow};
