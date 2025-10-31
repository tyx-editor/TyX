import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin"
import { ReactNode, useMemo } from "react"
import { HistoryContext } from "./playground"

export const SharedHistoryContext = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
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
