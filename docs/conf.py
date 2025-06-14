# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "TyX"
copyright = "2025, TyX Developers"
author = "TyX Developers"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["sphinx_mdinclude", "sphinxcontrib.video"]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store", ".venv"]


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]
html_logo = "_static/icon.png"
html_favicon = "_static/icon.ico"
html_theme_options = {
    "logo_only": True,
}
html_context = {
    "display_github": True,
    "github_user": "tyx-editor",
    "github_repo": "TyX",
    "github_version": "main",
    "conf_py_path": "/docs/",
}
