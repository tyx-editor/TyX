// Mock for WASM converters — not available in jsdom test environment
export const serialized_tyx_to_typst = () => ""
export const serialized_stringify_function = () => ""
export default () => Promise.resolve()
