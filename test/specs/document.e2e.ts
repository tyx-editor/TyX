describe("Document creation", () => {
  it("shows the welcome screen on launch", async () => {
    const heading = await $("h2")
    const text = await heading.getText()
    expect(text).toMatch(/TyX/)
  })

  it("creates a new document via keyboard shortcut", async () => {
    await browser.keys(["Meta", "n"])
    await browser.pause(500)
    const tabs = await $$("[data-tab]")
    expect(tabs.length).toBeGreaterThan(0)
  })

  it("shows editor after creating new document", async () => {
    const editor = await $("[contenteditable]")
    await editor.waitForExist({ timeout: 5000 })
    expect(await editor.isExisting()).toBe(true)
  })
})
