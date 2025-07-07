import {
  $applyNodeReplacement,
  createCommand,
  LexicalCommand,
  LexicalNode,
} from "lexical"
import { MathNode } from "./MathPlugin"

export const INSERT_MATH_COMMAND: LexicalCommand<boolean> = createCommand()
export const TOGGLE_MATH_INLINE_COMMAND: LexicalCommand<void> = createCommand()
export const MATH_COMMAND: LexicalCommand<[string, ...any]> = createCommand()

export function $createMathNode(
  contents: string = "",
  inline: boolean = true,
): MathNode {
  return $applyNodeReplacement(new MathNode(contents, undefined, inline))
}

export function $isMathNode(
  node: LexicalNode | null | undefined,
): node is MathNode {
  return node instanceof MathNode
}
