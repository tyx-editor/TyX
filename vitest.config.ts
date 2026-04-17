import react from "@vitejs/plugin-react"
import { fileURLToPath } from "url"
import { defineConfig } from "vitest/config"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /.*\/converters$/,
        replacement: `${__dirname}src/mocks/converters.ts`,
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/converters/**", "src/test-setup.ts"],
    },
  },
})
