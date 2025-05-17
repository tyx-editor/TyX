import { TokenTypes } from "./symbols"
import type { TokenizedValue } from "./trie"

enum NodeTypes {
  Root = "Root",
  Const = "Const",
  ParamOne = "ParamOne", // expression with one param
  ParamTwo = "ParamTwo", // expression with two params
  Matrix = "Matrix",
  Flat = "Flat",
}

enum AlignDirection {
  Left = "l",
  Center = "c",
}

interface Node {
  type: NodeTypes
}

interface ConstNode extends Node {
  type: NodeTypes.Const
  value: string
  typst: string
}

interface RootNode extends Node {
  type: NodeTypes.Root
  body: ChildNode[]
}

interface FlatNode extends Node {
  type: NodeTypes.Flat
  body: ChildNode[]
}

interface ParamOneNode extends Node {
  type: NodeTypes.ParamOne
  params: ChildNode
  typst: string
}

interface ParamTwoNode extends Node {
  type: NodeTypes.ParamTwo
  params: [ChildNode, ChildNode]
  typst: string
}

interface MatrixNode extends Node {
  type: NodeTypes.Matrix
  params: ChildNode[][]
  lparen: string
  rparen: string
  alignment: AlignDirection
  dividerIndices: number[]
}

type ChildNode = ConstNode | MatrixNode | ParamOneNode | ParamTwoNode | FlatNode

function createRootNode(): RootNode {
  return {
    type: NodeTypes.Root,
    body: [],
  }
}
function createConstNode(): ConstNode
function createConstNode(typst: string): ConstNode
function createConstNode(token: TokenizedValue): ConstNode
function createConstNode(arg?: TokenizedValue | string) {
  if (typeof arg === "undefined") {
    return {
      type: NodeTypes.Const,
      value: "",
      typst: "",
    }
  }
  if (typeof arg === "string") {
    return {
      type: NodeTypes.Const,
      value: arg,
      typst: arg,
    }
  }
  let typst: string
  if (arg.type === TokenTypes.Text) {
    typst = arg.typst.replace(
      /^(\\quad)?(.+?)(\\quad)?$/,
      (_match, $1, $2, $3) => {
        return `${$1 || ""}\\text{${$2}}${$3 || ""}`
      },
    )
  } else {
    typst = arg.typst
  }
  return {
    type: NodeTypes.Const,
    value: arg.value,
    typst,
  }
}

function createFlatNode(): FlatNode
function createFlatNode(n: Exclude<ChildNode, FlatNode>): FlatNode
function createFlatNode(n: ChildNode[]): FlatNode
function createFlatNode(
  n?: Exclude<ChildNode, FlatNode> | ChildNode[],
): FlatNode {
  let body: ChildNode[] = []
  if (n) {
    if (Array.isArray(n)) body = n
    else body.push(n)
  }

  return {
    type: NodeTypes.Flat,
    body,
  }
}

function createMatrixNode(): MatrixNode {
  return {
    type: NodeTypes.Matrix,
    params: [],
    lparen: ".",
    rparen: ".",
    alignment: AlignDirection.Center,
    dividerIndices: [],
  }
}

function createParamOneNode(): ParamOneNode {
  return {
    type: NodeTypes.ParamOne,
    typst: "",
    params: createFlatNode(),
  }
}

function createParamTwoNode(): ParamTwoNode {
  return {
    type: NodeTypes.ParamTwo,
    typst: "",
    params: [createFlatNode(), createFlatNode()],
  }
}

function createParenOfFlatNodeFrom(
  token: TokenizedValue,
  left: boolean,
): ConstNode {
  return {
    type: NodeTypes.Const,
    value: token.value,
    typst: token.typst,
  }
}

function trimRedundantFlat(node: FlatNode): ChildNode {
  if (node.type !== NodeTypes.Flat) {
    // console.warn('The function `trimRedudantFlat` only receives Flat node, got', node.type)
    return node
  }
  if (node.body.length === 1) {
    if (node.body[0].type !== NodeTypes.Flat) return node.body[0]
    return trimRedundantFlat(node.body[0])
  }
  return node
}

function readParenedExpression2(
  tokens: TokenizedValue[],
  current: number,
): {
  node: MatrixNode | FlatNode
  current: number
} {
  const { closingIndex, isMatrix } = findPairedClosingParen(current, tokens)
  if (closingIndex === -1) {
    return parenStartedNoClosingNode(tokens, current)
  }

  if (!isMatrix) {
    // process the expression as an array
    return parenedArrayNode(tokens, current, closingIndex)
  }

  // process the expression as a matrix
  return generateMatrixNode(tokens, current, closingIndex)
}

function supportHlineFirstMatrix(tokens: TokenizedValue[], current: number) {
  // support table like
  // {:
  // --
  // | a | b |;
  // --
  // :}
  if (current + 1 >= tokens.length) return
  const t0 = tokens[current]
  const t1 = tokens[current + 1]
  if (
    t0.type === TokenTypes.Const &&
    t0.typst === "\\hline" &&
    t1.type === TokenTypes.Paren
  )
    [tokens[current], tokens[current + 1]] = [t1, t0]
}

function generateMatrixNode(
  tokens: TokenizedValue[],
  current: number,
  end: number,
) {
  let token = tokens[current]
  const node = createMatrixNode()
  const dividerIndices = new Set<number>()
  node.lparen = token.typst
  current++
  let tempArr: ChildNode[] = []
  let tempNode: ChildNode | null = null
  supportHlineFirstMatrix(tokens, current)
  token = tokens[current]
  // inside a matrix
  while (current < end) {
    token = tokens[current]
    if (token.type === TokenTypes.Split && token.value === ",") {
      if (tempNode) {
        tempArr.push(trimRedundantFlat(tempNode))
        tempNode = null
      } else {
        tempArr.push(createConstNode())
      }
      ++current
      continue
    }
    if (
      (token.type === TokenTypes.Split && token.value === ";") ||
      (token.type === TokenTypes.Align && token.typst === "\\\\")
    ) {
      if (tempNode) {
        tempArr.push(trimRedundantFlat(tempNode))
        tempNode = null
      }
      node.params.push(tempArr)
      tempArr = []
      current++
      supportHlineFirstMatrix(tokens, current)
      continue
    }
    if (token.type === TokenTypes.Paren) {
      if (tempNode) {
        tempArr.push(trimRedundantFlat(tempNode))
        tempNode = null
      }
      dividerIndices.add(tempArr.length)
      current++
      continue
    }
    tempNode = createFlatNode()
    while (
      current < end &&
      token.type !== TokenTypes.Split &&
      token.type !== TokenTypes.Paren &&
      token.type !== TokenTypes.Align
    ) {
      const walkRes = walk(tokens, current)
      current = walkRes.current
      tempNode.body.push(walkRes.node)
      token = tokens[current]
    }
  }
  // for those cases that the matrix only contains one line
  // or the last line of the matrix does not contains a semicolon
  if (tempNode) {
    tempNode = trimRedundantFlat(tempNode)
    tempArr.push(tempNode)
    tempNode = null
  }
  if (tempArr.length > 0) {
    node.params.push(tempArr)
    tempArr = []
  }
  // set dividerIndices
  node.dividerIndices = Array.from(dividerIndices).sort((a, b) => a - b)
  // process the right paren
  token = tokens[current]
  if (current < tokens.length) {
    current++
    node.rparen = token.typst
    if (token.value === ":}" && node.lparen.endsWith("lbrace"))
      node.alignment = AlignDirection.Left
  }
  // unreachable
  else {
    // no right paren
    node.rparen = token.typst
  }
  return { node, current }
}

class ParenError extends Error {}

function parenedArrayNode(
  tokens: TokenizedValue[],
  current: number,
  closingIndex: number,
) {
  let token = tokens[current]
  const node = createFlatNode()
  node.body.push(createParenOfFlatNodeFrom(token, true))
  current = readTokensToFlatNode(current + 1, closingIndex, tokens, node)
  if (current >= tokens.length)
    throw new ParenError(
      `Read index out of range at line: ${token.pos.line}, ch: ${token.pos.ch}.`,
    )

  token = tokens[current]
  current++
  node.body.push(createParenOfFlatNodeFrom(token, false))
  // if the parened array is wrapped by {: and :}, then the left and right should be invisible symbols
  if (
    (node.body[0] as ConstNode).value === "{:" &&
    (node.body[node.body.length - 1] as ConstNode).value === ":}"
  ) {
    ;(node.body[0] as ConstNode).typst = "{"
    ;(node.body[node.body.length - 1] as ConstNode).typst = "}"
  }
  return { node, current }
}

function parenStartedNoClosingNode(tokens: TokenizedValue[], current: number) {
  const token = tokens[current]
  // just process the expression as flat one
  const node = createFlatNode()
  node.body.push({
    type: NodeTypes.Const,
    value: token.value,
    typst: token.typst,
  } as ConstNode)
  current = readTokensToFlatNode(current + 1, tokens.length, tokens, node)
  // maybe it's better to add a hidden closing bracket
  node.body.push({
    type: NodeTypes.Const,
    value: ".",
    typst: ".",
  } as ConstNode)
  return { node, current }
}

function findPairedClosingParen(current: number, tokens: TokenizedValue[]) {
  let closingIndex = -1
  const stack: string[] = []
  // find the paired closing paren and whether there is any `;` within the parens
  for (let i = current + 1; i < tokens.length; i++) {
    if (tokens[i].type === TokenTypes.LParen) {
      stack.push("")
      continue
    }
    if (stack.length === 0) {
      if (tokens[i].type === TokenTypes.RParen) {
        if (closingIndex === -1) closingIndex = i
      }
      if (closingIndex !== -1) break
    } else {
      if (tokens[i].type === TokenTypes.RParen) stack.pop()
    }
  }
  const m = tokens
    .slice(current + 1, closingIndex)
    .map((token) => token.value)
    .join("")
  const isMatrix = /^(\(.*\),?)+$/.test(m)
  return { closingIndex, isMatrix }
}

function findPairedBar(
  arr: TokenizedValue[],
  start: number,
  end: number,
  targetRight: string,
): {
  semiIndex: number
  barIndex: number
} {
  let semiIndex = -1
  let barIndex = -1
  const stack: string[] = []
  for (let i = start; i < end; i++) {
    // left and right paren
    if (arr[i].type === TokenTypes.LParen) {
      stack.push("")
      continue
    }
    if (stack.length > 0 && arr[i].type === TokenTypes.RParen) {
      stack.pop()
      continue
    }
    // skip inner matrix
    if (stack.length > 0) continue
    // bar start, rparen end
    // it means that the program cannot find paired bar
    if (arr[i].type === TokenTypes.RParen) break
    // it has semicolons, then recognize it as a matrix
    if (arr[i].value === ";") {
      if (semiIndex === -1) semiIndex = i
    }
    // found the paired bar
    else if (arr[i].value === targetRight) {
      if (barIndex === -1) barIndex = i
    }
    if (semiIndex !== -1 && barIndex !== -1) break
  }
  return { semiIndex, barIndex }
}

function readBarStartedExpressions(
  tokens: TokenizedValue[],
  current: number,
): {
  node: ChildNode
  current: number
} {
  let token = tokens[current]
  // in fact only `|` and `||` matches `TokenTypes.Paren`
  const { semiIndex, barIndex } = findPairedBar(
    tokens,
    current + 1,
    tokens.length,
    token.value,
  )

  /**
   * case 1: not matrix
   * there isn't any `;` split pattern before a Paren or a RParen
   * for example `{ (x, y) | x^2 + y^2 <= 1 }`
   * then render as `\mid`
   */
  if (barIndex === -1) return createSingleBarNode(current, token)

  // used as `abs`
  if (semiIndex === -1 || semiIndex > barIndex) {
    const node = createFlatNode()
    current++
    node.body.push(createConstNode(token.typst))
    current = readTokensToFlatNode(current, barIndex, tokens, node)
    node.body.push(createConstNode(token.typst))
    current = barIndex + 1
    return { current, node }
  }

  /**
   * case 2: matrix
   * there is one or more than one `;` before a Paren or a RParen
   *
   * common cases:
   * `| 1, 2; |` or `| 1, 2; 3, 4 |`
   *
   * special case:
   * `| 1, 2, | 3, 4; 5, 6 |, 4; ... |`
   * maybe I should use a `stack` to store the parens
   * however, the case is too complex, so I won't implement it ¯\_(ツ)_/¯
   */
  const node = createMatrixNode()
  node.lparen = token.typst
  node.rparen = token.typst

  token = tokens[++current]
  let tempArr: ChildNode[] = []
  let tempNode: ChildNode | null = null
  while (current < barIndex) {
    if (token.type === TokenTypes.Split) {
      switch (token.value) {
        case ",": {
          if (tempNode) {
            if (tempNode.type === NodeTypes.Flat)
              tempNode = trimRedundantFlat(tempNode)
            tempArr.push(tempNode)
            tempNode = null
          } else {
            tempArr.push(createConstNode())
          }
          break
        }
        case ";": {
          if (tempNode) {
            // the ownership of `tempNode` is passed to `tempArr`
            if (tempNode.type === NodeTypes.Flat)
              tempNode = trimRedundantFlat(tempNode)
            tempArr.push(tempNode)
            tempNode = null
          }
          // the ownership of `tempArr` is passed to `node.params`
          node.params.push(tempArr)
          tempArr = []
          break
        }
      }
      token = tokens[++current]
      continue
    }
    // get the elements of the matrix cells
    tempNode = createFlatNode()
    token = tokens[current]
    while (current < barIndex && token.type !== TokenTypes.Split) {
      const walkRes = walk(tokens, current)
      current = walkRes.current
      tempNode.body.push(walkRes.node)
      token = tokens[current]
    }
  }
  if (tempNode) {
    tempNode = trimRedundantFlat(tempNode)
    tempArr.push(tempNode)
    tempNode = null
  }
  if (tempArr.length > 0) {
    node.params.push(tempArr)
    tempArr = []
  }
  current = barIndex + 1
  return { node, current }
}

function readTokensToFlatNode(
  current: number,
  end: number,
  tokens: TokenizedValue[],
  node: FlatNode,
) {
  while (current < end) {
    const walkRes = walk(tokens, current)
    current = walkRes.current
    node.body.push(walkRes.node)
  }
  return current
}

function createSingleBarNode(
  current: number,
  token: TokenizedValue,
): { node: ChildNode; current: number } {
  return {
    current: current + 1,
    node: {
      type: NodeTypes.Const,
      value: token.value,
      typst: token.typst === "|" ? "bar.v" : token.typst,
    },
  }
}

function removeParenOfFlatExpr(node: FlatNode): FlatNode {
  const first = node.body[0]
  const last = node.body[node.body.length - 1]
  if (
    first.type === NodeTypes.Const &&
    last.type === NodeTypes.Const &&
    (first as ConstNode).value === "(" &&
    (last as ConstNode).value === ")"
  ) {
    node.body.pop()
    node.body.shift()
  }
  return node
}

function lookForwardOperatorOptionalTwoParams(
  tokens: TokenizedValue[],
  current: number,
  token: TokenizedValue,
) {
  // cases for `-->_a^b` or `==_c^d`
  // they can have both `^` and `_`, either of them, none of them
  // so it is a little complex
  let nextToken = tokens[current]
  let p1: ChildNode = createConstNode()
  let nextShouldBe = ""
  let p1Status = ""
  let p2Status = ""
  if (nextToken.value === "^" || nextToken.value === "_") {
    nextShouldBe = nextToken.value === "^" ? "_" : "^"
    p1Status = nextToken.value
    current++
    // do not look forward
    // do not receive other sup or sub in recursion
    const walkRes = walk(tokens, current, false)
    if (walkRes.node.type === NodeTypes.Flat)
      walkRes.node = removeParenOfFlatExpr(walkRes.node)
    p1 = walkRes.node
    current = walkRes.current
  }
  let p2: ChildNode = createConstNode()
  if (current < tokens.length) {
    nextToken = tokens[current]
    if (nextToken.value === nextShouldBe) {
      p2Status = nextToken.value
      current++
      // do not look forward
      // do not receive other sup or sub in recursion
      const walkRes = walk(tokens, current, false)
      if (walkRes.node.type === NodeTypes.Flat)
        walkRes.node = removeParenOfFlatExpr(walkRes.node)
      p2 = walkRes.node
      current = walkRes.current
    }
  }
  const node = createParamTwoNode()
  node.typst = token.typst
  node.params[0] = (() => {
    if (p1Status === "^") return p1
    if (p2Status === "^") return p2
    return createConstNode()
  })()
  node.params[1] = (() => {
    if (p1Status === "_") return p1
    if (p2Status === "_") return p2
    return createConstNode()
  })()
  return { node, current }
}

function preProcessOperatorSup(
  node: ChildNode,
  operator: TokenizedValue,
  tokens: TokenizedValue[],
  current: number,
): WalkResult {
  let newNode: FlatNode
  if (node.type === NodeTypes.Flat) {
    newNode = node
  } else {
    newNode = createFlatNode()
    newNode.body.push(node)
  }
  const supNode = createParamOneNode()
  supNode.typst = operator.typst
  // do not look forward
  // avoid receiving fractions or other nodes as sup node
  const walkRes = walk(tokens, current, false)
  current = walkRes.current
  if (walkRes.node.type === NodeTypes.Flat) {
    walkRes.node = removeParenOfFlatExpr(walkRes.node)
  } else if (walkRes.node.type === NodeTypes.Matrix) {
    const mat = walkRes.node
    if (mat.lparen.endsWith("(") && mat.rparen.endsWith(")")) {
      mat.lparen = ""
      mat.rparen = ""
    }
  }
  supNode.params = walkRes.node
  if (supNode.params.type === NodeTypes.Flat) {
    supNode.params = trimRedundantFlat(supNode.params)
  }
  newNode.body.push(supNode)
  node = trimRedundantFlat(newNode)
  return { node, current }
}

function preProcessOperatorAO(node: ChildNode, nextToken: TokenizedValue) {
  const newNode = createParamOneNode()
  // if (node.type === NodeTypes.Flat)
  //   node = removeParenOfFlatExpr(node)
  newNode.params = node
  newNode.typst = nextToken.typst
  node = newNode
  return node
}

function preProcessOperatorAOB(
  node: ChildNode,
  operator: TokenizedValue,
  tokens: TokenizedValue[],
  current: number,
): WalkResult {
  const newNode = createParamTwoNode()
  if (node.type === NodeTypes.Flat)
    node = trimRedundantFlat(removeParenOfFlatExpr(node))
  newNode.typst = operator.typst
  newNode.params[0] = node
  const walkRes = walk(tokens, current)
  current = walkRes.current
  if (walkRes.node.type === NodeTypes.Flat)
    walkRes.node = trimRedundantFlat(removeParenOfFlatExpr(walkRes.node))
  newNode.params[1] = walkRes.node
  node = newNode
  return { node, current }
}

function getParamOneNode(
  tokens: TokenizedValue[],
  current: number,
  lookForward: boolean,
): { node: ParamOneNode; current: number } {
  const node = createParamOneNode()
  const token = tokens[current]
  node.typst = token.typst
  current++
  const walkRes = walk(tokens, current, lookForward)
  current = walkRes.current
  if (walkRes.node.type === NodeTypes.Flat)
    walkRes.node = trimRedundantFlat(removeParenOfFlatExpr(walkRes.node))

  node.params = walkRes.node
  return { node, current }
}

function generateMinusNode(
  tokens: TokenizedValue[],
  current: number,
): { node: ChildNode; current: number } {
  // the minus token
  const token = tokens[current]
  // the previous token is not `_`, `^` or some other operators
  // just throw `-` as a ConstNode
  if (current > 0) {
    const prevToken = tokens[current - 1]
    if (
      prevToken.type !== TokenTypes.OperatorSup &&
      prevToken.type !== TokenTypes.OperatorOA &&
      prevToken.type !== TokenTypes.OperatorOAB &&
      prevToken.type !== TokenTypes.OperatorAOB
    )
      return { node: createConstNode(token.value), current: current + 1 }
  }
  // operator is at the beginning
  else {
    return { node: createConstNode(token.value), current: current + 1 }
  }
  current++
  // out of boundary
  if (current >= tokens.length)
    return { node: createConstNode(token.value), current }

  // the next token is right paren, just skip and throw as `-`
  const nextToken = tokens[current]
  if (nextToken.type === TokenTypes.RParen)
    return { node: createConstNode(token.value), current }

  // get the next node of operator minus
  const walkRes = walk(tokens, current, true)
  current = walkRes.current
  // // However, we should not remove the node's parens, since there is a `-` before it.
  // // Removing the parens would transform `-(x+y)` to `-x+y`
  // if (walkRes.node.type === NodeTypes.Flat
  //   && token.type !== TokenTypes.OperatorMinus)
  //   walkRes.node = removeParenOfFlatExpr(walkRes.node)
  const node = createParamOneNode()
  node.typst = token.typst
  node.params = walkRes.node
  return { node, current }
}

function createDeriUpperNode(
  operator: string,
  sup: ChildNode | null,
  fn: ChildNode,
): ChildNode {
  const upperNode = createFlatNode()
  // partial or derivate
  upperNode.body.push(createConstNode(operator))
  // superscript
  if (sup) upperNode.body.push(sup)
  // function
  upperNode.body.push(fn)
  return upperNode
}

function insertOperatorsForDenominator(
  node: FlatNode,
  operator: string,
): FlatNode {
  return createFlatNode(
    node.body.flatMap((v) => [createConstNode(operator), v]),
  )
}

function getPartialDerivativeExpressionNode(
  tokens: TokenizedValue[],
  current: number,
): WalkResult {
  const node = createParamTwoNode()
  let token = tokens[current]
  node.typst = "\\frac{ $1 }{ $2 }"
  // the operator should be `\partial` or `\mathrm{d}`
  const operator = token.typst
  let sup: ChildNode | null = null
  // find if there is any superscript
  current++
  if (current >= tokens.length) return { node, current }

  token = tokens[current]
  if (token.type === TokenTypes.OperatorSup) {
    const walkRes = getParamOneNode(tokens, current, false)
    current = walkRes.current
    sup = walkRes.node
  }

  // pp^2 f (x y)
  //      ^
  const fnRes = walk(tokens, current, true)
  current = fnRes.current
  if (fnRes.node.type === NodeTypes.Flat)
    fnRes.node = removeParenOfFlatExpr(fnRes.node)
  // generate `\partial f`
  node.params[0] = createDeriUpperNode(operator, sup, fnRes.node)

  // out of boundary
  if (current >= tokens.length) return { node, current }

  // pp^2 f (x y)
  //        ^^^^^
  const underRes = walk(tokens, current)
  current = underRes.current
  if (underRes.node.type === NodeTypes.Flat) {
    underRes.node = removeParenOfFlatExpr(underRes.node)
    // generate `\partial x \patrial y`
    underRes.node = insertOperatorsForDenominator(underRes.node, operator)
  } else {
    // pp f x
    underRes.node = createFlatNode(underRes.node)
    // pp f x => (partial f) / (partial x)
    underRes.node.body.unshift(createConstNode(operator))
    // pp^2 f x => (partial^2 f) / (partial x^2)
    //   ^^   ^
    if (sup) underRes.node.body.push(sup)
  }
  node.params[1] = underRes.node

  return { node, current }
}

interface WalkResult {
  node: ChildNode
  current: number
}

function walk(
  tokens: TokenizedValue[],
  current: number,
  watchNext = true,
): WalkResult {
  if (current >= tokens.length) return { node: createConstNode(), current }
  const token = tokens[current]
  let node: ChildNode
  switch (token.type) {
    case TokenTypes.Const:
    case TokenTypes.Text:
    case TokenTypes.NumberLiteral:
    case TokenTypes.StringLiteral: {
      current++
      node = createConstNode(token)
      break
    }
    case TokenTypes.LParen: {
      ;({ node, current } = readParenedExpression2(tokens, current))
      break
    }
    case TokenTypes.Paren: {
      ;({ node, current } = readBarStartedExpressions(tokens, current))
      break
    }
    case TokenTypes.OperatorSup:
    case TokenTypes.OperatorOA: {
      // high priority, do not look forward
      ;({ node, current } = getParamOneNode(tokens, current, false))
      break
    }
    case TokenTypes.OperatorMinus: {
      ;({ node, current } = generateMinusNode(tokens, current))
      break
    }
    case TokenTypes.OperatorOAB: {
      node = createParamTwoNode()
      node.typst = token.typst
      current++
      const param0 = walk(tokens, current)
      current = param0.current
      if (param0.node.type === NodeTypes.Flat)
        param0.node = trimRedundantFlat(removeParenOfFlatExpr(param0.node))
      node.params[0] = param0.node
      const param1 = walk(tokens, current)
      current = param1.current
      if (param1.node.type === NodeTypes.Flat)
        param1.node = trimRedundantFlat(removeParenOfFlatExpr(param1.node))
      node.params[1] = param1.node
      break
    }
    case TokenTypes.OperatorO2: {
      current++
      if (current >= tokens.length) {
        node = createConstNode(
          `${token.typst.replace(/[\{\[] \$\d+ [\}\]]/g, "")}{}`,
        )
        break
      }

      // detect next token
      ;({ node, current } = lookForwardOperatorOptionalTwoParams(
        tokens,
        current,
        token,
      ))
      break
    }
    case TokenTypes.OperatorPartial: {
      ;({ node, current } = getPartialDerivativeExpressionNode(tokens, current))
      break
    }
    case TokenTypes.Split:
    case TokenTypes.Align: {
      current++
      node = createConstNode(token)
      break
    }
    case TokenTypes.RParen: {
      current++
      node = createConstNode(token)
      break
    }
    default: {
      throw new Error(
        `Unmatched token \`${token.value}\` at line: ${token.pos.line}, ch: ${token.pos.ch}.`,
      )
    }
  }
  // watch next token
  if (current < tokens.length && watchNext) {
    let matched = true
    while (matched && current < tokens.length) {
      const nextToken = tokens[current]
      switch (nextToken.type) {
        case TokenTypes.OperatorAOB: {
          ;({ node, current } = preProcessOperatorAOB(
            node,
            nextToken,
            tokens,
            current + 1,
          ))
          break
        }
        case TokenTypes.OperatorAO: {
          node = preProcessOperatorAO(node, nextToken)
          current++
          break
        }
        case TokenTypes.OperatorSup: {
          ;({ node, current } = preProcessOperatorSup(
            node,
            nextToken,
            tokens,
            current + 1,
          ))
          break
        }
        default: {
          matched = false
        }
      }
    }
  }
  return { node, current }
}

function parser(tokens: TokenizedValue[]) {
  const root = createRootNode()
  let current = 0

  while (current < tokens.length) {
    const walkRes = walk(tokens, current)
    current = walkRes.current
    root.body.push(walkRes.node)
  }

  return root
}

export {
  AlignDirection,
  NodeTypes,
  parser,
  type ChildNode,
  type ConstNode,
  type FlatNode,
  type MatrixNode,
  type Node,
  type ParamOneNode,
  type ParamTwoNode,
  type RootNode,
}

export {
  createConstNode,
  createDeriUpperNode,
  createFlatNode,
  createMatrixNode,
  createParamOneNode,
  createParamTwoNode,
  createParenOfFlatNodeFrom,
  createRootNode,
  createSingleBarNode,
}
