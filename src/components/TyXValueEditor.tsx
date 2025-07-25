import { MantineSpacing, StyleProp, Switch, Tooltip } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"
import { TyXValue } from "../models"
import TyXLengthEditor from "./TyXLengthEditor"

const DocumentedLabel = ({
  label,
  documentation,
}: {
  label?: string
  documentation?: string
}) => {
  if (!label) {
    return null
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {label}
      {documentation && (
        <Tooltip label={documentation}>
          <IconInfoCircle style={{ marginLeft: 2.5 }} size={20} />
        </Tooltip>
      )}
    </span>
  )
}

const TyXValueEditor = ({
  required,
  label: labelString,
  documentation,
  mt,
  type,
  value,
  setValue,
}: {
  required?: boolean
  label?: string
  documentation?: string
  mt?: StyleProp<MantineSpacing>
  type: string
  value?: TyXValue
  setValue: (v: TyXValue) => void
}) => {
  const label = (
    <DocumentedLabel label={labelString} documentation={documentation} />
  )

  if (!value) {
    // @ts-ignore
    value = { type }
  }

  if (value!.type === "length") {
    return (
      <TyXLengthEditor
        props={{
          required,
          label,
          mt,
        }}
        value={value ?? {}}
        onChange={(v) => setValue({ ...v, type: "length" })}
      />
    )
  }

  if (value!.type === "boolean") {
    return (
      <Switch
        required={required}
        mt={mt}
        label={label}
        checked={value?.value ?? false}
        offLabel={value?.value === undefined ? "Unset" : undefined}
        onClick={(e) => {
          if (e.shiftKey) {
            setValue({ value: undefined, type: "boolean" })
          } else {
            setValue({ value: e.currentTarget.checked, type: "boolean" })
          }
        }}
      />
    )
  }

  if (value?.type === "content") {
    return null
  }

  throw Error(`Unknown TyX Value type: ${type}`)
}

export default TyXValueEditor
