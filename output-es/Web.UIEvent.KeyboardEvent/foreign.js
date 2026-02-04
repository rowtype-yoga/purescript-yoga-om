export function key(e) {
  return e.key;
}

export function code(e) {
  return e.code;
}

export function locationIndex(e) {
  return e.location;
}

export function ctrlKey(e) {
  return e.ctrlKey;
}

export function shiftKey(e) {
  return e.shiftKey;
}

export function altKey(e) {
  return e.altKey;
}

export function metaKey(e) {
  return e.metaKey;
}

export function repeat(e) {
  return e.repeat;
}

export function isComposing(e) {
  return e.isComposing;
}

export function getModifierState(s) {
  return function (e) {
    return function () {
      return e.getModifierState(s);
    };
  };
}
