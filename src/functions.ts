import type { TyXValue } from "./models"

export interface ParameterDescription {
  type: TyXValue["type"]
  required?: boolean
  label?: string
  documentation?: string
}

export const FUNCTIONS: Record<
  string,
  | {
      positional?: ParameterDescription[]
      named?: (ParameterDescription & { name: string })[]
    }
  | undefined
> = {
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
