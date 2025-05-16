import { codegen } from "./codegen"
import { parser } from "./parser"
import type { SymbolValueType } from "./symbols"
import { TokenTypes } from "./symbols"
import type { Trie } from "./trie"
import { createTrie } from "./trie"

type ReplaceLaw = [
  RegExp | string,
  string | ((substring: string, ...args: any[]) => string),
]

interface AsciiMathConfig {
  /**
   * @default true
   * enable displayMode in KaTeX
   */
  display?: boolean
  /**
   * Extend tokens of asciimath
   * ```ts
   * {
   *   // Simply transform `d0` to `d theta`
   *   'd0': { type: TokenTypes.Const, typst: '{\\text{d}\\theta}' },
   *   // Token with unary symbol, the `$1` will be replaced with the following symbol
   *   'tsc': { type: TokenTypes.OperatorOA, typst: '\\textsc{$1}' },
   *   // Token with binary symbols, the `$1` and `$2` will be replaced with the following two symbols
   *   'frac': { type: TokenTypes.OperatorOAB, typst: '\\frac{ $1 }{ $2 }' },
   *   // Infix expression, the `$1` and `$2` will be replaced with the previous symbol and next symbol respectively
   *   'over': { type: TokenTypes.OperatorAOB, typst: '{ $1 \\over $2 }' },
   * }
   * ```
   *
   * You can extend the token types mentioned above, but it is *not recommended* to extend all types of [`enum TokenTypes`](https://github.com/widcardw/asciimath-parser/blob/main/packages/core/src/symbols.ts#L1-L20).
   */
  symbols?: Array<[string, SymbolValueType]> | Record<string, SymbolValueType>
  /**
   * Replace target expressions before tokenizing
   * ```ts
   * [
   *   [/&#(x?[0-9a-fA-F]+);/g, (match, $1) =>
   *     String.fromCodePoint($1[0] === 'x' ? '0' + $1 : $1)
   *   ],
   *   ...
   * ]
   * ```
   */
  replaceBeforeTokenizing?: ReplaceLaw[]
}

interface RestrictedAmConfig extends Required<AsciiMathConfig> {
  symbols: Record<string, SymbolValueType>
}

function resolveConfig(config?: AsciiMathConfig): RestrictedAmConfig {
  const defaultConfig: RestrictedAmConfig = {
    display: true,
    symbols: {
      dx: { type: TokenTypes.Const, typst: "dif x" },
      dy: { type: TokenTypes.Const, typst: "dif y" },
      dz: { type: TokenTypes.Const, typst: "dif z" },
      dt: { type: TokenTypes.Const, typst: "dif t" },
    },
    replaceBeforeTokenizing: [
      [
        /&#(x?[0-9a-fA-F]+);/g,
        (_match, $1) => String.fromCodePoint($1[0] === "x" ? `0${$1}` : $1),
      ],
    ],
  }
  if (typeof config?.display !== "undefined")
    defaultConfig.display = config.display
  if (config?.symbols) {
    if (Array.isArray(config.symbols)) {
      config.symbols.forEach(([k, v]) => {
        defaultConfig.symbols[k] = v
      })
    } else {
      defaultConfig.symbols = { ...defaultConfig.symbols, ...config.symbols }
    }
  }
  if (config?.replaceBeforeTokenizing?.length)
    defaultConfig.replaceBeforeTokenizing.push(
      ...config.replaceBeforeTokenizing,
    )

  return defaultConfig
}

class AsciiMath {
  private trie: Trie
  private replaceLaws: ReplaceLaw[]
  constructor(config?: AsciiMathConfig) {
    const { symbols, replaceBeforeTokenizing: replaceBeforeParsing } =
      resolveConfig(config)
    this.trie = createTrie({ symbols })
    this.replaceLaws = replaceBeforeParsing
  }

  toTypst(code: string): string {
    try {
      code = this.replaceLaws.reduce((prev, curLaw) => {
        // @ts-expect-error do not check replacement type
        return prev.replaceAll(curLaw[0], curLaw[1])
      }, code)
      return codegen(parser(this.trie.tryParsingAll(code)))
    } catch (e) {
      return JSON.stringify(String(e))
    }
  }
}

const am = new AsciiMath()

const asciimath2typst = (asciimath: string) => am.toTypst(asciimath)

export default asciimath2typst
