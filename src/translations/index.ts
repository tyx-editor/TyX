/**
 * @file Provide translations for strings in the React app.
 */

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import he from "./he.json"

i18n.use(initReactI18next).init({
  resources: {
    en,
    he,
  },
  lng: "en",
})

export const TRANSLATIONS = [
  { label: "English", value: "en" },
  { label: "עברית", value: "he" },
]

export const RTL_LANGUAGES = ["he"]
