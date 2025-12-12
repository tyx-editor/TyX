# Configuration

## Configuration Directory

TyX's configuration directory follows [Tauri's app configuration directory](https://v2.tauri.app/reference/javascript/api/namespacepath/#appconfigdir).

This resolves to the following directories:

- Linux: `$XDG_CONFIG_HOME/com.tyx-editor.tyx` or `$HOME/.config/com.tyx-editor.tyx`
- macOS: `$HOME/Library/Application Support/com.tyx-editor.tyx`
- Windows: `{FOLDERID_RoamingAppData}\com.tyx-editor.tyx`

## Settings

The settings file is called `settings.json` and it follows the [TyX settings schema](https://tyx-editor.com/schemas/tyx-settings.schema.json).

It can be edited in the UI by pressing the default `mod+;` keyboard shortcut or opening settings in the splash screen.

This includes the UI language, your keyboard shortcuts, your math inline shortcuts, and optionally your keyboard map.

!!! tip

    You can also create this settings file and then TyX will automatically read and use it!

## Fonts

You can place fonts for use in your TyX documents in a `fonts` directory inside your TyX configuration directory.

TyX automatically adds this to the font paths for documents you compile with it.

## Templates

You can place templates for your TyX documents in a `templates` directory inside your TyX configuration directory.

TyX automatically suggests files from this directory when pressing the "New From Template" option in the splash screen or pressing its default `mod+shift+n` shortcut.
