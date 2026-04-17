import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin"
import React, { ReactNode, useMemo } from "react"
import { HistoryContext } from "./playground"

export const SharedHistoryContext = ({
  children,
}: {
  children: ReactNode
}): React.JSX.Element => {
  const historyContext = useMemo(
    () => ({ historyState: createEmptyHistoryState() }),
    [],
  )
  return (
    <HistoryContext.Provider value={historyContext}>
      {children}
    </HistoryContext.Provider>
  )
}
