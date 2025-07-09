The TyX File Format
===================

A ``.tyx`` file is UTF-8 encoded JSON.

It contains the following keys:

- ``version`` is the version of TyX the document was created in.
- ``preamble`` is the Typst preamble of the document. This is raw Typst code that is inserted before the rest of the document.
- ``settings`` is the document's settings.
- ``content`` is Lexical JSON for the document itself. This is a tree structure of the document's contents.