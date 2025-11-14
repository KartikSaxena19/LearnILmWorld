import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const StudentJoinSession = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    const domain = "meet.jit.si"
    const options = {
      roomName: `session-${id}`,
      width: "100%",
      height: "100vh",
      parentNode: document.getElementById("jitsi-container"),
      configOverwrite: {
        prejoinPageEnabled: false,
        closePageUrl: `${window.location.origin}/student/sessions`,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          "microphone", "camera", "chat", "desktop", "fullscreen", "hangup"
        ]
      },
      userInfo: {
        displayName: "Student"
      }
    }

    // @ts-ignore
    const api = new window.JitsiMeetExternalAPI(domain, options)

    api.addEventListener("readyToClose", () => {
      navigate("/student/sessions")
    })

    return () => api.dispose()
  }, [id, navigate])

  return <div id="jitsi-container" style={{ width: "100%", height: "100vh" }} />
}

export default StudentJoinSession
