/**
 * @file A component for accepting TyX length values.
 */

import { Select, TextInput, TextInputProps } from "@mantine/core"
import { TyXLength } from "../models"

const LengthInput = ({
  value,
  onChange,
  props,
}: {
  value: TyXLength
  onChange: (v: TyXLength) => void
  props: TextInputProps
}) => {
  return (
    <div style={{ display: "flex", alignItems: "end" }}>
      <TextInput
        style={{ flexGrow: 1 }}
        {...props}
        display="inline-block"
        value={value.value ?? ""}
        onChange={(e) =>
          onChange({ value: e.currentTarget.value, unit: value.unit })
        }
      />
      <Select
        ml="xs"
        flex="min-content"
        display="inline-block"
        data={["pt", "mm", "cm", "in", "em", "fr", "%"]}
        value={value.unit ?? null}
        onChange={(unit) =>
          onChange({ unit: unit ?? undefined, value: value.value })
        }
      />
    </div>
  )
}

export default LengthInput
