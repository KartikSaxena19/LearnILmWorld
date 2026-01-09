import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
// import { Video } from 'lucide-react'
import axios from 'axios'
import bg_main from '../assets/bg_main.jpeg'

// import { ZegoExpressEngine } from 'zego-express-engine-webrtc'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useAuth } from '../contexts/AuthContext'

// TYPES 
interface Session {
  _id: string
  title: string
  roomId: string
  description?: string
  trainer: { _id: string; name: string; email: string }
  students: Array<{ _id: string; name: string; email: string }>
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
  duration?: number
  scheduledDate?: string
  language?: string
  level?: string
}

// CONSTANTS 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
// const ZEGO_SERVER = import.meta.env.VITE_ZEGO_SERVER_LINK
// const ZEGO_DEMO_SECRET = import.meta.env.VITE_ZEGO_DEMO_SECRET
// const ZEGO_APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID)

function JoiningOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 text-white text-sm">
      Joining session…
    </div>,
    document.body
  )
}

// COMPONENT
const SessionRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [sessionStarted, setSessionStarted] = useState<boolean>(false)

  // const [hasJoined, setHasJoined] = useState(false)
  const [joinPhase, setJoinPhase] = useState<'idle' | 'joining' | 'joined' | 'left'>('idle')



  const joinLockRef = useRef(false)
  const hasAutoJoinedRef = useRef(false)



  // const containerRef = useRef<HTMLDivElement | null>(null)
  const zpRef = useRef<any>(null)

  // -------FETCH SESSION
  useEffect(() => {
    if (!sessionId) return
    fetchSession()
  }, [sessionId])

  function showZegoRoot() {
    const el = document.getElementById('zego-root')
    if (el) el.style.display = 'block'
  }

  function hideZegoRoot() {
    const el = document.getElementById('zego-root')
    if (el) el.style.display = 'none'
  }


  const fetchSession = async () => {
    try {
      // console.log('[ZEGO] Fetching session', { sessionId })
      const res = await axios.get<Session>(
        `${API_BASE_URL}/api/sessions/${sessionId}`
      )
      // console.log('[ZEGO] Session fetched', res.data)
      setSession(res.data)
      if (res.data.status === 'active') {
        setSessionStarted(true)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load session')
    } finally {
      setLoading(false)
    }
  }

  // START SESSION (TRAINER)
  // const startSession = async () => {

  //   if (!session || user?.role !== 'trainer') return

  //   try {
  //     await axios.put(
  //       `${API_BASE_URL}/api/sessions/${session._id}/status`,
  //       { status: 'active' }
  //     )
  //     // console.log('[ZEGO] Starting session', { sessionId: session._id });
  //     setSessionStarted(true)
  //     setSession({ ...session, status: 'active' })
  //   } catch (err) {
  //     console.error('Failed to start session', err)
  //   }
  // }

  //Forcely ends session for everyone (by TRAINER)  
  const endSession = async () => {

    if (!session || user?.role !== 'trainer') return

    try {
      await axios.put(
        `${API_BASE_URL}/api/sessions/${session._id}/end`
      )

      window.dispatchEvent(new Event('SESSION_ENDED'))
      console.log('[ZEGO] Ending session', { sessionId: session._id })

      leaveRoom()

      navigate(
        user.role === 'trainer'
          ? '/trainer/sessions'
          : '/student/sessions'
      )
    } catch (err) {
      console.error('Failed to end session', err)
    }
  }

  const joinRoomWithToken = async () => {
    if (!session || joinPhase === 'joined' || joinLockRef.current) return

    joinLockRef.current = true
    setJoinPhase('joining')

    try {

      console.log('[ZEGO][FRONTEND] Requesting token from backend ', joinPhase, "... ")

      const res = await axios.post(
        `${API_BASE_URL}/api/sessions/${session._id}/zego-token`
      )

      const { appID, roomID, userID, userName, token } = res.data

      console.log('[ZEGO][FRONTEND] Token received', {
        appID,
        roomID,
        userID,
        userName,
        tokenPrefix: token.slice(0, 4),
        tokenLength: token.length
      })

      if (!token || !token.startsWith('04')) {
        throw new Error('Invalid ZEGO token received')
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        Number(appID),
        token,
        roomID,
        userID,
        userName
      )

      const zp = ZegoUIKitPrebuilt.create(kitToken)
      zpRef.current = zp
      showZegoRoot()

      zp.joinRoom({
        container: document.getElementById('zego-root')!,

        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference
        },

        showPreJoinView: false,   // IMPORTANT
        showRoomDetailsButton: false,

        onJoinRoom: () => {
          console.log('[ZEGO][UIKIT] Joined room successfully')
          // setHasJoined(true)
          setJoinPhase('joined')
          window.dispatchEvent(new Event("SESSION_JOINED"));
        },


        onLeaveRoom: () => {
          console.log('[ZEGO][UIKIT] Left room (UIKit)')
          cleanupAfterLeave()
        },

        onUserJoin: (users: any[]) => {
          console.log('[ZEGO][UIKIT] User joined', users)
        },

        onUserLeave: (users: any[]) => {
          console.log('[ZEGO][UIKIT] User left', users)
        },

        turnOnCameraWhenJoining: false,
        turnOnMicrophoneWhenJoining: false,

        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: user?.role === 'trainer',
        showTextChat: true,
        showUserList: true
      })


    } catch (err) {
      console.error('[ZEGO][FRONTEND] Join failed', err)
      setError('Failed to join meeting')
      joinLockRef.current = false
    }
  }

  const leaveRoom = () => {
    if (!zpRef.current) return
    console.log('[SESSION] Manual leave triggered')
    cleanupAfterLeave()
  }


  function cleanupAfterLeave() {
    console.log('[SESSION] Cleanup after leave')

    setJoinPhase('left')
    joinLockRef.current = false

    if (zpRef.current) {
      zpRef.current.destroy()
      zpRef.current = null
    }

    hideZegoRoot();
    window.dispatchEvent(new Event("SESSION_LEFT"));
  }

  useEffect(() => {
    if (!sessionStarted) return
    if (user?.role !== 'trainer') return
    if (hasAutoJoinedRef.current) return

    hasAutoJoinedRef.current = true
    joinRoomWithToken()
  }, [sessionStarted, user?.role])

  // ending session for all
  useEffect(() => {
    const handleSessionEnded = () => {
      console.log('[SESSION] Session ended globally')
      cleanupAfterLeave()
      navigate('/student/sessions')
    }

    window.addEventListener('SESSION_ENDED', handleSessionEnded)
    return () =>
      window.removeEventListener('SESSION_ENDED', handleSessionEnded)
  }, [])


  // UI STATES  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-xl font-semibold">Session not available</h2>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 btn-primary"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  // Rendering  
  return (
    <>
      <div className="min-h-screen bg-fixed"
        style={{
          backgroundImage:
            `url(${bg_main})`,
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          width: "100%",
        }}>
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                disabled={joinPhase === 'joined'}
                className={`font-bold text-lg ${joinPhase === 'joined'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-indigo-700 hover:opacity-80'
                  }`}
              >
                LearniLM🌎World
              </button>

              <span className="text-sm text-gray-500">
                {session.title} • {session.trainer.name}
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* STUDENT: FIRST JOIN */}
              {joinPhase === 'idle' &&
                sessionStarted &&
                user?.role === 'student' && (
                  <button
                    onClick={joinRoomWithToken}
                    className="px-4 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                  >
                    Join Now
                  </button>
                )}

              {/* STUDENT: REJOIN */}
              {joinPhase === 'left' &&
                sessionStarted &&
                user?.role === 'student' && (
                  <button
                    onClick={joinRoomWithToken}
                    className="px-4 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                  >
                    Rejoin
                  </button>
                )}


              {/* LEAVE */}
              {joinPhase === 'joined' && (
                <button
                  onClick={leaveRoom}
                  className="px-4 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Leave
                </button>
              )}

              {/* TRAINER: END SESSION */}
              {user?.role === 'trainer' && joinPhase !== 'idle' && (
                <button
                  onClick={endSession}
                  className="px-4 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  End Session
                </button>
              )}

              {/* BACK */}
              <button
                disabled={joinPhase === 'joined'}
                onClick={() => navigate(-1)}
                className={`text-sm ${joinPhase === 'joined'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Back
              </button>
            </div>
          </div>
        </header>


        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* for studnets arrival */}
          {joinPhase === 'idle' && sessionStarted && user?.role === 'student' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Session is live
              </h2>

              <p className="mt-2 text-gray-600 max-w-md">
                Your trainer has started the session.
                Click below to join the live class.
              </p>

              <button
                onClick={joinRoomWithToken}
                className="mt-6 px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Join Session
              </button>
            </div>
          )}

          {/* after leaving */}
          {joinPhase === 'left' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                You’ve left the session
              </h2>

              <p className="mt-2 text-gray-600 max-w-md">
                {user?.role === 'trainer'
                  ? 'You can rejoin the session or officially end it if the timing is over.'
                  : 'You may rejoin if the session is still ongoing. Once the session ends, you’ll be able to leave a review.'}
              </p>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={joinRoomWithToken}
                  className="px-6 py-2 rounded-md bg-[#F64EBB] text-white hover:bg-[#6B48AF]"
                >
                  Rejoin Session
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 rounded-md border border-gray-300 bg-[#6B48AF] text-white hover:bg-[#F64EBB]"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {/* JOINING OVERLAY (React-only layer) */}
          <JoiningOverlay visible={sessionStarted && joinPhase === 'joining'} />

        </main>
      </div>
    </>

  )

}

export default SessionRoom
