import { Tooltip } from "@mantine/core"
import { useTimeout } from "@mantine/hooks"
import {
  IconAlertCircle,
  IconKeyboard,
  IconTerminal,
} from "@tabler/icons-react"
import React, { CSSProperties, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TyXDocument } from "../models"
import { useLocalStorage } from "../utilities/hooks"

const CURRENT_COMMAND_DELAY_MILLISECONDS = 3000

const StatusBarItem = ({
  children,
  label,
  style,
  onClick,
}: {
  children?: React.ReactNode
  label?: string
  style?: CSSProperties
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}) => {
  if (!label) {
    return (
      <span style={style} className="status-bar-item" onClick={onClick}>
        {children}
      </span>
    )
  }

  return (
    <Tooltip label={label}>
      <span style={style} className="status-bar-item" onClick={onClick}>
        {children}
      </span>
    </Tooltip>
  )
}

const KeyboardMapStatusBarItem = () => {
  const [keyboardMap] = useLocalStorage<string | null>({
    key: "Keyboard Map",
    defaultValue: null,
  })
  const [openDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })

  const { t } = useTranslation()

  if (!keyboardMap || openDocuments.length === 0) {
    return null
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
    return null
  }

  return (
    <StatusBarItem
      label="Click to copy"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        cursor: "pointer",
      }}
      onClick={() => navigator.clipboard.writeText(currentCommand)}
    >
      <IconTerminal style={{ marginInlineEnd: 5 }} />
      {currentCommand}
    </StatusBarItem>
  )
}

const CurrentWarningStatusBarItem = () => {
  const [currentWarning, setCurrentWarning] = useLocalStorage<string | null>({
    key: "Current Warning",
    defaultValue: null,
  })
  const timeout = useTimeout(
    () => setCurrentWarning(null),
    CURRENT_COMMAND_DELAY_MILLISECONDS,
  )

  useEffect(() => {
    timeout.start()

    return timeout.clear
  })

  if (!currentWarning) {
    return null
  }

  return (
    <StatusBarItem
      label="Warning"
      style={{
        color: "yellow",
      }}
    >
      <IconAlertCircle style={{ marginInlineEnd: 5 }} />
      {currentWarning}
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
        borderTop: "1px solid var(--tab-border-color)",
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
      <CurrentWarningStatusBarItem />
      <span style={{ flexGrow: 1 }} />
      <KeyboardMapStatusBarItem />
    </div>
  )
}

export default StatusBar
