// | This module defines a data type representing ANSI escape codes, as well as
// | functions for serialising them as Strings.
import * as $runtime from "../runtime.js";
import * as Data$dGeneric$dRep from "../Data.Generic.Rep/index.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dOrdering from "../Data.Ordering/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dShow$dGeneric from "../Data.Show.Generic/index.js";
const $Color = tag => tag;
const $EraseParam = tag => tag;
const $EscapeCode = (tag, _1, _2) => ({tag, _1, _2});
const $GraphicsParam = (tag, _1) => ({tag, _1});
const $RenderingMode = tag => tag;
const genericShowArgsArgument = {genericShowArgs: v => [Data$dShow.showIntImpl(v)]};
const Bold = /* #__PURE__ */ $RenderingMode("Bold");
const Dim = /* #__PURE__ */ $RenderingMode("Dim");
const Italic = /* #__PURE__ */ $RenderingMode("Italic");
const Underline = /* #__PURE__ */ $RenderingMode("Underline");
const Inverse = /* #__PURE__ */ $RenderingMode("Inverse");
const Strikethrough = /* #__PURE__ */ $RenderingMode("Strikethrough");
const ToEnd = /* #__PURE__ */ $EraseParam("ToEnd");
const FromBeginning = /* #__PURE__ */ $EraseParam("FromBeginning");
const Entire = /* #__PURE__ */ $EraseParam("Entire");
const Black = /* #__PURE__ */ $Color("Black");
const Red = /* #__PURE__ */ $Color("Red");
const Green = /* #__PURE__ */ $Color("Green");
const Yellow = /* #__PURE__ */ $Color("Yellow");
const Blue = /* #__PURE__ */ $Color("Blue");
const Magenta = /* #__PURE__ */ $Color("Magenta");
const Cyan = /* #__PURE__ */ $Color("Cyan");
const White = /* #__PURE__ */ $Color("White");
const BrightBlack = /* #__PURE__ */ $Color("BrightBlack");
const BrightRed = /* #__PURE__ */ $Color("BrightRed");
const BrightGreen = /* #__PURE__ */ $Color("BrightGreen");
const BrightYellow = /* #__PURE__ */ $Color("BrightYellow");
const BrightBlue = /* #__PURE__ */ $Color("BrightBlue");
const BrightMagenta = /* #__PURE__ */ $Color("BrightMagenta");
const BrightCyan = /* #__PURE__ */ $Color("BrightCyan");
const BrightWhite = /* #__PURE__ */ $Color("BrightWhite");
const Reset = /* #__PURE__ */ $GraphicsParam("Reset");
const PMode = value0 => $GraphicsParam("PMode", value0);
const PForeground = value0 => $GraphicsParam("PForeground", value0);
const PBackground = value0 => $GraphicsParam("PBackground", value0);
const Up = value0 => $EscapeCode("Up", value0);
const Down = value0 => $EscapeCode("Down", value0);
const Forward = value0 => $EscapeCode("Forward", value0);
const Back = value0 => $EscapeCode("Back", value0);
const NextLine = value0 => $EscapeCode("NextLine", value0);
const PreviousLine = value0 => $EscapeCode("PreviousLine", value0);
const HorizontalAbsolute = value0 => $EscapeCode("HorizontalAbsolute", value0);
const Position = value0 => value1 => $EscapeCode("Position", value0, value1);
const EraseData = value0 => $EscapeCode("EraseData", value0);
const EraseLine = value0 => $EscapeCode("EraseLine", value0);
const ScrollUp = value0 => $EscapeCode("ScrollUp", value0);
const ScrollDown = value0 => $EscapeCode("ScrollDown", value0);
const Graphics = value0 => $EscapeCode("Graphics", value0);
const SavePosition = /* #__PURE__ */ $EscapeCode("SavePosition");
const RestorePosition = /* #__PURE__ */ $EscapeCode("RestorePosition");
const QueryPosition = /* #__PURE__ */ $EscapeCode("QueryPosition");
const HideCursor = /* #__PURE__ */ $EscapeCode("HideCursor");
const ShowCursor = /* #__PURE__ */ $EscapeCode("ShowCursor");
const prefix = "\u001b[";
const genericRenderingMode = {
  to: x => {
    if (x.tag === "Inl") { return Bold; }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") { return Dim; }
      if (x._1.tag === "Inr") {
        if (x._1._1.tag === "Inl") { return Italic; }
        if (x._1._1.tag === "Inr") {
          if (x._1._1._1.tag === "Inl") { return Underline; }
          if (x._1._1._1.tag === "Inr") {
            if (x._1._1._1._1.tag === "Inl") { return Inverse; }
            if (x._1._1._1._1.tag === "Inr") { return Strikethrough; }
          }
        }
      }
    }
    $runtime.fail();
  },
  from: x => {
    if (x === "Bold") { return Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments); }
    if (x === "Dim") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)); }
    if (x === "Italic") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))); }
    if (x === "Underline") {
      return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))));
    }
    if (x === "Inverse") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
      );
    }
    if (x === "Strikethrough") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.NoArguments))))
      );
    }
    $runtime.fail();
  }
};
const showRenderingMode = {
  show: /* #__PURE__ */ (() => {
    const $0 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Bold"});
    const $1 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Dim"});
    const $2 = (() => {
      const $2 = (() => {
        const $2 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Italic"});
        const $3 = (() => {
          const $3 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Underline"});
          const $4 = (() => {
            const $4 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Inverse"});
            const $5 = (() => {
              const $5 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Strikethrough"});
              return {
                "genericShow'": v => {
                  if (v.tag === "Inl") { return $4["genericShow'"](v._1); }
                  if (v.tag === "Inr") { return $5["genericShow'"](v._1); }
                  $runtime.fail();
                }
              };
            })();
            return {
              "genericShow'": v => {
                if (v.tag === "Inl") { return $3["genericShow'"](v._1); }
                if (v.tag === "Inr") { return $5["genericShow'"](v._1); }
                $runtime.fail();
              }
            };
          })();
          return {
            "genericShow'": v => {
              if (v.tag === "Inl") { return $2["genericShow'"](v._1); }
              if (v.tag === "Inr") { return $4["genericShow'"](v._1); }
              $runtime.fail();
            }
          };
        })();
        return {
          "genericShow'": v => {
            if (v.tag === "Inl") { return $1["genericShow'"](v._1); }
            if (v.tag === "Inr") { return $3["genericShow'"](v._1); }
            $runtime.fail();
          }
        };
      })();
      return {
        "genericShow'": v => {
          if (v.tag === "Inl") { return $0["genericShow'"](v._1); }
          if (v.tag === "Inr") { return $2["genericShow'"](v._1); }
          $runtime.fail();
        }
      };
    })();
    return x => $2["genericShow'"]((() => {
      if (x === "Bold") { return Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments); }
      if (x === "Dim") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)); }
      if (x === "Italic") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))); }
      if (x === "Underline") {
        return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))));
      }
      if (x === "Inverse") {
        return Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
        );
      }
      if (x === "Strikethrough") {
        return Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.NoArguments))))
        );
      }
      $runtime.fail();
    })());
  })()
};
const genericGraphicsParam = {
  to: x => {
    if (x.tag === "Inl") { return Reset; }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") { return $GraphicsParam("PMode", x._1._1); }
      if (x._1.tag === "Inr") {
        if (x._1._1.tag === "Inl") { return $GraphicsParam("PForeground", x._1._1._1); }
        if (x._1._1.tag === "Inr") { return $GraphicsParam("PBackground", x._1._1._1); }
      }
    }
    $runtime.fail();
  },
  from: x => {
    if (x.tag === "Reset") { return Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments); }
    if (x.tag === "PMode") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)); }
    if (x.tag === "PForeground") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1))); }
    if (x.tag === "PBackground") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", x._1))); }
    $runtime.fail();
  }
};
const genericEscapeCode = {
  to: x => {
    if (x.tag === "Inl") { return $EscapeCode("Up", x._1); }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") { return $EscapeCode("Down", x._1._1); }
      if (x._1.tag === "Inr") {
        if (x._1._1.tag === "Inl") { return $EscapeCode("Forward", x._1._1._1); }
        if (x._1._1.tag === "Inr") {
          if (x._1._1._1.tag === "Inl") { return $EscapeCode("Back", x._1._1._1._1); }
          if (x._1._1._1.tag === "Inr") {
            if (x._1._1._1._1.tag === "Inl") { return $EscapeCode("NextLine", x._1._1._1._1._1); }
            if (x._1._1._1._1.tag === "Inr") {
              if (x._1._1._1._1._1.tag === "Inl") { return $EscapeCode("PreviousLine", x._1._1._1._1._1._1); }
              if (x._1._1._1._1._1.tag === "Inr") {
                if (x._1._1._1._1._1._1.tag === "Inl") { return $EscapeCode("HorizontalAbsolute", x._1._1._1._1._1._1._1); }
                if (x._1._1._1._1._1._1.tag === "Inr") {
                  if (x._1._1._1._1._1._1._1.tag === "Inl") { return $EscapeCode("Position", x._1._1._1._1._1._1._1._1._1, x._1._1._1._1._1._1._1._1._2); }
                  if (x._1._1._1._1._1._1._1.tag === "Inr") {
                    if (x._1._1._1._1._1._1._1._1.tag === "Inl") { return $EscapeCode("EraseData", x._1._1._1._1._1._1._1._1._1); }
                    if (x._1._1._1._1._1._1._1._1.tag === "Inr") {
                      if (x._1._1._1._1._1._1._1._1._1.tag === "Inl") { return $EscapeCode("EraseLine", x._1._1._1._1._1._1._1._1._1._1); }
                      if (x._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                        if (x._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return $EscapeCode("ScrollUp", x._1._1._1._1._1._1._1._1._1._1._1); }
                        if (x._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                          if (x._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return $EscapeCode("ScrollDown", x._1._1._1._1._1._1._1._1._1._1._1._1); }
                          if (x._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                            if (x._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return $EscapeCode("Graphics", x._1._1._1._1._1._1._1._1._1._1._1._1._1); }
                            if (x._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                              if (x._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return SavePosition; }
                              if (x._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                                if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return RestorePosition; }
                                if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                                  if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return QueryPosition; }
                                  if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                                    if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return HideCursor; }
                                    if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") { return ShowCursor; }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    $runtime.fail();
  },
  from: x => {
    if (x.tag === "Up") { return Data$dGeneric$dRep.$Sum("Inl", x._1); }
    if (x.tag === "Down") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)); }
    if (x.tag === "Forward") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1))); }
    if (x.tag === "Back") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)))); }
    if (x.tag === "NextLine") {
      return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)))));
    }
    if (x.tag === "PreviousLine") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)))))
      );
    }
    if (x.tag === "HorizontalAbsolute") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)))))
        )
      );
    }
    if (x.tag === "Position") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.$Product(x._1, x._2))))
              )
            )
          )
        )
      );
    }
    if (x.tag === "EraseData") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)))))
            )
          )
        )
      );
    }
    if (x.tag === "EraseLine") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)))))
              )
            )
          )
        )
      );
    }
    if (x.tag === "ScrollUp") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1))))
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x.tag === "ScrollDown") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1))))
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x.tag === "Graphics") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1))))
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x.tag === "SavePosition") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)))
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x.tag === "RestorePosition") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum(
                              "Inr",
                              Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)))
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x.tag === "QueryPosition") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum(
                              "Inr",
                              Data$dGeneric$dRep.$Sum(
                                "Inr",
                                Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)))
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x.tag === "HideCursor") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum(
                              "Inr",
                              Data$dGeneric$dRep.$Sum(
                                "Inr",
                                Data$dGeneric$dRep.$Sum(
                                  "Inr",
                                  Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)))
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x.tag === "ShowCursor") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum(
                              "Inr",
                              Data$dGeneric$dRep.$Sum(
                                "Inr",
                                Data$dGeneric$dRep.$Sum(
                                  "Inr",
                                  Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.NoArguments)))
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    $runtime.fail();
  }
};
const genericEraseParam = {
  to: x => {
    if (x.tag === "Inl") { return ToEnd; }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") { return FromBeginning; }
      if (x._1.tag === "Inr") { return Entire; }
    }
    $runtime.fail();
  },
  from: x => {
    if (x === "ToEnd") { return Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments); }
    if (x === "FromBeginning") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)); }
    if (x === "Entire") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.NoArguments)); }
    $runtime.fail();
  }
};
const showEraseParam = {
  show: /* #__PURE__ */ (() => {
    const $0 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "ToEnd"});
    const $1 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "FromBeginning"});
    const $2 = (() => {
      const $2 = (() => {
        const $2 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Entire"});
        return {
          "genericShow'": v => {
            if (v.tag === "Inl") { return $1["genericShow'"](v._1); }
            if (v.tag === "Inr") { return $2["genericShow'"](v._1); }
            $runtime.fail();
          }
        };
      })();
      return {
        "genericShow'": v => {
          if (v.tag === "Inl") { return $0["genericShow'"](v._1); }
          if (v.tag === "Inr") { return $2["genericShow'"](v._1); }
          $runtime.fail();
        }
      };
    })();
    return x => $2["genericShow'"]((() => {
      if (x === "ToEnd") { return Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments); }
      if (x === "FromBeginning") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)); }
      if (x === "Entire") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.NoArguments)); }
      $runtime.fail();
    })());
  })()
};
const genericColor = {
  to: x => {
    if (x.tag === "Inl") { return Black; }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") { return Red; }
      if (x._1.tag === "Inr") {
        if (x._1._1.tag === "Inl") { return Green; }
        if (x._1._1.tag === "Inr") {
          if (x._1._1._1.tag === "Inl") { return Yellow; }
          if (x._1._1._1.tag === "Inr") {
            if (x._1._1._1._1.tag === "Inl") { return Blue; }
            if (x._1._1._1._1.tag === "Inr") {
              if (x._1._1._1._1._1.tag === "Inl") { return Magenta; }
              if (x._1._1._1._1._1.tag === "Inr") {
                if (x._1._1._1._1._1._1.tag === "Inl") { return Cyan; }
                if (x._1._1._1._1._1._1.tag === "Inr") {
                  if (x._1._1._1._1._1._1._1.tag === "Inl") { return White; }
                  if (x._1._1._1._1._1._1._1.tag === "Inr") {
                    if (x._1._1._1._1._1._1._1._1.tag === "Inl") { return BrightBlack; }
                    if (x._1._1._1._1._1._1._1._1.tag === "Inr") {
                      if (x._1._1._1._1._1._1._1._1._1.tag === "Inl") { return BrightRed; }
                      if (x._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                        if (x._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return BrightGreen; }
                        if (x._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                          if (x._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return BrightYellow; }
                          if (x._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                            if (x._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return BrightBlue; }
                            if (x._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                              if (x._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return BrightMagenta; }
                              if (x._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") {
                                if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inl") { return BrightCyan; }
                                if (x._1._1._1._1._1._1._1._1._1._1._1._1._1._1.tag === "Inr") { return BrightWhite; }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    $runtime.fail();
  },
  from: x => {
    if (x === "Black") { return Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments); }
    if (x === "Red") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)); }
    if (x === "Green") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))); }
    if (x === "Yellow") {
      return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))));
    }
    if (x === "Blue") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
      );
    }
    if (x === "Magenta") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
        )
      );
    }
    if (x === "Cyan") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
          )
        )
      );
    }
    if (x === "White") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
            )
          )
        )
      );
    }
    if (x === "BrightBlack") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
              )
            )
          )
        )
      );
    }
    if (x === "BrightRed") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
                )
              )
            )
          )
        )
      );
    }
    if (x === "BrightGreen") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x === "BrightYellow") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments))))
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x === "BrightBlue") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)))
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x === "BrightMagenta") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)))
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x === "BrightCyan") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum(
                              "Inr",
                              Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments)))
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    if (x === "BrightWhite") {
      return Data$dGeneric$dRep.$Sum(
        "Inr",
        Data$dGeneric$dRep.$Sum(
          "Inr",
          Data$dGeneric$dRep.$Sum(
            "Inr",
            Data$dGeneric$dRep.$Sum(
              "Inr",
              Data$dGeneric$dRep.$Sum(
                "Inr",
                Data$dGeneric$dRep.$Sum(
                  "Inr",
                  Data$dGeneric$dRep.$Sum(
                    "Inr",
                    Data$dGeneric$dRep.$Sum(
                      "Inr",
                      Data$dGeneric$dRep.$Sum(
                        "Inr",
                        Data$dGeneric$dRep.$Sum(
                          "Inr",
                          Data$dGeneric$dRep.$Sum(
                            "Inr",
                            Data$dGeneric$dRep.$Sum(
                              "Inr",
                              Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.NoArguments)))
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    $runtime.fail();
  }
};
const showColor = {
  show: /* #__PURE__ */ (() => {
    const $0 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Black"});
    const $1 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Red"});
    const $2 = (() => {
      const $2 = (() => {
        const $2 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Green"});
        const $3 = (() => {
          const $3 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Yellow"});
          const $4 = (() => {
            const $4 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Blue"});
            const $5 = (() => {
              const $5 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Magenta"});
              const $6 = (() => {
                const $6 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Cyan"});
                const $7 = (() => {
                  const $7 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "White"});
                  const $8 = (() => {
                    const $8 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightBlack"});
                    const $9 = (() => {
                      const $9 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightRed"});
                      const $10 = (() => {
                        const $10 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightGreen"});
                        const $11 = (() => {
                          const $11 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightYellow"});
                          const $12 = (() => {
                            const $12 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightBlue"});
                            const $13 = (() => {
                              const $13 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightMagenta"});
                              const $14 = (() => {
                                const $14 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightCyan"});
                                const $15 = (() => {
                                  const $15 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "BrightWhite"});
                                  return {
                                    "genericShow'": v => {
                                      if (v.tag === "Inl") { return $14["genericShow'"](v._1); }
                                      if (v.tag === "Inr") { return $15["genericShow'"](v._1); }
                                      $runtime.fail();
                                    }
                                  };
                                })();
                                return {
                                  "genericShow'": v => {
                                    if (v.tag === "Inl") { return $13["genericShow'"](v._1); }
                                    if (v.tag === "Inr") { return $15["genericShow'"](v._1); }
                                    $runtime.fail();
                                  }
                                };
                              })();
                              return {
                                "genericShow'": v => {
                                  if (v.tag === "Inl") { return $12["genericShow'"](v._1); }
                                  if (v.tag === "Inr") { return $14["genericShow'"](v._1); }
                                  $runtime.fail();
                                }
                              };
                            })();
                            return {
                              "genericShow'": v => {
                                if (v.tag === "Inl") { return $11["genericShow'"](v._1); }
                                if (v.tag === "Inr") { return $13["genericShow'"](v._1); }
                                $runtime.fail();
                              }
                            };
                          })();
                          return {
                            "genericShow'": v => {
                              if (v.tag === "Inl") { return $10["genericShow'"](v._1); }
                              if (v.tag === "Inr") { return $12["genericShow'"](v._1); }
                              $runtime.fail();
                            }
                          };
                        })();
                        return {
                          "genericShow'": v => {
                            if (v.tag === "Inl") { return $9["genericShow'"](v._1); }
                            if (v.tag === "Inr") { return $11["genericShow'"](v._1); }
                            $runtime.fail();
                          }
                        };
                      })();
                      return {
                        "genericShow'": v => {
                          if (v.tag === "Inl") { return $8["genericShow'"](v._1); }
                          if (v.tag === "Inr") { return $10["genericShow'"](v._1); }
                          $runtime.fail();
                        }
                      };
                    })();
                    return {
                      "genericShow'": v => {
                        if (v.tag === "Inl") { return $7["genericShow'"](v._1); }
                        if (v.tag === "Inr") { return $9["genericShow'"](v._1); }
                        $runtime.fail();
                      }
                    };
                  })();
                  return {
                    "genericShow'": v => {
                      if (v.tag === "Inl") { return $6["genericShow'"](v._1); }
                      if (v.tag === "Inr") { return $8["genericShow'"](v._1); }
                      $runtime.fail();
                    }
                  };
                })();
                return {
                  "genericShow'": v => {
                    if (v.tag === "Inl") { return $5["genericShow'"](v._1); }
                    if (v.tag === "Inr") { return $7["genericShow'"](v._1); }
                    $runtime.fail();
                  }
                };
              })();
              return {
                "genericShow'": v => {
                  if (v.tag === "Inl") { return $4["genericShow'"](v._1); }
                  if (v.tag === "Inr") { return $6["genericShow'"](v._1); }
                  $runtime.fail();
                }
              };
            })();
            return {
              "genericShow'": v => {
                if (v.tag === "Inl") { return $3["genericShow'"](v._1); }
                if (v.tag === "Inr") { return $5["genericShow'"](v._1); }
                $runtime.fail();
              }
            };
          })();
          return {
            "genericShow'": v => {
              if (v.tag === "Inl") { return $2["genericShow'"](v._1); }
              if (v.tag === "Inr") { return $4["genericShow'"](v._1); }
              $runtime.fail();
            }
          };
        })();
        return {
          "genericShow'": v => {
            if (v.tag === "Inl") { return $1["genericShow'"](v._1); }
            if (v.tag === "Inr") { return $3["genericShow'"](v._1); }
            $runtime.fail();
          }
        };
      })();
      return {
        "genericShow'": v => {
          if (v.tag === "Inl") { return $0["genericShow'"](v._1); }
          if (v.tag === "Inr") { return $2["genericShow'"](v._1); }
          $runtime.fail();
        }
      };
    })();
    return x => $2["genericShow'"](genericColor.from(x));
  })()
};
const showGraphicsParam = {
  show: /* #__PURE__ */ (() => {
    const $0 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "Reset"});
    const $1 = Data$dShow$dGeneric.genericShowConstructor({genericShowArgs: v => [showRenderingMode.show(v)]})({reflectSymbol: () => "PMode"});
    const $2 = (() => {
      const $2 = (() => {
        const $2 = Data$dShow$dGeneric.genericShowConstructor({genericShowArgs: v => [showColor.show(v)]})({reflectSymbol: () => "PForeground"});
        const $3 = (() => {
          const $3 = Data$dShow$dGeneric.genericShowConstructor({genericShowArgs: v => [showColor.show(v)]})({reflectSymbol: () => "PBackground"});
          return {
            "genericShow'": v => {
              if (v.tag === "Inl") { return $2["genericShow'"](v._1); }
              if (v.tag === "Inr") { return $3["genericShow'"](v._1); }
              $runtime.fail();
            }
          };
        })();
        return {
          "genericShow'": v => {
            if (v.tag === "Inl") { return $1["genericShow'"](v._1); }
            if (v.tag === "Inr") { return $3["genericShow'"](v._1); }
            $runtime.fail();
          }
        };
      })();
      return {
        "genericShow'": v => {
          if (v.tag === "Inl") { return $0["genericShow'"](v._1); }
          if (v.tag === "Inr") { return $2["genericShow'"](v._1); }
          $runtime.fail();
        }
      };
    })();
    return x => $2["genericShow'"]((() => {
      if (x.tag === "Reset") { return Data$dGeneric$dRep.$Sum("Inl", Data$dGeneric$dRep.NoArguments); }
      if (x.tag === "PMode") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1)); }
      if (x.tag === "PForeground") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inl", x._1))); }
      if (x.tag === "PBackground") { return Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", Data$dGeneric$dRep.$Sum("Inr", x._1))); }
      $runtime.fail();
    })());
  })()
};
const showEscapeCode = {
  show: /* #__PURE__ */ (() => {
    const $0 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "Up"});
    const $1 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "Down"});
    const $2 = (() => {
      const $2 = (() => {
        const $2 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "Forward"});
        const $3 = (() => {
          const $3 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "Back"});
          const $4 = (() => {
            const $4 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "NextLine"});
            const $5 = (() => {
              const $5 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "PreviousLine"});
              const $6 = (() => {
                const $6 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "HorizontalAbsolute"});
                const $7 = (() => {
                  const $7 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsProduct(genericShowArgsArgument)(genericShowArgsArgument))({
                    reflectSymbol: () => "Position"
                  });
                  const $8 = (() => {
                    const $8 = Data$dShow$dGeneric.genericShowConstructor({genericShowArgs: v => [showEraseParam.show(v)]})({reflectSymbol: () => "EraseData"});
                    const $9 = (() => {
                      const $9 = Data$dShow$dGeneric.genericShowConstructor({genericShowArgs: v => [showEraseParam.show(v)]})({reflectSymbol: () => "EraseLine"});
                      const $10 = (() => {
                        const $10 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "ScrollUp"});
                        const $11 = (() => {
                          const $11 = Data$dShow$dGeneric.genericShowConstructor(genericShowArgsArgument)({reflectSymbol: () => "ScrollDown"});
                          const $12 = (() => {
                            const $12 = Data$dShow$dGeneric.genericShowConstructor((() => {
                              const $12 = Data$dList$dTypes.showNonEmptyList(showGraphicsParam);
                              return {genericShowArgs: v => [$12.show(v)]};
                            })())({reflectSymbol: () => "Graphics"});
                            const $13 = (() => {
                              const $13 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "SavePosition"});
                              const $14 = (() => {
                                const $14 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "RestorePosition"});
                                const $15 = (() => {
                                  const $15 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "QueryPosition"});
                                  const $16 = (() => {
                                    const $16 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "HideCursor"});
                                    const $17 = (() => {
                                      const $17 = Data$dShow$dGeneric.genericShowConstructor(Data$dShow$dGeneric.genericShowArgsNoArguments)({reflectSymbol: () => "ShowCursor"});
                                      return {
                                        "genericShow'": v => {
                                          if (v.tag === "Inl") { return $16["genericShow'"](v._1); }
                                          if (v.tag === "Inr") { return $17["genericShow'"](v._1); }
                                          $runtime.fail();
                                        }
                                      };
                                    })();
                                    return {
                                      "genericShow'": v => {
                                        if (v.tag === "Inl") { return $15["genericShow'"](v._1); }
                                        if (v.tag === "Inr") { return $17["genericShow'"](v._1); }
                                        $runtime.fail();
                                      }
                                    };
                                  })();
                                  return {
                                    "genericShow'": v => {
                                      if (v.tag === "Inl") { return $14["genericShow'"](v._1); }
                                      if (v.tag === "Inr") { return $16["genericShow'"](v._1); }
                                      $runtime.fail();
                                    }
                                  };
                                })();
                                return {
                                  "genericShow'": v => {
                                    if (v.tag === "Inl") { return $13["genericShow'"](v._1); }
                                    if (v.tag === "Inr") { return $15["genericShow'"](v._1); }
                                    $runtime.fail();
                                  }
                                };
                              })();
                              return {
                                "genericShow'": v => {
                                  if (v.tag === "Inl") { return $12["genericShow'"](v._1); }
                                  if (v.tag === "Inr") { return $14["genericShow'"](v._1); }
                                  $runtime.fail();
                                }
                              };
                            })();
                            return {
                              "genericShow'": v => {
                                if (v.tag === "Inl") { return $11["genericShow'"](v._1); }
                                if (v.tag === "Inr") { return $13["genericShow'"](v._1); }
                                $runtime.fail();
                              }
                            };
                          })();
                          return {
                            "genericShow'": v => {
                              if (v.tag === "Inl") { return $10["genericShow'"](v._1); }
                              if (v.tag === "Inr") { return $12["genericShow'"](v._1); }
                              $runtime.fail();
                            }
                          };
                        })();
                        return {
                          "genericShow'": v => {
                            if (v.tag === "Inl") { return $9["genericShow'"](v._1); }
                            if (v.tag === "Inr") { return $11["genericShow'"](v._1); }
                            $runtime.fail();
                          }
                        };
                      })();
                      return {
                        "genericShow'": v => {
                          if (v.tag === "Inl") { return $8["genericShow'"](v._1); }
                          if (v.tag === "Inr") { return $10["genericShow'"](v._1); }
                          $runtime.fail();
                        }
                      };
                    })();
                    return {
                      "genericShow'": v => {
                        if (v.tag === "Inl") { return $7["genericShow'"](v._1); }
                        if (v.tag === "Inr") { return $9["genericShow'"](v._1); }
                        $runtime.fail();
                      }
                    };
                  })();
                  return {
                    "genericShow'": v => {
                      if (v.tag === "Inl") { return $6["genericShow'"](v._1); }
                      if (v.tag === "Inr") { return $8["genericShow'"](v._1); }
                      $runtime.fail();
                    }
                  };
                })();
                return {
                  "genericShow'": v => {
                    if (v.tag === "Inl") { return $5["genericShow'"](v._1); }
                    if (v.tag === "Inr") { return $7["genericShow'"](v._1); }
                    $runtime.fail();
                  }
                };
              })();
              return {
                "genericShow'": v => {
                  if (v.tag === "Inl") { return $4["genericShow'"](v._1); }
                  if (v.tag === "Inr") { return $6["genericShow'"](v._1); }
                  $runtime.fail();
                }
              };
            })();
            return {
              "genericShow'": v => {
                if (v.tag === "Inl") { return $3["genericShow'"](v._1); }
                if (v.tag === "Inr") { return $5["genericShow'"](v._1); }
                $runtime.fail();
              }
            };
          })();
          return {
            "genericShow'": v => {
              if (v.tag === "Inl") { return $2["genericShow'"](v._1); }
              if (v.tag === "Inr") { return $4["genericShow'"](v._1); }
              $runtime.fail();
            }
          };
        })();
        return {
          "genericShow'": v => {
            if (v.tag === "Inl") { return $1["genericShow'"](v._1); }
            if (v.tag === "Inr") { return $3["genericShow'"](v._1); }
            $runtime.fail();
          }
        };
      })();
      return {
        "genericShow'": v => {
          if (v.tag === "Inl") { return $0["genericShow'"](v._1); }
          if (v.tag === "Inr") { return $2["genericShow'"](v._1); }
          $runtime.fail();
        }
      };
    })();
    return x => $2["genericShow'"](genericEscapeCode.from(x));
  })()
};
const eraseParamToString = ep => {
  if (ep === "ToEnd") { return "0"; }
  if (ep === "FromBeginning") { return "1"; }
  if (ep === "Entire") { return "2"; }
  $runtime.fail();
};
const eqRenderingMode = {
  eq: x => y => {
    if (x === "Bold") { return y === "Bold"; }
    if (x === "Dim") { return y === "Dim"; }
    if (x === "Italic") { return y === "Italic"; }
    if (x === "Underline") { return y === "Underline"; }
    if (x === "Inverse") { return y === "Inverse"; }
    return x === "Strikethrough" && y === "Strikethrough";
  }
};
const ordRenderingMode = {
  compare: x => y => {
    if (x === "Bold") {
      if (y === "Bold") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Bold") { return Data$dOrdering.GT; }
    if (x === "Dim") {
      if (y === "Dim") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Dim") { return Data$dOrdering.GT; }
    if (x === "Italic") {
      if (y === "Italic") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Italic") { return Data$dOrdering.GT; }
    if (x === "Underline") {
      if (y === "Underline") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Underline") { return Data$dOrdering.GT; }
    if (x === "Inverse") {
      if (y === "Inverse") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Inverse") { return Data$dOrdering.GT; }
    if (x === "Strikethrough" && y === "Strikethrough") { return Data$dOrdering.EQ; }
    $runtime.fail();
  },
  Eq0: () => eqRenderingMode
};
const eqEraseParam = {
  eq: x => y => {
    if (x === "ToEnd") { return y === "ToEnd"; }
    if (x === "FromBeginning") { return y === "FromBeginning"; }
    return x === "Entire" && y === "Entire";
  }
};
const ordEraseParam = {
  compare: x => y => {
    if (x === "ToEnd") {
      if (y === "ToEnd") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "ToEnd") { return Data$dOrdering.GT; }
    if (x === "FromBeginning") {
      if (y === "FromBeginning") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "FromBeginning") { return Data$dOrdering.GT; }
    if (x === "Entire" && y === "Entire") { return Data$dOrdering.EQ; }
    $runtime.fail();
  },
  Eq0: () => eqEraseParam
};
const eqColor = {
  eq: x => y => {
    if (x === "Black") { return y === "Black"; }
    if (x === "Red") { return y === "Red"; }
    if (x === "Green") { return y === "Green"; }
    if (x === "Yellow") { return y === "Yellow"; }
    if (x === "Blue") { return y === "Blue"; }
    if (x === "Magenta") { return y === "Magenta"; }
    if (x === "Cyan") { return y === "Cyan"; }
    if (x === "White") { return y === "White"; }
    if (x === "BrightBlack") { return y === "BrightBlack"; }
    if (x === "BrightRed") { return y === "BrightRed"; }
    if (x === "BrightGreen") { return y === "BrightGreen"; }
    if (x === "BrightYellow") { return y === "BrightYellow"; }
    if (x === "BrightBlue") { return y === "BrightBlue"; }
    if (x === "BrightMagenta") { return y === "BrightMagenta"; }
    if (x === "BrightCyan") { return y === "BrightCyan"; }
    return x === "BrightWhite" && y === "BrightWhite";
  }
};
const eqGraphicsParam = {
  eq: x => y => {
    if (x.tag === "Reset") { return y.tag === "Reset"; }
    if (x.tag === "PMode") {
      return y.tag === "PMode" && (() => {
        if (x._1 === "Bold") { return y._1 === "Bold"; }
        if (x._1 === "Dim") { return y._1 === "Dim"; }
        if (x._1 === "Italic") { return y._1 === "Italic"; }
        if (x._1 === "Underline") { return y._1 === "Underline"; }
        if (x._1 === "Inverse") { return y._1 === "Inverse"; }
        return x._1 === "Strikethrough" && y._1 === "Strikethrough";
      })();
    }
    if (x.tag === "PForeground") { return y.tag === "PForeground" && eqColor.eq(x._1)(y._1); }
    return x.tag === "PBackground" && y.tag === "PBackground" && eqColor.eq(x._1)(y._1);
  }
};
const eq4 = x => y => eqGraphicsParam.eq(x._1)(y._1) && (() => {
  const go = v => v1 => v2 => {
    if (!v2) { return false; }
    if (v.tag === "Nil") { return v1.tag === "Nil" && v2; }
    return v.tag === "Cons" && v1.tag === "Cons" && go(v._2)(v1._2)(v2 && eqGraphicsParam.eq(v1._1)(v._1));
  };
  return go(x._2)(y._2)(true);
})();
const eqEscapeCode = {
  eq: x => y => {
    if (x.tag === "Up") { return y.tag === "Up" && x._1 === y._1; }
    if (x.tag === "Down") { return y.tag === "Down" && x._1 === y._1; }
    if (x.tag === "Forward") { return y.tag === "Forward" && x._1 === y._1; }
    if (x.tag === "Back") { return y.tag === "Back" && x._1 === y._1; }
    if (x.tag === "NextLine") { return y.tag === "NextLine" && x._1 === y._1; }
    if (x.tag === "PreviousLine") { return y.tag === "PreviousLine" && x._1 === y._1; }
    if (x.tag === "HorizontalAbsolute") { return y.tag === "HorizontalAbsolute" && x._1 === y._1; }
    if (x.tag === "Position") { return y.tag === "Position" && x._1 === y._1 && x._2 === y._2; }
    if (x.tag === "EraseData") {
      return y.tag === "EraseData" && (() => {
        if (x._1 === "ToEnd") { return y._1 === "ToEnd"; }
        if (x._1 === "FromBeginning") { return y._1 === "FromBeginning"; }
        return x._1 === "Entire" && y._1 === "Entire";
      })();
    }
    if (x.tag === "EraseLine") {
      return y.tag === "EraseLine" && (() => {
        if (x._1 === "ToEnd") { return y._1 === "ToEnd"; }
        if (x._1 === "FromBeginning") { return y._1 === "FromBeginning"; }
        return x._1 === "Entire" && y._1 === "Entire";
      })();
    }
    if (x.tag === "ScrollUp") { return y.tag === "ScrollUp" && x._1 === y._1; }
    if (x.tag === "ScrollDown") { return y.tag === "ScrollDown" && x._1 === y._1; }
    if (x.tag === "Graphics") { return y.tag === "Graphics" && eq4(x._1)(y._1); }
    if (x.tag === "SavePosition") { return y.tag === "SavePosition"; }
    if (x.tag === "RestorePosition") { return y.tag === "RestorePosition"; }
    if (x.tag === "QueryPosition") { return y.tag === "QueryPosition"; }
    if (x.tag === "HideCursor") { return y.tag === "HideCursor"; }
    return x.tag === "ShowCursor" && y.tag === "ShowCursor";
  }
};
const ordColor = {
  compare: x => y => {
    if (x === "Black") {
      if (y === "Black") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Black") { return Data$dOrdering.GT; }
    if (x === "Red") {
      if (y === "Red") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Red") { return Data$dOrdering.GT; }
    if (x === "Green") {
      if (y === "Green") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Green") { return Data$dOrdering.GT; }
    if (x === "Yellow") {
      if (y === "Yellow") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Yellow") { return Data$dOrdering.GT; }
    if (x === "Blue") {
      if (y === "Blue") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Blue") { return Data$dOrdering.GT; }
    if (x === "Magenta") {
      if (y === "Magenta") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Magenta") { return Data$dOrdering.GT; }
    if (x === "Cyan") {
      if (y === "Cyan") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Cyan") { return Data$dOrdering.GT; }
    if (x === "White") {
      if (y === "White") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "White") { return Data$dOrdering.GT; }
    if (x === "BrightBlack") {
      if (y === "BrightBlack") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "BrightBlack") { return Data$dOrdering.GT; }
    if (x === "BrightRed") {
      if (y === "BrightRed") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "BrightRed") { return Data$dOrdering.GT; }
    if (x === "BrightGreen") {
      if (y === "BrightGreen") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "BrightGreen") { return Data$dOrdering.GT; }
    if (x === "BrightYellow") {
      if (y === "BrightYellow") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "BrightYellow") { return Data$dOrdering.GT; }
    if (x === "BrightBlue") {
      if (y === "BrightBlue") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "BrightBlue") { return Data$dOrdering.GT; }
    if (x === "BrightMagenta") {
      if (y === "BrightMagenta") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "BrightMagenta") { return Data$dOrdering.GT; }
    if (x === "BrightCyan") {
      if (y === "BrightCyan") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "BrightCyan") { return Data$dOrdering.GT; }
    if (x === "BrightWhite" && y === "BrightWhite") { return Data$dOrdering.EQ; }
    $runtime.fail();
  },
  Eq0: () => eqColor
};
const ordGraphicsParam = {
  compare: x => y => {
    if (x.tag === "Reset") {
      if (y.tag === "Reset") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Reset") { return Data$dOrdering.GT; }
    if (x.tag === "PMode") {
      if (y.tag === "PMode") {
        if (x._1 === "Bold") {
          if (y._1 === "Bold") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "Bold") { return Data$dOrdering.GT; }
        if (x._1 === "Dim") {
          if (y._1 === "Dim") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "Dim") { return Data$dOrdering.GT; }
        if (x._1 === "Italic") {
          if (y._1 === "Italic") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "Italic") { return Data$dOrdering.GT; }
        if (x._1 === "Underline") {
          if (y._1 === "Underline") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "Underline") { return Data$dOrdering.GT; }
        if (x._1 === "Inverse") {
          if (y._1 === "Inverse") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "Inverse") { return Data$dOrdering.GT; }
        if (x._1 === "Strikethrough" && y._1 === "Strikethrough") { return Data$dOrdering.EQ; }
        $runtime.fail();
      }
      return Data$dOrdering.LT;
    }
    if (y.tag === "PMode") { return Data$dOrdering.GT; }
    if (x.tag === "PForeground") {
      if (y.tag === "PForeground") { return ordColor.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "PForeground") { return Data$dOrdering.GT; }
    if (x.tag === "PBackground" && y.tag === "PBackground") { return ordColor.compare(x._1)(y._1); }
    $runtime.fail();
  },
  Eq0: () => eqGraphicsParam
};
const compare4 = /* #__PURE__ */ (() => Data$dList$dTypes.ordNonEmpty(ordGraphicsParam).compare)();
const ordEscapeCode = {
  compare: x => y => {
    if (x.tag === "Up") {
      if (y.tag === "Up") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Up") { return Data$dOrdering.GT; }
    if (x.tag === "Down") {
      if (y.tag === "Down") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Down") { return Data$dOrdering.GT; }
    if (x.tag === "Forward") {
      if (y.tag === "Forward") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Forward") { return Data$dOrdering.GT; }
    if (x.tag === "Back") {
      if (y.tag === "Back") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Back") { return Data$dOrdering.GT; }
    if (x.tag === "NextLine") {
      if (y.tag === "NextLine") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "NextLine") { return Data$dOrdering.GT; }
    if (x.tag === "PreviousLine") {
      if (y.tag === "PreviousLine") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "PreviousLine") { return Data$dOrdering.GT; }
    if (x.tag === "HorizontalAbsolute") {
      if (y.tag === "HorizontalAbsolute") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "HorizontalAbsolute") { return Data$dOrdering.GT; }
    if (x.tag === "Position") {
      if (y.tag === "Position") {
        const v = Data$dOrd.ordInt.compare(x._1)(y._1);
        if (v === "LT") { return Data$dOrdering.LT; }
        if (v === "GT") { return Data$dOrdering.GT; }
        return Data$dOrd.ordInt.compare(x._2)(y._2);
      }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Position") { return Data$dOrdering.GT; }
    if (x.tag === "EraseData") {
      if (y.tag === "EraseData") {
        if (x._1 === "ToEnd") {
          if (y._1 === "ToEnd") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "ToEnd") { return Data$dOrdering.GT; }
        if (x._1 === "FromBeginning") {
          if (y._1 === "FromBeginning") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "FromBeginning") { return Data$dOrdering.GT; }
        if (x._1 === "Entire" && y._1 === "Entire") { return Data$dOrdering.EQ; }
        $runtime.fail();
      }
      return Data$dOrdering.LT;
    }
    if (y.tag === "EraseData") { return Data$dOrdering.GT; }
    if (x.tag === "EraseLine") {
      if (y.tag === "EraseLine") {
        if (x._1 === "ToEnd") {
          if (y._1 === "ToEnd") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "ToEnd") { return Data$dOrdering.GT; }
        if (x._1 === "FromBeginning") {
          if (y._1 === "FromBeginning") { return Data$dOrdering.EQ; }
          return Data$dOrdering.LT;
        }
        if (y._1 === "FromBeginning") { return Data$dOrdering.GT; }
        if (x._1 === "Entire" && y._1 === "Entire") { return Data$dOrdering.EQ; }
        $runtime.fail();
      }
      return Data$dOrdering.LT;
    }
    if (y.tag === "EraseLine") { return Data$dOrdering.GT; }
    if (x.tag === "ScrollUp") {
      if (y.tag === "ScrollUp") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "ScrollUp") { return Data$dOrdering.GT; }
    if (x.tag === "ScrollDown") {
      if (y.tag === "ScrollDown") { return Data$dOrd.ordInt.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "ScrollDown") { return Data$dOrdering.GT; }
    if (x.tag === "Graphics") {
      if (y.tag === "Graphics") { return compare4(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Graphics") { return Data$dOrdering.GT; }
    if (x.tag === "SavePosition") {
      if (y.tag === "SavePosition") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "SavePosition") { return Data$dOrdering.GT; }
    if (x.tag === "RestorePosition") {
      if (y.tag === "RestorePosition") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "RestorePosition") { return Data$dOrdering.GT; }
    if (x.tag === "QueryPosition") {
      if (y.tag === "QueryPosition") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "QueryPosition") { return Data$dOrdering.GT; }
    if (x.tag === "HideCursor") {
      if (y.tag === "HideCursor") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "HideCursor") { return Data$dOrdering.GT; }
    if (x.tag === "ShowCursor" && y.tag === "ShowCursor") { return Data$dOrdering.EQ; }
    $runtime.fail();
  },
  Eq0: () => eqEscapeCode
};
const colorSuffix = "m";
const colorCode = c => {
  if (c === "Black") { return 30; }
  if (c === "Red") { return 31; }
  if (c === "Green") { return 32; }
  if (c === "Yellow") { return 33; }
  if (c === "Blue") { return 34; }
  if (c === "Magenta") { return 35; }
  if (c === "Cyan") { return 36; }
  if (c === "White") { return 37; }
  if (c === "BrightBlack") { return 90; }
  if (c === "BrightRed") { return 91; }
  if (c === "BrightGreen") { return 92; }
  if (c === "BrightYellow") { return 93; }
  if (c === "BrightBlue") { return 94; }
  if (c === "BrightMagenta") { return 95; }
  if (c === "BrightCyan") { return 96; }
  if (c === "BrightWhite") { return 97; }
  $runtime.fail();
};
const codeForRenderingMode = m => {
  if (m === "Bold") { return 1; }
  if (m === "Dim") { return 2; }
  if (m === "Italic") { return 3; }
  if (m === "Underline") { return 4; }
  if (m === "Inverse") { return 7; }
  if (m === "Strikethrough") { return 9; }
  $runtime.fail();
};
const graphicsParamToString = gp => {
  if (gp.tag === "Reset") { return "0"; }
  if (gp.tag === "PMode") {
    return Data$dShow.showIntImpl((() => {
      if (gp._1 === "Bold") { return 1; }
      if (gp._1 === "Dim") { return 2; }
      if (gp._1 === "Italic") { return 3; }
      if (gp._1 === "Underline") { return 4; }
      if (gp._1 === "Inverse") { return 7; }
      if (gp._1 === "Strikethrough") { return 9; }
      $runtime.fail();
    })());
  }
  if (gp.tag === "PForeground") {
    return Data$dShow.showIntImpl((() => {
      if (gp._1 === "Black") { return 30; }
      if (gp._1 === "Red") { return 31; }
      if (gp._1 === "Green") { return 32; }
      if (gp._1 === "Yellow") { return 33; }
      if (gp._1 === "Blue") { return 34; }
      if (gp._1 === "Magenta") { return 35; }
      if (gp._1 === "Cyan") { return 36; }
      if (gp._1 === "White") { return 37; }
      if (gp._1 === "BrightBlack") { return 90; }
      if (gp._1 === "BrightRed") { return 91; }
      if (gp._1 === "BrightGreen") { return 92; }
      if (gp._1 === "BrightYellow") { return 93; }
      if (gp._1 === "BrightBlue") { return 94; }
      if (gp._1 === "BrightMagenta") { return 95; }
      if (gp._1 === "BrightCyan") { return 96; }
      if (gp._1 === "BrightWhite") { return 97; }
      $runtime.fail();
    })());
  }
  if (gp.tag === "PBackground") {
    return Data$dShow.showIntImpl((() => {
      if (gp._1 === "Black") { return 40; }
      if (gp._1 === "Red") { return 41; }
      if (gp._1 === "Green") { return 42; }
      if (gp._1 === "Yellow") { return 43; }
      if (gp._1 === "Blue") { return 44; }
      if (gp._1 === "Magenta") { return 45; }
      if (gp._1 === "Cyan") { return 46; }
      if (gp._1 === "White") { return 47; }
      if (gp._1 === "BrightBlack") { return 100; }
      if (gp._1 === "BrightRed") { return 101; }
      if (gp._1 === "BrightGreen") { return 102; }
      if (gp._1 === "BrightYellow") { return 103; }
      if (gp._1 === "BrightBlue") { return 104; }
      if (gp._1 === "BrightMagenta") { return 105; }
      if (gp._1 === "BrightCyan") { return 106; }
      if (gp._1 === "BrightWhite") { return 107; }
      $runtime.fail();
    })());
  }
  $runtime.fail();
};
const escapeCodeToString = x => {
  if (x.tag === "Up") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "A"; }
  if (x.tag === "Down") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "B"; }
  if (x.tag === "Forward") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "C"; }
  if (x.tag === "Back") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "D"; }
  if (x.tag === "NextLine") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "E"; }
  if (x.tag === "PreviousLine") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "F"; }
  if (x.tag === "HorizontalAbsolute") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "G"; }
  if (x.tag === "Position") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + ";" + Data$dShow.showIntImpl(x._2) + "H"; }
  if (x.tag === "EraseData") {
    if (x._1 === "ToEnd") { return "\u001b[0J"; }
    if (x._1 === "FromBeginning") { return "\u001b[1J"; }
    if (x._1 === "Entire") { return "\u001b[2J"; }
    $runtime.fail();
  }
  if (x.tag === "EraseLine") {
    if (x._1 === "ToEnd") { return "\u001b[0K"; }
    if (x._1 === "FromBeginning") { return "\u001b[1K"; }
    if (x._1 === "Entire") { return "\u001b[2K"; }
    $runtime.fail();
  }
  if (x.tag === "ScrollUp") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "S"; }
  if (x.tag === "ScrollDown") { return "\u001b[" + Data$dShow.showIntImpl(x._1) + "T"; }
  if (x.tag === "Graphics") {
    const go = go$a0$copy => go$a1$copy => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const b = go$a0, v = go$a1;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = b;
          continue;
        }
        if (v.tag === "Cons") {
          go$a0 = b.init ? {init: false, acc: v._1} : {init: false, acc: b.acc + ";" + v._1};
          go$a1 = v._2;
          continue;
        }
        $runtime.fail();
      }
      return go$r;
    };
    return "\u001b[" + go({init: false, acc: graphicsParamToString(x._1._1)})(Data$dList$dTypes.listMap(graphicsParamToString)(x._1._2)).acc + "m";
  }
  if (x.tag === "SavePosition") { return "\u001b[s"; }
  if (x.tag === "RestorePosition") { return "\u001b[u"; }
  if (x.tag === "QueryPosition") { return "\u001b[6n"; }
  if (x.tag === "HideCursor") { return "\u001b[?25l"; }
  if (x.tag === "ShowCursor") { return "\u001b[?25h"; }
  $runtime.fail();
};
export {
  $Color,
  $EraseParam,
  $EscapeCode,
  $GraphicsParam,
  $RenderingMode,
  Back,
  Black,
  Blue,
  Bold,
  BrightBlack,
  BrightBlue,
  BrightCyan,
  BrightGreen,
  BrightMagenta,
  BrightRed,
  BrightWhite,
  BrightYellow,
  Cyan,
  Dim,
  Down,
  Entire,
  EraseData,
  EraseLine,
  Forward,
  FromBeginning,
  Graphics,
  Green,
  HideCursor,
  HorizontalAbsolute,
  Inverse,
  Italic,
  Magenta,
  NextLine,
  PBackground,
  PForeground,
  PMode,
  Position,
  PreviousLine,
  QueryPosition,
  Red,
  Reset,
  RestorePosition,
  SavePosition,
  ScrollDown,
  ScrollUp,
  ShowCursor,
  Strikethrough,
  ToEnd,
  Underline,
  Up,
  White,
  Yellow,
  codeForRenderingMode,
  colorCode,
  colorSuffix,
  compare4,
  eq4,
  eqColor,
  eqEraseParam,
  eqEscapeCode,
  eqGraphicsParam,
  eqRenderingMode,
  eraseParamToString,
  escapeCodeToString,
  genericColor,
  genericEraseParam,
  genericEscapeCode,
  genericGraphicsParam,
  genericRenderingMode,
  genericShowArgsArgument,
  graphicsParamToString,
  ordColor,
  ordEraseParam,
  ordEscapeCode,
  ordGraphicsParam,
  ordRenderingMode,
  prefix,
  showColor,
  showEraseParam,
  showEscapeCode,
  showGraphicsParam,
  showRenderingMode
};
