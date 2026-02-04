export function screenX(e) {
  return e.screenX;
}

export function screenY(e) {
  return e.screenY;
}

export function clientX(e) {
  return e.clientX;
}

export function clientY(e) {
  return e.clientY;
}

export function pageX(e) {
  return e.pageX;
}

export function pageY(e) {
  return e.pageY;
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

export function button(e) {
  return e.button;
}

export function _relatedTarget(e) {
  return e.relatedTarget;
}

export function buttons(e) {
  return e.buttons;
}

export function getModifierState(s) {
  return function (e) {
    return function () {
      return e.getModifierState(s);
    };
  };
}
