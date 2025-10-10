import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core"
import { forwardRef } from "react"
import { executeCommandSequence } from "../commands"
import { setLocalStorage } from "../utilities/hooks"

const CommandActionIcon = forwardRef(
  (
    props: ActionIconProps & {
      component?: any
      command: string
      label?: string
    },
    ref,
  ) => {
    const icon = (
      <ActionIcon
        ref={ref}
        onMouseEnter={() => setLocalStorage("Hover Command", props.command)}
        onMouseLeave={() => setLocalStorage("Hover Command", null)}
        onClick={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
          executeCommandSequence(props.command)
        }}
        {...props}
      />
    )

    if (props.label) {
      return <Tooltip label={props.label}>{icon}</Tooltip>
    }

    return icon
  },
)

export default CommandActionIcon
