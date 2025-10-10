import { Button, ButtonProps } from "@mantine/core"
import { executeCommandSequence } from "../commands"
import { setLocalStorage } from "../utilities/hooks"

const CommandButton = (props: ButtonProps & { command: string }) => {
  return (
    <Button
      onMouseEnter={() => setLocalStorage("Hover Command", props.command)}
      onMouseLeave={() => setLocalStorage("Hover Command", null)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        executeCommandSequence(props.command)
      }}
      {...props}
    />
  )
}

export default CommandButton
