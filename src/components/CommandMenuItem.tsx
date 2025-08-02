import { Menu, Tooltip } from "@mantine/core"
import React from "react"
import { executeCommandSequence } from "../commands"

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
        onClick={() => executeCommandSequence(command)}
      >
        {children}
      </Menu.Item>
    </Tooltip>
  )
}

export default CommandMenuItem
