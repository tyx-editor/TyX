/// <reference types="vite/client" />

import type { MathfieldElement } from "mathlive"

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >
    }
  }
}
