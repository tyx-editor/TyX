import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"

const FunctionCallNode = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper className={`function-call ${props.node.type.name}`}>
      <span contentEditable={false}>{props.node.attrs.name}</span>

      <NodeViewContent />
    </NodeViewWrapper>
  )
}

export default FunctionCallNode
