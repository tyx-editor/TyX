/**
 * @file TypeScript models used by TyX.
 */

export * from "./content"
export * from "./document"
export * from "./functions"
export * from "./settings"
export * from "./values"

/** The type of TyX commands which can be executed on the current document. */
export type TyXCommand = [string, ...any]
