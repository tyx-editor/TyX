import { Menu, Tooltip } from "@mantine/core"
import React from "react"
import { executeCommand, parseCommandSequence } from "../commands"

const CommandMenuItem = ({
  command,
  children,
}: {
  command: string
  children?: React.ReactNode
}) => {
  return (
    <Tooltip label={command} openDelay={1000}>
      <Menu.Item
        display="inline"
        onClick={() => parseCommandSequence(command).forEach(executeCommand)}
      >
        {children}
      </Menu.Item>
    </Tooltip>
  )
}

export default CommandMenuItem
