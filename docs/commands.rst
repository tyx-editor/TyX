Commands
========

TyX commands are based on Lexical and Mathfield commands.
The keyboard shortcuts correspond to command sequences, which are commands separated by a semicolon.

Commands consist of a command function followed by optional arguments.
This page lists the available commands (stored in `the commands file <https://github.com/tyx-editor/TyX/tree/main/src/commands.ts>`_).

Toggle Keyboard Map
^^^^^^^^^^^^^^^^^^^

Given a keyboard map name (or null), if the current keyboard map is that given keyboard map, turn it off. Otherwise, turn it on.

Example: ``toggleKeyboardMap Hebrew``


Format Element
^^^^^^^^^^^^^^

Format the alignment of the current element to one of 'left', 'start', 'center', 'right', 'end', 'justify' or ''.

Example: ``formatElement center``


Format Text
^^^^^^^^^^^

Toggle the format of the current selected text in one of  'bold', 'underline', 'strikethrough', 'italic', 'highlight', 'code', 'subscript', 'superscript'

Example: ``formatText bold``


Undo
^^^^

Undo the last command.

Example: ``undo``


Redo
^^^^

Redo the last command.

Example: ``redo``


Insert Math
^^^^^^^^^^^

Inserts a math inline/block node according to the second parameter "inline". Setting it to true adds an inline math node.

Example: ``insertMath true``


Insert Ordered List
^^^^^^^^^^^^^^^^^^^

Insert an ordered list.

Example: ``insertOrderedList``


Insert Unordered List
^^^^^^^^^^^^^^^^^^^^^

Insert an unordered list.

Example: ``insertUnorderedList``


Insert Line Break
^^^^^^^^^^^^^^^^^

Insert a line break. Moves to the new line if the second argument is ``true``.

Example: ``insertUnorderedList true``


Insert Horizontal Line
^^^^^^^^^^^^^^^^^^^^^^

Insert a horizontal line.

Example: ``insertHorizontalLine``


Insert Typst Code
^^^^^^^^^^^^^^^^^

Insert a typst code node.

Example: ``insertTypstCode``


Insert Image
^^^^^^^^^^^^

Insert an image node with the given source URL.

Example: ``insertImage ./example.png``


Insert Function Call
^^^^^^^^^^^^^^^^^^^^

Insert a function call node with the given function (and optionally initial parameter values or inline customization).

Example: ``insertFunctionCall footnote``

Example: ``insertFunctionCall ["h", [{"type": "length", "value": "10", "unit": "pt"}]]``


Toggle Math Inline
^^^^^^^^^^^^^^^^^^

Toggles the current math node between inline/block, or inserts a new block math node if no math node is selected.

Example: ``toggleMathInline``


Math
^^^^

Runs the given `Mathfield command <https://cortexjs.io/mathfield/guides/commands/>`_ in the currently selected math editor.

Example: ``math insert \alpha``


Indent
^^^^^^

Indents the current paragraph or list item (increases the indentation level by one).

Example: ``indent``


Outdent
^^^^^^^

Outdents the current paragraph or list item (reduces the indentation level by one).

Example: ``outdent``


Insert Table
^^^^^^^^^^^^

Inserts a table with the given amount of rows/columns and whether headers are present.

Example: ``insertTable {"rows": 3, "columns": 3}``

Example: ``insertTable {"rows": 2, "columns": 2, "includeHeaders": false}``

Example: ``insertTable {"rows": 2, "columns": 2, "includeHeaders": {"rows": false, "columns": true}}``


Table Insert Row Below
^^^^^^^^^^^^^^^^^^^^^^

Inserts a row below the current row in the current table.

Example: ``tableInsertRowBelow``


Table Insert Column Right
^^^^^^^^^^^^^^^^^^^^^^^^^

Inserts a column to the right of the current column in the current table.

Example: ``tableInsertColumnRight``


Table Remove Row
^^^^^^^^^^^^^^^^

Removes the current row in the current table.

Example: ``tableRemoveRow``


Table Remove Column
^^^^^^^^^^^^^^^^^^^

Removes the current column in the current table.

Example: ``tableRemoveColumn``


Toggle Link
^^^^^^^^^^^

Toggles the link of the currently selected text to equal the given URL.

Example: ``toggleLink https://tyx-editor.com``


Open Link Popup
^^^^^^^^^^^^^^^

Opens the link popup to choose a URL to toggle the currently selected text to link to.

Example: ``openLinkPopup``


File Open
~~~~~~~~~

Opens the file open dialog.

Example: ``fileOpen``


File New
~~~~~~~~~

Opens the new file dialog.

Example: ``fileNew``


File Save
~~~~~~~~~

Save the current file.

Example: ``fileSave``


File Save As
~~~~~~~~~~~~

Opens the file save as dialog.

Example: ``fileSaveAs``


File Close
~~~~~~~~~~

Closes the current file.

Example: ``fileClose``


File Preview
~~~~~~~~~~~~

Previews the current file as a PDF.

Example: ``filePreview``