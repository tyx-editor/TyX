import { getSchema } from "@tiptap/core"
import extensions from "../src/components/editor/extensions"

const spec = getSchema(extensions).spec

console.log(
  JSON.stringify({
    topNode: spec.topNode,
    nodes: spec.nodes.toObject(),
    marks: spec.marks.toObject(),
  }),
)
