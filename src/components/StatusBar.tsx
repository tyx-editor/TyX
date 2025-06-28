import { Tooltip } from "@mantine/core"
import { useTimeout } from "@mantine/hooks"
import { IconKeyboard, IconTerminal } from "@tabler/icons-react"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocalStorage } from "../utilities/hooks"

const CURRENT_COMMAND_DELAY_MILLISECONDS = 2000

const StatusBarItem = ({
  children,
  label,
}: {
  children?: React.ReactNode
  label?: string
}) => {
  if (!label) {
    return <span className="status-bar-item">{children}</span>
  }

  return (
    <Tooltip label={label}>
      <span className="status-bar-item">{children}</span>
    </Tooltip>
  )
}

const KeyboardMapStatusBarItem = () => {
  const [keyboardMap] = useLocalStorage<string | null>({
    key: "Keyboard Map",
    defaultValue: null,
  })
  const { t } = useTranslation()

  if (!keyboardMap) {
    return <></>
  }

  return (
    <StatusBarItem label={`${t("keyboardMap")}: ${keyboardMap}`}>
      <IconKeyboard style={{ marginInlineEnd: 5 }} />
      {keyboardMap}
    </StatusBarItem>
  )
}

const CurrentCommandStatusBarItem = () => {
  const [currentCommand, setCurrentCommand] = useLocalStorage<string | null>({
    key: "Current Command",
    defaultValue: null,
  })
  const timeout = useTimeout(
    () => setCurrentCommand(null),
    CURRENT_COMMAND_DELAY_MILLISECONDS,
  )

  useEffect(() => {
    timeout.start()

    return timeout.clear
  })

  if (!currentCommand) {
    return <></>
  }

  return (
    <StatusBarItem>
      <IconTerminal style={{ marginInlineEnd: 5 }} />
      {currentCommand}
    </StatusBarItem>
  )
}

const StatusBar = () => {
  return (
    <div
      dir="ltr"
      className="status-bar"
      style={{
        flex: "none",
        height: 28,
        borderTop: "1px solid var(--mantine-color-dark-4)",
        display: "flex",
        alignItems: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "default",
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <CurrentCommandStatusBarItem />
      <span style={{ flexGrow: 1 }} />
      <KeyboardMapStatusBarItem />
    </div>
  )
}

export default StatusBar
