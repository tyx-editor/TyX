import { Tooltip } from "@mantine/core"
import { useTimeout } from "@mantine/hooks"
import {
  IconAlertCircle,
  IconInfoCircle,
  IconKeyboard,
  IconTerminal,
} from "@tabler/icons-react"
import React, { CSSProperties, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TyXDocument } from "../models"
import { reverseKeyboardShortcuts } from "../shortcuts"
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

const CurrentCommandStatusBarItem = ({
  conditionStorageKey,
  localStorageKey,
  color,
  icon,
}: {
  conditionStorageKey?: string
  localStorageKey: string
  color?: string
  icon: React.ReactNode
}) => {
  const [currentCommand, setCurrentCommand] = useLocalStorage<string | null>({
    key: localStorageKey,
    defaultValue: null,
  })
  const [conditionCommand] = useLocalStorage<string | null>({
    key: conditionStorageKey ?? localStorageKey,
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

  if (!currentCommand || (conditionStorageKey && conditionCommand !== null)) {
    return null
  }

  const commandKeyboardShortcut = reverseKeyboardShortcuts[currentCommand] ? (
    <>
      <IconKeyboard style={{ marginInlineStart: 15, marginInlineEnd: 5 }} />{" "}
      {reverseKeyboardShortcuts[currentCommand]}
    </>
  ) : (
    ""
  )

  return (
    <StatusBarItem
      label="Click to copy"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        cursor: "pointer",
        color,
      }}
      onClick={() => navigator.clipboard.writeText(currentCommand)}
    >
      {icon}
      {currentCommand}
      {commandKeyboardShortcut}
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
      <CurrentCommandStatusBarItem
        conditionStorageKey="Current Command"
        localStorageKey="Hover Command"
        color="cyan"
        icon={<IconInfoCircle style={{ marginInlineEnd: 5 }} />}
      />
      <CurrentCommandStatusBarItem
        localStorageKey="Current Command"
        icon={<IconTerminal style={{ marginInlineEnd: 5 }} />}
      />
      <CurrentWarningStatusBarItem />
      <span style={{ flexGrow: 1 }} />
      <KeyboardMapStatusBarItem />
    </div>
  )
}

export default StatusBar
