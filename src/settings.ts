/**
 * @file The implementation for TyX settings.
 */

import { TyXSettings } from "./models"
import { getLocalStorage, setLocalStorage } from "./utilities/hooks"

export const DEFAULT_MATH_INLINE_SHORTCUTS: [string, string][] = []

export const getSettings = (): TyXSettings => {
  const settings = TyXSettings.safeParse(
    getLocalStorage<TyXSettings>("Settings"),
  )

  if (!settings.success) {
    setLocalStorage("Settings", {} as TyXSettings)
  }

  return settings.data ?? {}
}
