import { $getSelection, $isNodeSelection, $isRangeSelection } from "lexical"
import { $isParentElementRTL } from "../../resources/playground"

export const $isRTL = () => {
  const selection = $getSelection()
  if ($isNodeSelection(selection)) {
    return false
  }
  if ($isRangeSelection(selection)) {
    return $isParentElementRTL(selection)
  }
  return false
}
