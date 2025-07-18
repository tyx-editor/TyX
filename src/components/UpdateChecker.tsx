import { Alert, Button, Progress } from "@mantine/core"
import { IconDownload, IconNews, IconRefresh } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { checkForUpdates, relaunch } from "../backend"
import { Update } from "../backend/base"

const UpdateChecker = () => {
  const [update, setUpdate] = useState<Update | null>()
  const [loading, setLoading] = useState(false)
  const [contentLength, setContentLength] = useState<number>()
  const [progress, setProgress] = useState(0)

  const check = async () => {
    setUpdate(undefined)
    setLoading(true)
    const update = await checkForUpdates()
    setUpdate(update)
    setLoading(false)
  }

  const startUpdate = async () => {
    await update?.downloadAndInstall((e) => {
      if (e.event === "Started") {
        setContentLength(e.data.contentLength)
      } else if (e.event === "Progress") {
        setProgress((p) => p + e.data.chunkLength)
      }
    })
    await relaunch()
  }

  useEffect(() => {
    check()
  }, [])

  if (!update) {
    return (
      <>
        {update === null && (
          <span style={{ fontSize: 12 }}>No updates available.</span>
        )}
        <Button
          mt={5}
          loading={loading}
          leftSection={<IconRefresh />}
          size="xs"
          variant="subtle"
          onClick={check}
        >
          Check for updates
        </Button>
      </>
    )
  }

  return (
    <Alert
      color="green"
      icon={<IconNews />}
      style={{ textAlign: "start" }}
      w="90%"
      mx="5%"
    >
      <p>TyX {update.version} is now available!</p>
      <p style={{ whiteSpace: "pre" }}>{update.body}</p>
      {contentLength && (
        <Progress
          mt="xs"
          value={(progress / contentLength) * 100}
          color="green"
          striped
          animated
        />
      )}
      <Button
        color="green"
        fullWidth
        mt="xs"
        leftSection={<IconDownload />}
        onClick={startUpdate}
      >
        Update TyX
      </Button>
    </Alert>
  )
}

export default UpdateChecker
