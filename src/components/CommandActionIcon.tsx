import { ActionIcon, ActionIconProps } from "@mantine/core"
import { executeCommandSequence } from "../commands"
import { setLocalStorage } from "../utilities/hooks"

const CommandActionIcon = (
  props: ActionIconProps & { component?: any; command: string },
) => {
  return (
    <ActionIcon
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
}

export default CommandActionIcon
