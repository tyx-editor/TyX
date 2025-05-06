export const separator = (separator: string) => (json: any) =>
  json.map(mathjson2typst).join(separator)

export const converters: Record<string, (json: any) => string> = {
  Power: (json) => `${mathjson2typst(json[0])}^${mathjson2typst(json[1])}`,
  Add: separator("+"),
  Multiply: separator(""),
  InvisibleOperator: separator(""),
  Sequence: separator(""),
  Matrix: (json) =>
    `mat(${json[0]
      .slice(1)
      .map((l: any) => l.slice(1).map(mathjson2typst).join(","))
      .join(";")})`,
  Rational: (json) =>
    `(${mathjson2typst(json[0])})/(${mathjson2typst(json[1])})`,
  Divide: (json) => `(${mathjson2typst(json[0])})/(${mathjson2typst(json[1])})`,
  PlusMinus: (json) =>
    mathjson2typst(json[0]) + " plus.minus " + mathjson2typst(json[1]),
  List: (json) => `[${json.map(mathjson2typst).join(",")}]`,
  Delimiter: (json) => `(${json.map(mathjson2typst).join(",")})`,
  Tuple: (json) => `(${json.map(mathjson2typst).join(",")})`,
  Set: (json) => `{${json.map(mathjson2typst).join(",")}}`,
  Equal: separator("="),
  LessEqual: separator("<="),
  Less: separator("<"),
  GreaterEqual: separator(">="),
  Greater: separator(">"),
  Negate: (json) => "-" + mathjson2typst(json[0]),
  Element: separator(" in "),
  Nothing: () => "",
}

const mathjson2typst = (json: any): string => {
  if (typeof json === "string" || typeof json === "number") {
    return json.toString()
  }

  const converter = converters[json[0]]
  if (!converter) {
    throw Error(`Unsupported MathJSON type '${json[0]}'`)
  }

  return converter(json.slice(1))
}

export default mathjson2typst
