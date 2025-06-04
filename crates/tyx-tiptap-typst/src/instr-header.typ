#let _tyx_instr(body, span: "1") = {
  html.elem("span", attrs: ("data-instr": "l", "data-span": span))
  [#body]
  html.elem("span", attrs: ("data-instr": "r", "data-span": span))
}
