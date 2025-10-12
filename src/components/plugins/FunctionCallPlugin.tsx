import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { Autocomplete, Button } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconDeviceFloppy, IconFunction, IconPlus } from "@tabler/icons-react"
import {
  $createNodeSelection,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  LexicalEditor,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { useEffect, useMemo, useState } from "react"
import { executeCommandSequence } from "../../commands"
import { stringifyFunction } from "../../compilers/lexical2typst"
import { getFunctions } from "../../functions"
import { TyXValue } from "../../models"
import { backupEditorSelection, restoreEditorSelection } from "../../utilities"
import TyXValueEditor from "../TyXValueEditor"
import CurrentEditorPlugin from "./CurrentEditorPlugin"
import {
  $createFunctionCallNode,
  $isFunctionCallNode,
  INSERT_FUNCTION_CALL_COMMAND,
} from "./functionCall"
import ImagePlugin from "./ImagePlugin"
import KeyboardMapPlugin from "./KeyboardMapPlugin"
import MathPlugin from "./MathPlugin"
import NestedEditorPlugin from "./NestedEditorPlugin"
import TypstCodePlugin from "./TypstCodePlugin"
import { UPDATE_LOCAL_STORAGE_COMMAND } from "./updateLocalStorage"

export const FunctionCallEditModal = ({
  editor,
  name: initialName,
  positionParameters: initialPositionParameters,
  namedParameters: initialNamedParameters,
  nodeKey,
}: {
  editor: LexicalEditor
  name: string
  positionParameters: TyXValue[] | undefined
  namedParameters: Record<string, TyXValue> | undefined
  nodeKey: NodeKey
}) => {
  const [name, setName] = useState("")
  const [positionParameters, setPositionParameters] = useState<TyXValue[]>([])
  const [namedParameters, setNamedParameters] = useState<
    Record<string, TyXValue>
  >({})

  useEffect(() => {
    setName(initialName)
  }, [initialName])

  useEffect(() => {
    setPositionParameters(initialPositionParameters ?? [])
  }, [initialPositionParameters])

  useEffect(() => {
    setNamedParameters(initialNamedParameters ?? {})
  }, [initialPositionParameters])

  const save = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isFunctionCallNode(node)) {
        node.setName(name)
        node.setPositionParameters(positionParameters)
        node.setNamedParameters(namedParameters)
      }
    })
    modals.closeAll()
  }

  const functions = useMemo(() => getFunctions(), [])

  return (
    <>
      <Autocomplete
        autoCapitalize="off"
        autoCorrect="off"
        label="Function"
        leftSection={<IconFunction />}
        value={name}
        onChange={setName}
        data={Object.keys(functions).sort()}
      />
      {functions[name]?.positional?.map(
        (parameterDescription, positionIndex) => (
          <TyXValueEditor
            required={parameterDescription.required}
            label={
              parameterDescription.label ?? `Parameter ${positionIndex + 1}`
            }
            documentation={parameterDescription.documentation}
            mt="xs"
            key={positionIndex}
            type={parameterDescription.type}
            value={positionParameters[positionIndex]}
            setValue={(v) => {
              const parameters: typeof positionParameters = JSON.parse(
                JSON.stringify(positionParameters),
              )
              parameters[positionIndex] = v
              setPositionParameters(parameters)
            }}
          />
        ),
      )}
      {functions[name]?.named?.map((parameterDescription, positionIndex) => (
        <TyXValueEditor
          required={parameterDescription.required}
          label={parameterDescription.label ?? parameterDescription.name}
          documentation={parameterDescription.documentation}
          mt="xs"
          key={positionIndex}
          type={parameterDescription.type}
          value={namedParameters[parameterDescription.name]}
          setValue={(v) => {
            const parameters: typeof namedParameters = JSON.parse(
              JSON.stringify(namedParameters),
            )
            parameters[parameterDescription.name] = v
            setNamedParameters(parameters)
          }}
        />
      ))}
      <Button
        mt="xs"
        fullWidth
        leftSection={<IconDeviceFloppy />}
        onClick={save}
      >
        Save changes
      </Button>
    </>
  )
}

export const FunctionCallEditor = ({
  name,
  contents,
  positionParameters,
  namedParameters,
  nodeKey,
}: {
  name: string
  positionParameters: TyXValue[] | undefined
  namedParameters: Record<string, TyXValue> | undefined
  contents: Record<number, LexicalEditor>
  nodeKey: NodeKey
}) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        const nodes = selection?.getNodes() ?? []
        if (nodes.length === 1 && nodes[0].getKey() === nodeKey) {
          if (contents[0] !== undefined) {
            contents[0].focus(undefined, { defaultSelection: "rootStart" })
          }
        }
        return false
      },
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor])

  return (
    <>
      <span
        style={{
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onClick={() =>
          modals.open({
            title: `Edit ${stringifyFunction(name, positionParameters, namedParameters, false).replace("()", "")}`,
            children: (
              <FunctionCallEditModal
                editor={editor}
                name={name}
                positionParameters={positionParameters}
                namedParameters={namedParameters}
                nodeKey={nodeKey}
              />
            ),
          })
        }
      >
        {stringifyFunction(
          name,
          positionParameters,
          namedParameters,
          false,
        ).replace("()", "")}
      </span>
      {Object.keys(contents).length !== 0 &&
        Object.keys(contents)
          .sort((x, y) => parseInt(x, 10) - parseInt(y, 10))
          .map((contentIndex) => (
            <LexicalNestedComposer
              initialEditor={contents[parseInt(contentIndex, 10)]}
              key={contentIndex}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable placeholder={<></>} aria-placeholder="" />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <AutoFocusPlugin />
              <OnChangePlugin
                ignoreSelectionChange
                onChange={(state) => {
                  editor.update(
                    () => {
                      const node = $getNodeByKey(nodeKey)
                      if ($isFunctionCallNode(node)) {
                        node.setContentParameter(
                          parseInt(contentIndex, 10),
                          state.toJSON(),
                        )
                      }
                    },
                    {
                      onUpdate: () => {
                        editor.dispatchCommand(
                          UPDATE_LOCAL_STORAGE_COMMAND,
                          undefined,
                        )
                      },
                    },
                  )
                }}
              />

              <MathPlugin />
              <TypstCodePlugin />
              <ImagePlugin />
              <CurrentEditorPlugin priority={COMMAND_PRIORITY_HIGH} />
              <KeyboardMapPlugin skipInitialization />
              <NestedEditorPlugin
                editor={editor}
                nodeKey={nodeKey}
                first={parseInt(contentIndex, 10) === 0}
                last={
                  parseInt(contentIndex, 10) ===
                  Object.keys(contents).length - 1
                }
              />
            </LexicalNestedComposer>
          ))}
    </>
  )
}

export const InsertFunctionCallModal = () => {
  const [name, setName] = useState("")

  const functions = useMemo(() => getFunctions(), [])

  const insert = () => {
    modals.closeAll()
    // TODO: why is this hack needed?
    setTimeout(() => {
      restoreEditorSelection()
      executeCommandSequence(`insertFunctionCall ${name}`)
    }, 100)
  }

  return (
    <>
      <Autocomplete
        data-autofocus
        autoCapitalize="off"
        autoCorrect="off"
        label="Function"
        leftSection={<IconFunction />}
        value={name}
        onChange={setName}
        onKeyDown={(e) => {
          if (e.key === "Enter" && functions[name] !== undefined) {
            e.preventDefault()
            insert()
          }
        }}
        data={Object.keys(functions).sort()}
      />
      <Button mt="xs" fullWidth leftSection={<IconPlus />} onClick={insert}>
        Insert
      </Button>
    </>
  )
}

const FunctionCallPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_FUNCTION_CALL_COMMAND,
      (payload) => {
        if (payload === undefined) {
          backupEditorSelection()
          modals.open({
            title: "Insert Function Call",
            children: <InsertFunctionCallModal />,
          })
          return true
        }

        const node =
          typeof payload === "string"
            ? $createFunctionCallNode(payload, undefined, undefined)
            : $createFunctionCallNode(...payload)
        $insertNodes([node])

        if (node.isKeyboardSelectable()) {
          const selection = $createNodeSelection()
          selection.add(node.getKey())
          $setSelection(selection)
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}

export default FunctionCallPlugin
