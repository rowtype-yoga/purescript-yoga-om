import * as Data$dTuple from "../Data.Tuple/index.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as Record$dUnsafe from "../Record.Unsafe/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const Vbus = x => x;
const vbusNil = {vb: v => () => Data$dTuple.$Tuple({}, {})};
const vb = dict => dict.vb;
const vbackdoor = {
  vbus: () => dictVBus => v => f => FRP$dEvent.backdoor.makeLemmingEvent(v1 => k => {
    const $0 = dictVBus.vb(Type$dProxy.Proxy);
    return () => {
      const v2 = $0();
      k(f(v2._1)(v2._2))();
      return () => {};
    };
  })
};
const vbus = () => dictVBus => i => vbackdoor.vbus()(dictVBus)(i);
const vbusCons1 = dictIsSymbol => () => () => () => dictVBus => dictVBus1 => () => () => (
  {
    vb: v => {
      const $0 = dictVBus1.vb(Type$dProxy.Proxy);
      return () => {
        const v1 = $0();
        const v2 = dictVBus.vb(Type$dProxy.Proxy)();
        return Data$dTuple.$Tuple(
          Record$dUnsafe.unsafeSet(dictIsSymbol.reflectSymbol(Type$dProxy.Proxy))(v2._1)(v1._1),
          Record$dUnsafe.unsafeSet(dictIsSymbol.reflectSymbol(Type$dProxy.Proxy))(v2._2)(v1._2)
        );
      };
    }
  }
);
const vbusCons2 = dictIsSymbol => () => () => dictVBus => () => () => (
  {
    vb: v => {
      const $0 = dictVBus.vb(Type$dProxy.Proxy);
      return () => {
        const v1 = $0();
        const v2 = FRP$dEvent.backdoor.create();
        return Data$dTuple.$Tuple(
          Record$dUnsafe.unsafeSet(dictIsSymbol.reflectSymbol(Type$dProxy.Proxy))(v2.push)(v1._1),
          Record$dUnsafe.unsafeSet(dictIsSymbol.reflectSymbol(Type$dProxy.Proxy))(v2.event)(v1._2)
        );
      };
    }
  }
);
export {Vbus, vb, vbackdoor, vbus, vbusCons1, vbusCons2, vbusNil};
