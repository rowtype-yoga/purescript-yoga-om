// | Convenience functions to simplify outputting ANSI escape codes to
// | terminals.
import * as Ansi$dCodes from "../Ansi.Codes/index.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dNonEmpty from "../Data.NonEmpty/index.js";
const withGraphics = params => text => Ansi$dCodes.escapeCodeToString(Ansi$dCodes.$EscapeCode("Graphics", params)) + text + Ansi$dCodes.escapeCodeToString(Ansi$dCodes.$EscapeCode(
  "Graphics",
  Data$dNonEmpty.$NonEmpty(Ansi$dCodes.Reset, Data$dList$dTypes.Nil)
));
const underline = /* #__PURE__ */ Data$dNonEmpty.$NonEmpty(/* #__PURE__ */ Ansi$dCodes.$GraphicsParam("PMode", Ansi$dCodes.Underline), Data$dList$dTypes.Nil);
const strikethrough = /* #__PURE__ */ Data$dNonEmpty.$NonEmpty(/* #__PURE__ */ Ansi$dCodes.$GraphicsParam("PMode", Ansi$dCodes.Strikethrough), Data$dList$dTypes.Nil);
const italic = /* #__PURE__ */ Data$dNonEmpty.$NonEmpty(/* #__PURE__ */ Ansi$dCodes.$GraphicsParam("PMode", Ansi$dCodes.Italic), Data$dList$dTypes.Nil);
const inverse = /* #__PURE__ */ Data$dNonEmpty.$NonEmpty(/* #__PURE__ */ Ansi$dCodes.$GraphicsParam("PMode", Ansi$dCodes.Inverse), Data$dList$dTypes.Nil);
const foreground = c => Data$dNonEmpty.$NonEmpty(Ansi$dCodes.$GraphicsParam("PForeground", c), Data$dList$dTypes.Nil);
const dim = /* #__PURE__ */ Data$dNonEmpty.$NonEmpty(/* #__PURE__ */ Ansi$dCodes.$GraphicsParam("PMode", Ansi$dCodes.Dim), Data$dList$dTypes.Nil);
const bold = /* #__PURE__ */ Data$dNonEmpty.$NonEmpty(/* #__PURE__ */ Ansi$dCodes.$GraphicsParam("PMode", Ansi$dCodes.Bold), Data$dList$dTypes.Nil);
const background = c => Data$dNonEmpty.$NonEmpty(Ansi$dCodes.$GraphicsParam("PBackground", c), Data$dList$dTypes.Nil);
export {background, bold, dim, foreground, inverse, italic, strikethrough, underline, withGraphics};
