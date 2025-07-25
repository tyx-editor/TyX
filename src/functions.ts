import { FunctionDefinition } from "./models"
import { getSettings } from "./settings"
import { getCurrentDocument } from "./utilities"

export const FUNCTIONS: Record<string, FunctionDefinition | undefined> = {
  h: {
    positional: [
      {
        type: "length",
        label: "Amount",
        documentation: "How much spacing to insert",
        required: true,
      },
    ],
    named: [
      {
        type: "boolean",
        name: "weak",
        label: "Weak",
        documentation:
          "If true, the spacing collapses at the start or end of a paragraph. Moreover, from multiple adjacent weak spacings all but the largest one collapse",
      },
    ],
  },
  v: {
    positional: [
      {
        type: "length",
        label: "Amount",
        documentation: "How much spacing to insert",
        required: true,
      },
    ],
    named: [
      {
        type: "boolean",
        name: "weak",
        label: "Weak",
        documentation:
          "If true, the spacing collapses at the start or end of a paragraph. Moreover, from multiple adjacent weak spacings all but the largest one collapse",
      },
    ],
  },
  footnote: { positional: [{ type: "content", required: true }] },
}

export const getFunctions = () => {
  return {
    ...FUNCTIONS,
    ...getSettings().functions,
    ...getCurrentDocument().settings?.functions,
  }
}
