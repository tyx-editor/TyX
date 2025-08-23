describe("Splash screen tests", () => {
  it("should show TyX when opening", async () => {
    const header = await $("body h2")
    const text = await header.getText()
    expect(text).toMatch(/TyX/)
  })
})
