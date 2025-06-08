import { Menu } from "@mantine/core"
import { useForceUpdate, useWindowEvent } from "@mantine/hooks"
import { RichTextEditor } from "@mantine/tiptap"
import {
  IconColumnInsertRight,
  IconColumnRemove,
  IconMatrix,
  IconRowInsertBottom,
  IconRowRemove,
} from "@tabler/icons-react"
import CommandMenuItem from "./CommandMenuItem"

const MathControls = () => {
  const forceUpdate = useForceUpdate()

  useWindowEvent("mathEditorChanged", forceUpdate)

  if (!window.currentMathEditor) {
    return <></>
  }

  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Control
        title="Insert matrix"
        aria-label="Insert matrix"
        onClick={() =>
          window.currentMathEditor?.executeCommand(
            "insert",
            "\\begin{pmatrix} #0 & #? \\\\ #? & #? \\end{pmatrix}",
          )
        }
      >
        <IconMatrix />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Insert row below"
        aria-label="Insert row below"
        onClick={() => window.currentMathEditor?.executeCommand("addRowAfter")}
      >
        <IconRowInsertBottom />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Insert column to the right"
        aria-label="Insert column to the right"
        onClick={() =>
          window.currentMathEditor?.executeCommand("addColumnAfter")
        }
      >
        <IconColumnInsertRight />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Delete row"
        aria-label="Delete row"
        onClick={() => window.currentMathEditor?.executeCommand("removeRow")}
      >
        <IconRowRemove />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Delete column"
        aria-label="Delete column"
        onClick={() => window.currentMathEditor?.executeCommand("removeColumn")}
      >
        <IconColumnRemove />
      </RichTextEditor.Control>
      <Menu trapFocus={false}>
        <Menu.Target>
          <RichTextEditor.Control
            title="Insert greek letters"
            aria-label="Insert greek letters"
          >
            α
          </RichTextEditor.Control>
        </Menu.Target>
        <Menu.Dropdown>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)", // 6 columns, adjust as needed
              gap: 4,
              padding: 4,
            }}
          >
            {[
              ["alpha", "α"],
              ["beta", "β"],
              ["gamma", "γ"],
              ["delta", "δ"],
              ["varepsilon", "ε"],
              ["zeta", "ζ"],
              ["eta", "η"],
              ["vartheta", "θ"],
              ["iota", "ι"],
              ["kappa", "κ"],
              ["lambda", "λ"],
              ["mu", "μ"],
              ["nu", "ν"],
              ["xi", "ξ"],
              ["omicron", "ο"],
              ["pi", "π"],
              ["rho", "ρ"],
              ["sigma", "σ"],
              ["tau", "τ"],
              ["upsilon", "υ"],
              ["varphi", "φ"],
              ["chi", "χ"],
              ["psi", "ψ"],
              ["omega", "ω"],
            ].map(([characterName, character], index) => (
              <CommandMenuItem
                command={`math insert \\${characterName}`}
                key={index}
              >
                {character}
              </CommandMenuItem>
            ))}
          </div>
        </Menu.Dropdown>
      </Menu>
    </RichTextEditor.ControlsGroup>
  )
}

export default MathControls
