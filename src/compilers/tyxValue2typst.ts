import { TyXValue } from "../models"

const tyxValue2typst = (value: TyXValue): string => {
  if (value.type === "length") {
    return (value.value ?? "") + value.unit
  }

  throw Error(`Unknown TyX Value type: ${value.type}`)
}

export default tyxValue2typst
