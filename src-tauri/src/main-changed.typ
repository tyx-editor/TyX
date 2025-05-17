#show: html.frame

#let edit-box = context [
  #let _2 = measure($2$)
  #box(
    width: _2.width,
    height: _2.height,
    stroke: (
      thickness: 1pt,
      paint: rgb("ec9bad"),
      dash: "densely-dashed",
    ),
  ) <tyx-edit-box>
]

#set text(size: 2em, fill: rgb("fefefe"))

// , t: #edit-box, b: #edit-box
$attach(x, tr: 2, br: #edit-box, bl: #edit-box, tl: #edit-box) + y^2 = z^2$
