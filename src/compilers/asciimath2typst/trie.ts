import type { SymbolValueType } from "./symbols"
import { SYMBOLMAP, TokenTypes } from "./symbols"

interface Position {
  line: number
  ch: number
}

interface TokenizedValue {
  value: string
  isKeyWord: boolean
  current: number
  pos: Position
  typst: string
  type: TokenTypes
  eatNext?: boolean
}

interface EatenResult {
  value: string
  current: number
  pos: Position
}

const NUMBERPATTERN = /[0-9]/
const STRINGPATTERN = /\S/

type GeneTokenFn = (config: {
  current: number
  pos: Position
  value?: string
}) => TokenizedValue

const createConstToken: GeneTokenFn = (config) => {
  const { value = "", current, pos } = config
  return {
    value,
    isKeyWord: false,
    current,
    pos,
    typst: value,
    type: TokenTypes.Const,
  }
}

class Trie {
  private _root: TrieNode
  private _char_to_index: Map<string, number> = new Map()
  private _n: number

  public constructor(nodes: string[]) {
    if (nodes.length === 0)
      throw new Error("Cannot create Trie since the length of nodes is 0")

    nodes.forEach((n) => {
      if (n.length !== 1)
        throw new Error(
          `Value \`${n}\` is invalid, the length of char must be 1`
        )
    })

    const dedupped = Array.from(new Set(nodes))

    this._n = dedupped.length
    this._root = new TrieNode(this._n)
    dedupped.forEach((ch, i) => {
      this._char_to_index.set(ch, i)
    })
  }

  private c2i(key: string) {
    return this._char_to_index.get(key)
  }

  public insert(key: string) {
    if (key.length === 0) return

    let root = this._root

    ;[...key].forEach((ch, i) => {
      const idx = this.c2i(ch)
      if (typeof idx === "undefined")
        throw new Error(`key \`${ch}\` not in key set`)
      if (root._nextNode[idx] === null)
        root._nextNode[idx] = new TrieNode(this._n)
      root = root._nextNode[idx]!
      if (i === key.length - 1) root._end = true
    })
  }

  public search(word: string): boolean {
    if (!this._root._nextNode.find((i) => i !== null) || word.length === 0)
      return false
    let root = this._root
    let i = 0
    for (; i < word.length; i++) {
      const ch = word[i]
      const idx = this.c2i(ch)
      if (typeof idx === "undefined")
        throw new Error(`key \`${ch}\` not in key set`)
      if (root._nextNode[idx] === null) return false
      root = root._nextNode[idx]!
    }
    if (i === word.length) return true
    return false
  }

  /**
   * @param letters input string
   * @returns value: matched keyword
   * current: the string cursor
   */
  public tryParsing(
    letters: string[],
    start = 0,
    pos: Position = { line: 1, ch: 0 }
  ): TokenizedValue {
    let value = ""
    let root = this._root
    let isKeyWord = false
    let current = start
    // let depth = 0
    for (; current < letters.length; current++) {
      const ch = letters[current]
      // console.log('depth', depth, ch)

      // the spaces are processed in `tryParsingAll`
      // if (/\s/.test(ch)) {
      //   current++
      //   break
      // }

      const idx = this.c2i(ch)
      // cannot find key in symbol map
      if (typeof idx === "undefined") break

      if (root._nextNode[idx] === null) break

      value += ch
      root = root._nextNode[idx]!
      isKeyWord = root._end
      // depth++
    }
    const ret = (() => {
      if (isKeyWord) return SYMBOLMAP.get(value)!
      return { typst: value, type: TokenTypes.StringLiteral }
    })()
    return { value, isKeyWord, current, ...ret, pos }
  }

  public tryParsingNumber(
    letters: string[],
    current: number,
    pos: Position
  ): TokenizedValue {
    let ch = letters[current]
    let value = ""
    while (NUMBERPATTERN.test(ch) && current < letters.length) {
      value += ch
      ch = letters[++current]
    }
    if (ch === ".") {
      value += ch
      ch = letters[++current]
    }
    while (NUMBERPATTERN.test(ch) && current < letters.length) {
      value += ch
      ch = letters[++current]
    }
    return {
      value,
      isKeyWord: false,
      current,
      pos,
      typst: value,
      type: TokenTypes.NumberLiteral,
    }
  }

  public tryParsingString(
    letters: string[],
    current: number,
    pos: Position
  ): TokenizedValue {
    let ch = letters[current]
    let value = ""
    while (STRINGPATTERN.test(ch) && current < letters.length) {
      const idx = this.c2i(ch)
      if (typeof idx !== "undefined" && this._root._nextNode[idx] !== null)
        break
      value += ch
      ch = letters[++current]
    }
    return {
      value,
      isKeyWord: false,
      current,
      pos,
      typst: value,
      type: TokenTypes.StringLiteral,
    }
  }

  public tryParsingNewLines(
    letters: string[],
    current: number,
    pos: Position
  ): TokenizedValue {
    let ch = letters[current]
    let value = ""
    while (/\n/.test(ch) && current < letters.length) {
      value += ch
      ch = letters[++current]
      pos.line++
      pos.ch = 0
    }
    if (value.length >= 2)
      return {
        value,
        isKeyWord: true,
        current,
        pos,
        typst: "\\\\",
        type: TokenTypes.Align,
      }

    return {
      value: "",
      isKeyWord: false,
      current,
      pos,
      typst: "",
      type: TokenTypes.None,
    }
  }

  private getPlainTextInDoubleQuote(
    letters: string[],
    current: number,
    pos: Position
  ): EatenResult {
    let value = ""
    let ch = letters[current]
    if (ch === '"') {
      ch = letters[++current]
      while (ch !== '"' && current < letters.length) {
        value += ch
        ch = letters[++current]
      }
      if (ch === '"') {
        current++
        return { current, value, pos }
      }
    }
    return { value, current, pos }
  }

  public tryParsingText(
    letters: string[],
    current: number,
    pos: Position
  ): TokenizedValue {
    const { value, current: newCurrent } = this.getPlainTextInDoubleQuote(
      letters,
      current,
      pos
    )
    return {
      value,
      isKeyWord: false,
      current: newCurrent,
      pos,
      typst: value,
      type: TokenTypes.Text,
    }
  }

  private skipSpaces(letters: string[], current: number): number {
    while (current < letters.length) {
      const ch = letters[current]
      if (!/\s/.test(ch)) break
      current++
    }
    return current
  }

  private eatNext(
    letters: string[],
    current: number,
    pos: Position
  ): TokenizedValue {
    current = this.skipSpaces(letters, current)
    const res = createConstToken({ current, pos })
    if (current >= letters.length) return res
    let letter = letters[current]
    let value = ""
    switch (letter) {
      case '"': {
        letter = letters[++current]
        while (current < letters.length && letter !== '"') {
          value += letter
          letter = letters[++current]
        }
        // skip the right paren
        current++
        break
      }
      case "(": {
        letter = letters[++current]
        while (current < letters.length && letter !== ")") {
          value += letter
          letter = letters[++current]
        }
        // skip the right paren
        current++
        break
      }
      default: {
        while (current < letters.length && /\S/.test(letter)) {
          letter = letters[current++]
          value += letter
        }
        break
      }
    }
    res.typst = res.value = value
    res.current = current
    return res
  }

  public tryParsingAll(word: string) {
    let current = 0
    const tokens: TokenizedValue[] = []
    let counter = 0
    const letters = [...word]
    let line = 1
    let ch = 0
    while (current < letters.length) {
      {
        const t = this.tryParsingNewLines(letters, current, { line, ch })
        line = t.pos.line
        ch = t.pos.ch
        current = t.current
        if (t.value !== "") {
          tokens.push(t)
          continue
        }
      }
      // process spaces
      if (/\s/.test(letters[current])) {
        current++
        ch++
        continue
      }
      // process potential keywords
      const t = this.tryParsing(letters, current, { line, ch })
      ch += t.current - current
      current = t.current
      if (t.value !== "") {
        tokens.push(t)
        if (t.eatNext) {
          const nt = this.eatNext(letters, current, { line, ch })
          ch += nt.current - current
          current = nt.current
          tokens.push(nt)
        }
        continue
      }
      // process numbers
      {
        const t = this.tryParsingNumber(letters, current, { line, ch })
        ch += t.current - current
        current = t.current
        if (t.value !== "") {
          tokens.push(t)
          continue
        }
      }
      // process text wrapped with double quote
      {
        const t = this.tryParsingText(letters, current, { line, ch })
        ch += t.current - current
        current = t.current
        if (t.value !== "") {
          tokens.push(t)
          continue
        }
      }
      // process other string
      {
        const t = this.tryParsingString(letters, current, { line, ch })
        ch += t.current - current
        current = t.current
        if (t.value !== "") {
          tokens.push(t)
          continue
        }
      }
      counter++
      if (counter > letters.length * 2)
        throw new Error("Oops! There may be an infinity loop!")
    }
    return tokens
  }
}

class TrieNode {
  _nextNode: (TrieNode | null)[] = []
  _end = false
  constructor(n: number) {
    this._nextNode = Array.from({ length: n }, () => null)
  }
}

function createTrie(
  config: {
    // extConst?: Array<[string, string]>
    symbols?: Array<[string, SymbolValueType]> | Record<string, SymbolValueType>
  } = {}
) {
  const charset: Set<string> = new Set([])
  if (config.symbols) {
    if (Array.isArray(config.symbols)) {
      config.symbols.forEach(([k, v]) => {
        if (k.length === 0)
          throw new Error(`Cannot insert empty token! Token value: ${v}`)
        SYMBOLMAP.set(k, v)
      })
    } else {
      Object.entries(config.symbols).forEach(([k, v]) => {
        if (k.length === 0)
          throw new Error(`Cannot insert empty token! Token value: ${v}`)
        SYMBOLMAP.set(k, v)
      })
    }
  }
  for (const k of SYMBOLMAP.keys()) [...k].forEach((i) => charset.add(i))
  const chars = Array.from(charset)
  chars.push(" ")

  const trie = new Trie(chars)
  for (const k of SYMBOLMAP.keys()) trie.insert(k)

  return trie
}

export { createTrie, Trie, TrieNode, type Position, type TokenizedValue }
