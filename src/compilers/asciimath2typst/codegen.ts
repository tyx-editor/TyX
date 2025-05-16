import type { ChildNode, MatrixNode, RootNode } from "./parser"
import { NodeTypes } from "./parser"

function getArrayBoundary(node: MatrixNode) {
  const div = node.dividerIndices
  let beginArray = `mat(delim: "${node.lparen}", `
  // const ch = node.alignment

  // if (div.length) {
  // const divMax = div[div.length - 1]
  // transform divider indices to col numbers between two divider
  // [2, 4, 5] -> [2, 2, 1]
  // for (let i = div.length - 1; i >= 1; i--) div[i] -= div[i - 1]

  // [2, 2, 1] -> {cc|cc|c|
  // TODO
  // beginArray += "{"
  // for (let i = 0; i < div.length; i++) beginArray += `${ch.repeat(div[i])}|`

  // MathJax would complain if the array env arg
  // is not consistent with the number of elements of the matrix row.
  // For example, the matrix is like
  // [a, b | c;
  //  d, e | f]
  // if the array env arg is `\begin{array}{cc|}`, the bar won't render correctly.
  // Change it to `\begin{array}{cc|c}` should fix this problem.
  // const maxCol = Math.max(...node.params.map((i) => i.length))
  // {cc|cc|c| -> {cc|cc|c|...c}
  // TODO
  // beginArray += `${ch.repeat(maxCol - divMax)}}`
  // } else {
  // TODO
  // const maxCol = Math.max(...node.params.map((c) => c.length))
  // beginArray += `{${ch.repeat(maxCol)}}`
  // }

  return [beginArray, ")"]
}

function codegen(node: ChildNode | RootNode): string {
  switch (node.type) {
    case NodeTypes.Const: {
      return node.typst
    }
    case NodeTypes.Root:
    case NodeTypes.Flat: {
      return node.body.map(codegen).join(" ")
    }
    case NodeTypes.Matrix: {
      const [arrayBegin, arrayEnd] = getArrayBoundary(node)
      return [
        arrayBegin,
        node.params.map((i) => i.map(codegen).join(" ; ")).join(" \\\\ "),
        arrayEnd,
      ].join("")
    }
    case NodeTypes.ParamOne: {
      return node.typst.replace("$1", codegen(node.params))
    }
    case NodeTypes.ParamTwo: {
      return node.typst
        .replace("$1", codegen(node.params[0]))
        .replace("$2", codegen(node.params[1]))
    }
  }
}

export { codegen }
