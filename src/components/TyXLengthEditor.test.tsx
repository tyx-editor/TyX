import { MantineProvider } from "@mantine/core"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TyXLengthEditor from "./TyXLengthEditor"

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>)

describe("TyXLengthEditor", () => {
  it("renders numeric input with current value", () => {
    renderWithMantine(
      <TyXLengthEditor
        value={{ unit: "em", value: "2" }}
        onChange={vi.fn()}
      />,
    )
    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("2")
  })

  it("renders empty input when value is undefined", () => {
    renderWithMantine(
      <TyXLengthEditor value={{}} onChange={vi.fn()} />,
    )
    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("")
  })

  it("calls onChange with new value when user types", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithMantine(
      <TyXLengthEditor value={{ unit: "pt", value: "" }} onChange={onChange} />,
    )
    const input = screen.getByRole("textbox")
    await user.type(input, "5")
    expect(onChange).toHaveBeenLastCalledWith({ value: "5", unit: "pt" })
  })

  it("preserves unit when value changes", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithMantine(
      <TyXLengthEditor value={{ unit: "mm", value: "5" }} onChange={onChange} />,
    )
    const input = screen.getByRole("textbox")
    await user.clear(input)
    await user.type(input, "10")
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ unit: "mm" }),
    )
  })
})
