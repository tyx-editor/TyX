/**
 * @file A modal for choosing the name to save the current document as.
 */

import { Button, TextInput } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconDeviceFloppy } from "@tabler/icons-react"
import { useState } from "react"
import { onSaveAs } from "../backend"

const SaveAsModal = () => {
  let [name, setName] = useState("")

  return (
    <>
      <TextInput
        label="Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <Button
        fullWidth
        mt="xs"
        leftSection={<IconDeviceFloppy />}
        onClick={() => {
          if (!name.endsWith(".tyx")) {
            name += ".tyx"
          }
          onSaveAs(name)
          modals.closeAll()
        }}
      >
        Save
      </Button>
    </>
  )
}

export default SaveAsModal
