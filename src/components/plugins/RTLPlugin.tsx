import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isAtNodeEnd } from "@lexical/selection"
import { mergeRegister } from "@lexical/utils"
import {
  $createNodeSelection,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
} from "lexical"
import { useEffect } from "react"
import { $isParentElementRTL } from "../../resources/playground"
import { $isMathNode } from "./math"

const callback = (forward: boolean) => {
  const selection = $getSelection()
  if (!$isRangeSelection(selection) || !$isParentElementRTL(selection)) {
    return false
  }

  if (
    !(forward ? $isAtNodeEnd(selection.focus) : selection.focus.offset === 0)
  ) {
    return false
  }

  const toSelect = forward
    ? selection.focus.getNode().getNextSibling()
    : selection.focus.getNode().getPreviousSibling()
  if (!$isMathNode(toSelect)) {
    return false
  }

  const newSelection = $createNodeSelection()
  newSelection.add(toSelect.getKey())
  $setSelection(newSelection)
  return true
}

const RTLPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        () => callback(false),
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        () => callback(true),
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return null
}

export default RTLPlugin
