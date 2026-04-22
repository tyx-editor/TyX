import { MantineProvider } from "@mantine/core"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TyXValueEditor from "./TyXValueEditor"

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>)

describe("TyXValueEditor — length type", () => {
  it("renders a text input for length value", () => {
    renderWithMantine(
      <TyXValueEditor
        type="length"
        value={{ type: "length", unit: "em", value: "1" }}
        setValue={vi.fn()}
      />,
    )
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("calls setValue with length type when value changes", async () => {
    const user = userEvent.setup()
    const setValue = vi.fn()
    renderWithMantine(
      <TyXValueEditor
        type="length"
        value={{ type: "length", unit: "pt", value: "" }}
        setValue={setValue}
      />,
    )
    await user.type(screen.getByRole("textbox"), "5")
    expect(setValue).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "length" }),
    )
  })
})

describe("TyXValueEditor — boolean type", () => {
  it("renders a switch for boolean value", () => {
    renderWithMantine(
      <TyXValueEditor
        type="boolean"
        value={{ type: "boolean", value: false }}
        setValue={vi.fn()}
      />,
    )
    expect(screen.getByRole("switch")).toBeInTheDocument()
  })

  it("switch is checked when value is true", () => {
    renderWithMantine(
      <TyXValueEditor
        type="boolean"
        value={{ type: "boolean", value: true }}
        setValue={vi.fn()}
      />,
    )
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("calls setValue with boolean type on click", async () => {
    const user = userEvent.setup()
    const setValue = vi.fn()
    renderWithMantine(
      <TyXValueEditor
        type="boolean"
        value={{ type: "boolean", value: false }}
        setValue={setValue}
      />,
    )
    await user.click(screen.getByRole("switch"))
    expect(setValue).toHaveBeenCalledWith({ type: "boolean", value: true })
  })
})

describe("TyXValueEditor — content type", () => {
  it("renders nothing for content type", () => {
    renderWithMantine(<TyXValueEditor type="content" setValue={vi.fn()} />)
    expect(screen.queryByRole("textbox")).toBeNull()
    expect(screen.queryByRole("switch")).toBeNull()
  })
})

describe("TyXValueEditor — initializes from type when value absent", () => {
  it("renders length editor when no value but type is length", () => {
    renderWithMantine(<TyXValueEditor type="length" setValue={vi.fn()} />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })
})
