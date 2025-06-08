import {
  Button,
  Checkbox,
  Fieldset,
  NumberInput,
  Select,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core"
import {
  IconColumns,
  IconDeviceFloppy,
  IconFileHorizontal,
  IconFolder,
  IconIcons,
  IconIndentIncrease,
  IconLanguage,
} from "@tabler/icons-react"
import { TyXDocument, TyXDocumentSettings } from "../models"
import { setLocalStorage, useLocalStorage } from "../utilities/hooks"
import LengthInput from "./LengthInput"

const DocumentSettingsModal = () => {
  const [openDocuments, setOpenDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })
  const [currentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
  })

  const currentSettings = openDocuments[currentDocument].settings ?? {}
  const setSettings = (settings: TyXDocumentSettings) => {
    openDocuments[currentDocument].settings = settings
    setOpenDocuments([...openDocuments])
  }

  return (
    <>
      <Fieldset legend="Page Layout">
        <Select
          allowDeselect
          label="Language"
          leftSection={<IconLanguage />}
          value={currentSettings.language ?? null}
          onChange={(v) =>
            setSettings({ ...currentSettings, language: v ?? undefined })
          }
          data={[
            {
              label: "Albanian",
              value: "sq",
            },
            {
              label: "Arabic",
              value: "ar",
            },
            {
              label: "Basque",
              value: "eu",
            },
            {
              label: "Bokmål",
              value: "nb",
            },
            {
              label: "Bulgarian",
              value: "bg",
            },
            {
              label: "Catalan",
              value: "ca",
            },
            {
              label: "Chinese",
              value: "zh",
            },
            {
              label: "Croatian",
              value: "hr",
            },
            {
              label: "Czech",
              value: "cs",
            },
            {
              label: "Danish",
              value: "da",
            },
            {
              label: "Dutch",
              value: "nl",
            },
            {
              label: "English",
              value: "en",
            },
            {
              label: "Estonian",
              value: "et",
            },
            {
              label: "Filipino",
              value: "tl",
            },
            {
              label: "Finnish",
              value: "fi",
            },
            {
              label: "French",
              value: "fr",
            },
            {
              label: "Galician",
              value: "gl",
            },
            {
              label: "German",
              value: "de",
            },
            {
              label: "Greek",
              value: "el",
            },
            {
              label: "Hebrew",
              value: "he",
            },
            {
              label: "Hungarian",
              value: "hu",
            },
            {
              label: "Icelandic",
              value: "is",
            },
            {
              label: "Italian",
              value: "it",
            },
            {
              label: "Japanese",
              value: "ja",
            },
            {
              label: "Latin",
              value: "la",
            },
            {
              label: "Lower Sorbian",
              value: "dsb",
            },
            {
              label: "Nynorsk",
              value: "nn",
            },
            {
              label: "Polish",
              value: "pl",
            },
            {
              label: "Portuguese",
              value: "pt",
            },
            {
              label: "Romanian",
              value: "ro",
            },
            {
              label: "Russian",
              value: "ru",
            },
            {
              label: "Serbian",
              value: "sr",
            },
            {
              label: "Slovak",
              value: "sk",
            },
            {
              label: "Slovenian",
              value: "sl",
            },
            {
              label: "Spanish",
              value: "es",
            },
            {
              label: "Swedish",
              value: "sv",
            },
            {
              label: "Turkish",
              value: "tr",
            },
            {
              label: "Ukrainian",
              value: "uk",
            },
            {
              label: "Vietnamese",
              value: "vi",
            },
          ]}
        />
        <Select
          mt="xs"
          allowDeselect
          label="Paper"
          leftSection={<IconFileHorizontal />}
          value={currentSettings.paper ?? null}
          onChange={(v) =>
            setSettings({ ...currentSettings, paper: v ?? undefined })
          }
          data={[
            {
              label: "A0",
              value: "a0",
            },
            {
              label: "A1",
              value: "a1",
            },
            {
              label: "A2",
              value: "a2",
            },
            {
              label: "A3",
              value: "a3",
            },
            {
              label: "A4",
              value: "a4",
            },
            {
              label: "A5",
              value: "a5",
            },
            {
              label: "A6",
              value: "a6",
            },
            {
              label: "A7",
              value: "a7",
            },
            {
              label: "A8",
              value: "a8",
            },
            {
              label: "A9",
              value: "a9",
            },
            {
              label: "A10",
              value: "a10",
            },
            {
              label: "A11",
              value: "a11",
            },
            {
              label: "ISO B1",
              value: "iso-b1",
            },
            {
              label: "ISO B2",
              value: "iso-b2",
            },
            {
              label: "ISO B3",
              value: "iso-b3",
            },
            {
              label: "ISO B4",
              value: "iso-b4",
            },
            {
              label: "ISO B5",
              value: "iso-b5",
            },
            {
              label: "ISO B6",
              value: "iso-b6",
            },
            {
              label: "ISO B7",
              value: "iso-b7",
            },
            {
              label: "ISO B8",
              value: "iso-b8",
            },
            {
              label: "ISO C3",
              value: "iso-c3",
            },
            {
              label: "ISO C4",
              value: "iso-c4",
            },
            {
              label: "ISO C5",
              value: "iso-c5",
            },
            {
              label: "ISO C6",
              value: "iso-c6",
            },
            {
              label: "ISO C7",
              value: "iso-c7",
            },
            {
              label: "ISO C8",
              value: "iso-c8",
            },
            {
              label: "DIN D3",
              value: "din-d3",
            },
            {
              label: "DIN D4",
              value: "din-d4",
            },
            {
              label: "DIN D5",
              value: "din-d5",
            },
            {
              label: "DIN D6",
              value: "din-d6",
            },
            {
              label: "DIN D7",
              value: "din-d7",
            },
            {
              label: "DIN D8",
              value: "din-d8",
            },
            {
              label: "SIS G5",
              value: "sis-g5",
            },
            {
              label: "SIS E5",
              value: "sis-e5",
            },
            {
              label: "ANSI A",
              value: "ansi-a",
            },
            {
              label: "ANSI B",
              value: "ansi-b",
            },
            {
              label: "ANSI C",
              value: "ansi-c",
            },
            {
              label: "ANSI D",
              value: "ansi-d",
            },
            {
              label: "ANSI E",
              value: "ansi-e",
            },
            {
              label: "ARCH A",
              value: "arch-a",
            },
            {
              label: "ARCH B",
              value: "arch-b",
            },
            {
              label: "ARCH C",
              value: "arch-c",
            },
            {
              label: "ARCH D",
              value: "arch-d",
            },
            {
              label: "ARCH E1",
              value: "arch-e1",
            },
            {
              label: "ARCH E",
              value: "arch-e",
            },
            {
              label: "JIS B0",
              value: "jis-b0",
            },
            {
              label: "JIS B1",
              value: "jis-b1",
            },
            {
              label: "JIS B2",
              value: "jis-b2",
            },
            {
              label: "JIS B3",
              value: "jis-b3",
            },
            {
              label: "JIS B4",
              value: "jis-b4",
            },
            {
              label: "JIS B5",
              value: "jis-b5",
            },
            {
              label: "JIS B6",
              value: "jis-b6",
            },
            {
              label: "JIS B7",
              value: "jis-b7",
            },
            {
              label: "JIS B8",
              value: "jis-b8",
            },
            {
              label: "JIS B9",
              value: "jis-b9",
            },
            {
              label: "JIS B10",
              value: "jis-b10",
            },
            {
              label: "JIS B11",
              value: "jis-b11",
            },
            {
              label: "SAC D0",
              value: "sac-d0",
            },
            {
              label: "SAC D1",
              value: "sac-d1",
            },
            {
              label: "SAC D2",
              value: "sac-d2",
            },
            {
              label: "SAC D3",
              value: "sac-d3",
            },
            {
              label: "SAC D4",
              value: "sac-d4",
            },
            {
              label: "SAC D5",
              value: "sac-d5",
            },
            {
              label: "SAC D6",
              value: "sac-d6",
            },
            {
              label: "ISO ID 1",
              value: "iso-id-1",
            },
            {
              label: "ISO ID 2",
              value: "iso-id-2",
            },
            {
              label: "ISO ID 3",
              value: "iso-id-3",
            },
            {
              label: "ASIA F4",
              value: "asia-f4",
            },
            {
              label: "JP SHIROKU BAN 4",
              value: "jp-shiroku-ban-4",
            },
            {
              label: "JP SHIROKU BAN 5",
              value: "jp-shiroku-ban-5",
            },
            {
              label: "JP SHIROKU BAN 6",
              value: "jp-shiroku-ban-6",
            },
            {
              label: "JP KIKU 4",
              value: "jp-kiku-4",
            },
            {
              label: "JP KIKU 5",
              value: "jp-kiku-5",
            },
            {
              label: "JP BUSINESS CARD",
              value: "jp-business-card",
            },
            {
              label: "CN BUSINESS CARD",
              value: "cn-business-card",
            },
            {
              label: "EU BUSINESS CARD",
              value: "eu-business-card",
            },
            {
              label: "FR TELLIERE",
              value: "fr-tellière",
            },
            {
              label: "FR COURONNE ECRITURE",
              value: "fr-couronne-écriture",
            },
            {
              label: "FR COURONNE EDITION",
              value: "fr-couronne-édition",
            },
            {
              label: "FR RAISIN",
              value: "fr-raisin",
            },
            {
              label: "FR CARRE",
              value: "fr-carré",
            },
            {
              label: "FR JESUS",
              value: "fr-jésus",
            },
            {
              label: "UK BRIEF",
              value: "uk-brief",
            },
            {
              label: "UK DRAFT",
              value: "uk-draft",
            },
            {
              label: "UK FOOLSCAP",
              value: "uk-foolscap",
            },
            {
              label: "UK QUARTO",
              value: "uk-quarto",
            },
            {
              label: "UK CROWN",
              value: "uk-crown",
            },
            {
              label: "UK BOOK A",
              value: "uk-book-a",
            },
            {
              label: "UK BOOK B",
              value: "uk-book-b",
            },
            {
              label: "US LETTER",
              value: "us-letter",
            },
            {
              label: "US LEGAL",
              value: "us-legal",
            },
            {
              label: "US TABLOID",
              value: "us-tabloid",
            },
            {
              label: "US EXECUTIVE",
              value: "us-executive",
            },
            {
              label: "US FOOLSCAP FOLIO",
              value: "us-foolscap-folio",
            },
            {
              label: "US STATEMENT",
              value: "us-statement",
            },
            {
              label: "US LEDGER",
              value: "us-ledger",
            },
            {
              label: "US OFICIO",
              value: "us-oficio",
            },
            {
              label: "US GOV LETTER",
              value: "us-gov-letter",
            },
            {
              label: "US GOV LEGAL",
              value: "us-gov-legal",
            },
            {
              label: "US BUSINESS CARD",
              value: "us-business-card",
            },
            {
              label: "US DIGEST",
              value: "us-digest",
            },
            {
              label: "US TRADE",
              value: "us-trade",
            },
            {
              label: "NEWSPAPER COMPACT",
              value: "newspaper-compact",
            },
            {
              label: "NEWSPAPER BERLINER",
              value: "newspaper-berliner",
            },
            {
              label: "NEWSPAPER BROADSHEET",
              value: "newspaper-broadsheet",
            },
            {
              label: "PRESENTATION 16 9",
              value: "presentation-16-9",
            },
            {
              label: "PRESENTATION 4 3",
              value: "presentation-4-3",
            },
          ]}
        />
        <Checkbox
          mt="xs"
          label="Flipped"
          checked={currentSettings.flipped ?? false}
          onChange={(e) =>
            setSettings({
              ...currentSettings,
              flipped: e.currentTarget.checked ? true : undefined,
            })
          }
        />
      </Fieldset>
      <Fieldset legend="Text Layout" mt="xs">
        <Checkbox
          label="Justified"
          checked={currentSettings.justified ?? false}
          onChange={(e) =>
            setSettings({
              ...currentSettings,
              justified: e.currentTarget.checked ? true : undefined,
            })
          }
        />
        <LengthInput
          props={{
            mt: "xs",
            label: "Indentation",
            leftSection: <IconIndentIncrease />,
          }}
          value={
            typeof currentSettings.indentation === "object"
              ? currentSettings.indentation
              : {}
          }
          onChange={(indentation) =>
            setSettings({
              ...currentSettings,
              indentation,
            })
          }
        />
        <NumberInput
          mt="xs"
          label="Columns"
          leftSection={<IconColumns />}
          value={currentSettings.columns ?? ""}
          onChange={(v) => {
            setSettings({
              ...currentSettings,
              columns: v ? parseInt(v.toString(), 10) : undefined,
            })
          }}
        />
      </Fieldset>
      <Fieldset legend="Typst Preamble" mt="xs">
        <Textarea
          minRows={3}
          autosize
          value={openDocuments[currentDocument].preamble ?? ""}
          onChange={(e) => {
            openDocuments[currentDocument].preamble =
              e.currentTarget.value.replace(/“|”|“|‟|”|❝|❞|〝|〞/g, '"')
            setOpenDocuments([...openDocuments])
          }}
        />
      </Fieldset>
      <Fieldset legend="Compiler Options" mt="xs">
        <TextInput
          label="Root"
          leftSection={<IconFolder />}
          value={openDocuments[currentDocument].settings?.root ?? ""}
          onChange={(e) =>
            setSettings({ ...currentSettings, root: e.currentTarget.value })
          }
        />
        <TagsInput
          mt="xs"
          label="Font Paths"
          leftSection={<IconIcons />}
          value={openDocuments[currentDocument].settings?.fontPaths ?? []}
          onChange={(fontPaths) =>
            setSettings({ ...currentSettings, fontPaths })
          }
        />
      </Fieldset>
      <Button
        fullWidth
        mt="xs"
        leftSection={<IconDeviceFloppy />}
        onClick={() => setLocalStorage("Default Settings", currentSettings)}
      >
        Save as default settings
      </Button>
    </>
  )
}

export default DocumentSettingsModal
