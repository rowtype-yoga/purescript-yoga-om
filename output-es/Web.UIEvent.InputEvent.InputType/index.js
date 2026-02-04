import * as $runtime from "../runtime.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dOrdering from "../Data.Ordering/index.js";
const $InputType = (tag, _1) => ({tag, _1});
const InsertText = /* #__PURE__ */ $InputType("InsertText");
const InsertReplacementText = /* #__PURE__ */ $InputType("InsertReplacementText");
const InsertLineBreak = /* #__PURE__ */ $InputType("InsertLineBreak");
const InsertParagraph = /* #__PURE__ */ $InputType("InsertParagraph");
const InsertOrderedList = /* #__PURE__ */ $InputType("InsertOrderedList");
const InsertUnorderedList = /* #__PURE__ */ $InputType("InsertUnorderedList");
const InsertHorizontalRule = /* #__PURE__ */ $InputType("InsertHorizontalRule");
const InsertFromYank = /* #__PURE__ */ $InputType("InsertFromYank");
const InsertFromDrop = /* #__PURE__ */ $InputType("InsertFromDrop");
const InsertFromPaste = /* #__PURE__ */ $InputType("InsertFromPaste");
const InsertFromPasteAsQuotation = /* #__PURE__ */ $InputType("InsertFromPasteAsQuotation");
const InsertTranspose = /* #__PURE__ */ $InputType("InsertTranspose");
const InsertCompositionText = /* #__PURE__ */ $InputType("InsertCompositionText");
const InsertLink = /* #__PURE__ */ $InputType("InsertLink");
const DeleteWordBackward = /* #__PURE__ */ $InputType("DeleteWordBackward");
const DeleteWordForward = /* #__PURE__ */ $InputType("DeleteWordForward");
const DeleteSoftLineBackward = /* #__PURE__ */ $InputType("DeleteSoftLineBackward");
const DeleteSoftLineForward = /* #__PURE__ */ $InputType("DeleteSoftLineForward");
const DeleteEntireSoftLine = /* #__PURE__ */ $InputType("DeleteEntireSoftLine");
const DeleteHardLineBackward = /* #__PURE__ */ $InputType("DeleteHardLineBackward");
const DeleteHardLineForward = /* #__PURE__ */ $InputType("DeleteHardLineForward");
const DeleteByDrag = /* #__PURE__ */ $InputType("DeleteByDrag");
const DeleteByCut = /* #__PURE__ */ $InputType("DeleteByCut");
const DeleteContent = /* #__PURE__ */ $InputType("DeleteContent");
const DeleteContentBackward = /* #__PURE__ */ $InputType("DeleteContentBackward");
const DeleteContentForward = /* #__PURE__ */ $InputType("DeleteContentForward");
const HistoryUndo = /* #__PURE__ */ $InputType("HistoryUndo");
const HistoryRedo = /* #__PURE__ */ $InputType("HistoryRedo");
const FormatBold = /* #__PURE__ */ $InputType("FormatBold");
const FormatItalic = /* #__PURE__ */ $InputType("FormatItalic");
const FormatUnderline = /* #__PURE__ */ $InputType("FormatUnderline");
const FormatStrikeThrough = /* #__PURE__ */ $InputType("FormatStrikeThrough");
const FormatSuperscript = /* #__PURE__ */ $InputType("FormatSuperscript");
const FormatSubscript = /* #__PURE__ */ $InputType("FormatSubscript");
const FormatJustifyFull = /* #__PURE__ */ $InputType("FormatJustifyFull");
const FormatJustifyCenter = /* #__PURE__ */ $InputType("FormatJustifyCenter");
const FormatJustifyRight = /* #__PURE__ */ $InputType("FormatJustifyRight");
const FormatJustifyLeft = /* #__PURE__ */ $InputType("FormatJustifyLeft");
const FormatIndent = /* #__PURE__ */ $InputType("FormatIndent");
const FormatOutdent = /* #__PURE__ */ $InputType("FormatOutdent");
const FormatRemove = /* #__PURE__ */ $InputType("FormatRemove");
const FormatSetBlockTextDirection = /* #__PURE__ */ $InputType("FormatSetBlockTextDirection");
const FormatSetInlineTextDirection = /* #__PURE__ */ $InputType("FormatSetInlineTextDirection");
const FormatBackColor = /* #__PURE__ */ $InputType("FormatBackColor");
const FormatFontColor = /* #__PURE__ */ $InputType("FormatFontColor");
const FormatFontName = /* #__PURE__ */ $InputType("FormatFontName");
const Other = value0 => $InputType("Other", value0);
const print = v => {
  if (v.tag === "InsertText") { return "insertText"; }
  if (v.tag === "InsertReplacementText") { return "insertReplacementText"; }
  if (v.tag === "InsertLineBreak") { return "insertLineBreak"; }
  if (v.tag === "InsertParagraph") { return "insertParagraph"; }
  if (v.tag === "InsertOrderedList") { return "insertOrderedList"; }
  if (v.tag === "InsertUnorderedList") { return "insertUnorderedList"; }
  if (v.tag === "InsertHorizontalRule") { return "insertHorizontalRule"; }
  if (v.tag === "InsertFromYank") { return "insertFromYank"; }
  if (v.tag === "InsertFromDrop") { return "insertFromDrop"; }
  if (v.tag === "InsertFromPaste") { return "insertFromPaste"; }
  if (v.tag === "InsertFromPasteAsQuotation") { return "insertFromPasteAsQuotation"; }
  if (v.tag === "InsertTranspose") { return "insertTranspose"; }
  if (v.tag === "InsertCompositionText") { return "insertCompositionText"; }
  if (v.tag === "InsertLink") { return "insertLink"; }
  if (v.tag === "DeleteWordBackward") { return "deleteWordBackward"; }
  if (v.tag === "DeleteWordForward") { return "deleteWordForward"; }
  if (v.tag === "DeleteSoftLineBackward") { return "deleteSoftLineBackward"; }
  if (v.tag === "DeleteSoftLineForward") { return "deleteSoftLineForward"; }
  if (v.tag === "DeleteEntireSoftLine") { return "deleteEntireSoftLine"; }
  if (v.tag === "DeleteHardLineBackward") { return "deleteHardLineBackward"; }
  if (v.tag === "DeleteHardLineForward") { return "deleteHardLineForward"; }
  if (v.tag === "DeleteByDrag") { return "deleteByDrag"; }
  if (v.tag === "DeleteByCut") { return "deleteByCut"; }
  if (v.tag === "DeleteContent") { return "deleteContent"; }
  if (v.tag === "DeleteContentBackward") { return "deleteContentBackward"; }
  if (v.tag === "DeleteContentForward") { return "deleteContentForward"; }
  if (v.tag === "HistoryUndo") { return "historyUndo"; }
  if (v.tag === "HistoryRedo") { return "historyRedo"; }
  if (v.tag === "FormatBold") { return "formatBold"; }
  if (v.tag === "FormatItalic") { return "formatItalic"; }
  if (v.tag === "FormatUnderline") { return "formatUnderline"; }
  if (v.tag === "FormatStrikeThrough") { return "formatStrikeThrough"; }
  if (v.tag === "FormatSuperscript") { return "formatSuperscript"; }
  if (v.tag === "FormatSubscript") { return "formatSubscript"; }
  if (v.tag === "FormatJustifyFull") { return "formatJustifyFull"; }
  if (v.tag === "FormatJustifyCenter") { return "formatJustifyCenter"; }
  if (v.tag === "FormatJustifyRight") { return "formatJustifyRight"; }
  if (v.tag === "FormatJustifyLeft") { return "formatJustifyLeft"; }
  if (v.tag === "FormatIndent") { return "formatIndent"; }
  if (v.tag === "FormatOutdent") { return "formatOutdent"; }
  if (v.tag === "FormatRemove") { return "formatRemove"; }
  if (v.tag === "FormatSetBlockTextDirection") { return "formatSetBlockTextDirection"; }
  if (v.tag === "FormatSetInlineTextDirection") { return "formatSetInlineTextDirection"; }
  if (v.tag === "FormatBackColor") { return "formatBackColor"; }
  if (v.tag === "FormatFontColor") { return "formatFontColor"; }
  if (v.tag === "FormatFontName") { return "formatFontName"; }
  if (v.tag === "Other") { return v._1; }
  $runtime.fail();
};
const showInputType = {show: print};
const parse = v => {
  if (v === "insertText") { return InsertText; }
  if (v === "insertReplacementText") { return InsertReplacementText; }
  if (v === "insertLineBreak") { return InsertLineBreak; }
  if (v === "insertParagraph") { return InsertParagraph; }
  if (v === "insertOrderedList") { return InsertOrderedList; }
  if (v === "insertUnorderedList") { return InsertUnorderedList; }
  if (v === "insertHorizontalRule") { return InsertHorizontalRule; }
  if (v === "insertFromYank") { return InsertFromYank; }
  if (v === "insertFromDrop") { return InsertFromDrop; }
  if (v === "insertFromPaste") { return InsertFromPaste; }
  if (v === "insertFromPasteAsQuotation") { return InsertFromPasteAsQuotation; }
  if (v === "insertTranspose") { return InsertTranspose; }
  if (v === "insertCompositionText") { return InsertCompositionText; }
  if (v === "insertLink") { return InsertLink; }
  if (v === "deleteWordBackward") { return DeleteWordBackward; }
  if (v === "deleteWordForward") { return DeleteWordForward; }
  if (v === "deleteSoftLineBackward") { return DeleteSoftLineBackward; }
  if (v === "deleteSoftLineForward") { return DeleteSoftLineForward; }
  if (v === "deleteEntireSoftLine") { return DeleteEntireSoftLine; }
  if (v === "deleteHardLineBackward") { return DeleteHardLineBackward; }
  if (v === "deleteHardLineForward") { return DeleteHardLineForward; }
  if (v === "deleteByDrag") { return DeleteByDrag; }
  if (v === "deleteByCut") { return DeleteByCut; }
  if (v === "deleteContent") { return DeleteContent; }
  if (v === "deleteContentBackward") { return DeleteContentBackward; }
  if (v === "deleteContentForward") { return DeleteContentForward; }
  if (v === "historyUndo") { return HistoryUndo; }
  if (v === "historyRedo") { return HistoryRedo; }
  if (v === "formatBold") { return FormatBold; }
  if (v === "formatItalic") { return FormatItalic; }
  if (v === "formatUnderline") { return FormatUnderline; }
  if (v === "formatStrikeThrough") { return FormatStrikeThrough; }
  if (v === "formatSuperscript") { return FormatSuperscript; }
  if (v === "formatSubscript") { return FormatSubscript; }
  if (v === "formatJustifyFull") { return FormatJustifyFull; }
  if (v === "formatJustifyCenter") { return FormatJustifyCenter; }
  if (v === "formatJustifyRight") { return FormatJustifyRight; }
  if (v === "formatJustifyLeft") { return FormatJustifyLeft; }
  if (v === "formatIndent") { return FormatIndent; }
  if (v === "formatOutdent") { return FormatOutdent; }
  if (v === "formatRemove") { return FormatRemove; }
  if (v === "formatSetBlockTextDirection") { return FormatSetBlockTextDirection; }
  if (v === "formatSetInlineTextDirection") { return FormatSetInlineTextDirection; }
  if (v === "formatBackColor") { return FormatBackColor; }
  if (v === "formatFontColor") { return FormatFontColor; }
  if (v === "formatFontName") { return FormatFontName; }
  return $InputType("Other", v);
};
const eqInputType = {
  eq: x => y => {
    if (x.tag === "InsertText") { return y.tag === "InsertText"; }
    if (x.tag === "InsertReplacementText") { return y.tag === "InsertReplacementText"; }
    if (x.tag === "InsertLineBreak") { return y.tag === "InsertLineBreak"; }
    if (x.tag === "InsertParagraph") { return y.tag === "InsertParagraph"; }
    if (x.tag === "InsertOrderedList") { return y.tag === "InsertOrderedList"; }
    if (x.tag === "InsertUnorderedList") { return y.tag === "InsertUnorderedList"; }
    if (x.tag === "InsertHorizontalRule") { return y.tag === "InsertHorizontalRule"; }
    if (x.tag === "InsertFromYank") { return y.tag === "InsertFromYank"; }
    if (x.tag === "InsertFromDrop") { return y.tag === "InsertFromDrop"; }
    if (x.tag === "InsertFromPaste") { return y.tag === "InsertFromPaste"; }
    if (x.tag === "InsertFromPasteAsQuotation") { return y.tag === "InsertFromPasteAsQuotation"; }
    if (x.tag === "InsertTranspose") { return y.tag === "InsertTranspose"; }
    if (x.tag === "InsertCompositionText") { return y.tag === "InsertCompositionText"; }
    if (x.tag === "InsertLink") { return y.tag === "InsertLink"; }
    if (x.tag === "DeleteWordBackward") { return y.tag === "DeleteWordBackward"; }
    if (x.tag === "DeleteWordForward") { return y.tag === "DeleteWordForward"; }
    if (x.tag === "DeleteSoftLineBackward") { return y.tag === "DeleteSoftLineBackward"; }
    if (x.tag === "DeleteSoftLineForward") { return y.tag === "DeleteSoftLineForward"; }
    if (x.tag === "DeleteEntireSoftLine") { return y.tag === "DeleteEntireSoftLine"; }
    if (x.tag === "DeleteHardLineBackward") { return y.tag === "DeleteHardLineBackward"; }
    if (x.tag === "DeleteHardLineForward") { return y.tag === "DeleteHardLineForward"; }
    if (x.tag === "DeleteByDrag") { return y.tag === "DeleteByDrag"; }
    if (x.tag === "DeleteByCut") { return y.tag === "DeleteByCut"; }
    if (x.tag === "DeleteContent") { return y.tag === "DeleteContent"; }
    if (x.tag === "DeleteContentBackward") { return y.tag === "DeleteContentBackward"; }
    if (x.tag === "DeleteContentForward") { return y.tag === "DeleteContentForward"; }
    if (x.tag === "HistoryUndo") { return y.tag === "HistoryUndo"; }
    if (x.tag === "HistoryRedo") { return y.tag === "HistoryRedo"; }
    if (x.tag === "FormatBold") { return y.tag === "FormatBold"; }
    if (x.tag === "FormatItalic") { return y.tag === "FormatItalic"; }
    if (x.tag === "FormatUnderline") { return y.tag === "FormatUnderline"; }
    if (x.tag === "FormatStrikeThrough") { return y.tag === "FormatStrikeThrough"; }
    if (x.tag === "FormatSuperscript") { return y.tag === "FormatSuperscript"; }
    if (x.tag === "FormatSubscript") { return y.tag === "FormatSubscript"; }
    if (x.tag === "FormatJustifyFull") { return y.tag === "FormatJustifyFull"; }
    if (x.tag === "FormatJustifyCenter") { return y.tag === "FormatJustifyCenter"; }
    if (x.tag === "FormatJustifyRight") { return y.tag === "FormatJustifyRight"; }
    if (x.tag === "FormatJustifyLeft") { return y.tag === "FormatJustifyLeft"; }
    if (x.tag === "FormatIndent") { return y.tag === "FormatIndent"; }
    if (x.tag === "FormatOutdent") { return y.tag === "FormatOutdent"; }
    if (x.tag === "FormatRemove") { return y.tag === "FormatRemove"; }
    if (x.tag === "FormatSetBlockTextDirection") { return y.tag === "FormatSetBlockTextDirection"; }
    if (x.tag === "FormatSetInlineTextDirection") { return y.tag === "FormatSetInlineTextDirection"; }
    if (x.tag === "FormatBackColor") { return y.tag === "FormatBackColor"; }
    if (x.tag === "FormatFontColor") { return y.tag === "FormatFontColor"; }
    if (x.tag === "FormatFontName") { return y.tag === "FormatFontName"; }
    return x.tag === "Other" && y.tag === "Other" && x._1 === y._1;
  }
};
const ordInputType = {
  compare: x => y => {
    if (x.tag === "InsertText") {
      if (y.tag === "InsertText") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertText") { return Data$dOrdering.GT; }
    if (x.tag === "InsertReplacementText") {
      if (y.tag === "InsertReplacementText") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertReplacementText") { return Data$dOrdering.GT; }
    if (x.tag === "InsertLineBreak") {
      if (y.tag === "InsertLineBreak") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertLineBreak") { return Data$dOrdering.GT; }
    if (x.tag === "InsertParagraph") {
      if (y.tag === "InsertParagraph") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertParagraph") { return Data$dOrdering.GT; }
    if (x.tag === "InsertOrderedList") {
      if (y.tag === "InsertOrderedList") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertOrderedList") { return Data$dOrdering.GT; }
    if (x.tag === "InsertUnorderedList") {
      if (y.tag === "InsertUnorderedList") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertUnorderedList") { return Data$dOrdering.GT; }
    if (x.tag === "InsertHorizontalRule") {
      if (y.tag === "InsertHorizontalRule") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertHorizontalRule") { return Data$dOrdering.GT; }
    if (x.tag === "InsertFromYank") {
      if (y.tag === "InsertFromYank") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertFromYank") { return Data$dOrdering.GT; }
    if (x.tag === "InsertFromDrop") {
      if (y.tag === "InsertFromDrop") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertFromDrop") { return Data$dOrdering.GT; }
    if (x.tag === "InsertFromPaste") {
      if (y.tag === "InsertFromPaste") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertFromPaste") { return Data$dOrdering.GT; }
    if (x.tag === "InsertFromPasteAsQuotation") {
      if (y.tag === "InsertFromPasteAsQuotation") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertFromPasteAsQuotation") { return Data$dOrdering.GT; }
    if (x.tag === "InsertTranspose") {
      if (y.tag === "InsertTranspose") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertTranspose") { return Data$dOrdering.GT; }
    if (x.tag === "InsertCompositionText") {
      if (y.tag === "InsertCompositionText") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertCompositionText") { return Data$dOrdering.GT; }
    if (x.tag === "InsertLink") {
      if (y.tag === "InsertLink") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "InsertLink") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteWordBackward") {
      if (y.tag === "DeleteWordBackward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteWordBackward") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteWordForward") {
      if (y.tag === "DeleteWordForward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteWordForward") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteSoftLineBackward") {
      if (y.tag === "DeleteSoftLineBackward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteSoftLineBackward") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteSoftLineForward") {
      if (y.tag === "DeleteSoftLineForward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteSoftLineForward") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteEntireSoftLine") {
      if (y.tag === "DeleteEntireSoftLine") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteEntireSoftLine") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteHardLineBackward") {
      if (y.tag === "DeleteHardLineBackward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteHardLineBackward") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteHardLineForward") {
      if (y.tag === "DeleteHardLineForward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteHardLineForward") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteByDrag") {
      if (y.tag === "DeleteByDrag") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteByDrag") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteByCut") {
      if (y.tag === "DeleteByCut") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteByCut") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteContent") {
      if (y.tag === "DeleteContent") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteContent") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteContentBackward") {
      if (y.tag === "DeleteContentBackward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteContentBackward") { return Data$dOrdering.GT; }
    if (x.tag === "DeleteContentForward") {
      if (y.tag === "DeleteContentForward") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "DeleteContentForward") { return Data$dOrdering.GT; }
    if (x.tag === "HistoryUndo") {
      if (y.tag === "HistoryUndo") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "HistoryUndo") { return Data$dOrdering.GT; }
    if (x.tag === "HistoryRedo") {
      if (y.tag === "HistoryRedo") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "HistoryRedo") { return Data$dOrdering.GT; }
    if (x.tag === "FormatBold") {
      if (y.tag === "FormatBold") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatBold") { return Data$dOrdering.GT; }
    if (x.tag === "FormatItalic") {
      if (y.tag === "FormatItalic") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatItalic") { return Data$dOrdering.GT; }
    if (x.tag === "FormatUnderline") {
      if (y.tag === "FormatUnderline") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatUnderline") { return Data$dOrdering.GT; }
    if (x.tag === "FormatStrikeThrough") {
      if (y.tag === "FormatStrikeThrough") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatStrikeThrough") { return Data$dOrdering.GT; }
    if (x.tag === "FormatSuperscript") {
      if (y.tag === "FormatSuperscript") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatSuperscript") { return Data$dOrdering.GT; }
    if (x.tag === "FormatSubscript") {
      if (y.tag === "FormatSubscript") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatSubscript") { return Data$dOrdering.GT; }
    if (x.tag === "FormatJustifyFull") {
      if (y.tag === "FormatJustifyFull") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatJustifyFull") { return Data$dOrdering.GT; }
    if (x.tag === "FormatJustifyCenter") {
      if (y.tag === "FormatJustifyCenter") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatJustifyCenter") { return Data$dOrdering.GT; }
    if (x.tag === "FormatJustifyRight") {
      if (y.tag === "FormatJustifyRight") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatJustifyRight") { return Data$dOrdering.GT; }
    if (x.tag === "FormatJustifyLeft") {
      if (y.tag === "FormatJustifyLeft") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatJustifyLeft") { return Data$dOrdering.GT; }
    if (x.tag === "FormatIndent") {
      if (y.tag === "FormatIndent") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatIndent") { return Data$dOrdering.GT; }
    if (x.tag === "FormatOutdent") {
      if (y.tag === "FormatOutdent") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatOutdent") { return Data$dOrdering.GT; }
    if (x.tag === "FormatRemove") {
      if (y.tag === "FormatRemove") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatRemove") { return Data$dOrdering.GT; }
    if (x.tag === "FormatSetBlockTextDirection") {
      if (y.tag === "FormatSetBlockTextDirection") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatSetBlockTextDirection") { return Data$dOrdering.GT; }
    if (x.tag === "FormatSetInlineTextDirection") {
      if (y.tag === "FormatSetInlineTextDirection") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatSetInlineTextDirection") { return Data$dOrdering.GT; }
    if (x.tag === "FormatBackColor") {
      if (y.tag === "FormatBackColor") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatBackColor") { return Data$dOrdering.GT; }
    if (x.tag === "FormatFontColor") {
      if (y.tag === "FormatFontColor") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatFontColor") { return Data$dOrdering.GT; }
    if (x.tag === "FormatFontName") {
      if (y.tag === "FormatFontName") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y.tag === "FormatFontName") { return Data$dOrdering.GT; }
    if (x.tag === "Other" && y.tag === "Other") { return Data$dOrd.ordString.compare(x._1)(y._1); }
    $runtime.fail();
  },
  Eq0: () => eqInputType
};
export {
  $InputType,
  DeleteByCut,
  DeleteByDrag,
  DeleteContent,
  DeleteContentBackward,
  DeleteContentForward,
  DeleteEntireSoftLine,
  DeleteHardLineBackward,
  DeleteHardLineForward,
  DeleteSoftLineBackward,
  DeleteSoftLineForward,
  DeleteWordBackward,
  DeleteWordForward,
  FormatBackColor,
  FormatBold,
  FormatFontColor,
  FormatFontName,
  FormatIndent,
  FormatItalic,
  FormatJustifyCenter,
  FormatJustifyFull,
  FormatJustifyLeft,
  FormatJustifyRight,
  FormatOutdent,
  FormatRemove,
  FormatSetBlockTextDirection,
  FormatSetInlineTextDirection,
  FormatStrikeThrough,
  FormatSubscript,
  FormatSuperscript,
  FormatUnderline,
  HistoryRedo,
  HistoryUndo,
  InsertCompositionText,
  InsertFromDrop,
  InsertFromPaste,
  InsertFromPasteAsQuotation,
  InsertFromYank,
  InsertHorizontalRule,
  InsertLineBreak,
  InsertLink,
  InsertOrderedList,
  InsertParagraph,
  InsertReplacementText,
  InsertText,
  InsertTranspose,
  InsertUnorderedList,
  Other,
  eqInputType,
  ordInputType,
  parse,
  print,
  showInputType
};
