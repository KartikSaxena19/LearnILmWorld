import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

// COMPONENT
const SessionRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [sessionStarted, setSessionStarted] = useState<boolean>(false)

  const hasJoinedRef = useRef(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const zpRef = useRef<any>(null)

  // -------FETCH SESSION
  useEffect(() => {
    if (!sessionId) return
    fetchSession()
  }, [sessionId])

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
  const startSession = async () => {

    if (!session || user?.role !== 'trainer') return

    try {
      await axios.put(
        `${API_BASE_URL}/api/sessions/${session._id}/status`,
        { status: 'active' }
      )
      // console.log('[ZEGO] Starting session', { sessionId: session._id });
      setSessionStarted(true)
      setSession({ ...session, status: 'active' })
    } catch (err) {
      console.error('Failed to start session', err)
    }
  }

  //Forcely ends session for everyone (by TRAINER)  
  const endSession = async () => {

    if (!session || user?.role !== 'trainer') return

    try {
      await axios.put(
        `${API_BASE_URL}/api/sessions/${session._id}/end`
      )

      // console.log('[ZEGO] Ending session', { sessionId: session._id })

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
    if (!session || !containerRef.current) return

    // HARD GUARD — prevents double join
    if (hasJoinedRef.current) {
      console.warn('[ZEGO][FRONTEND] joinRoom blocked (already joined)')
      return
    }

    hasJoinedRef.current = true

    try {
      console.log('[ZEGO][FRONTEND] Requesting token from backend')

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
        token,        // Express token from backend
        roomID,
        userID,
        userName
      )

      const zp = ZegoUIKitPrebuilt.create(kitToken)
      zpRef.current = zp

      zp.joinRoom({
        container: containerRef.current,

        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference
        },

        onJoinRoom: () => {
          console.log('[ZEGO][UIKIT] Joined room successfully')
        },

        onLeaveRoom: () => {
          console.log('[ZEGO][UIKIT] Left room')
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
      hasJoinedRef.current = false
    }
  }



  const leaveRoom = () => {
    hasJoinedRef.current = false
    if (zpRef.current) {
      zpRef.current.destroy()   // 👈 THIS IS THE LEAVE
      zpRef.current = null
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }
  }


  useEffect(() => {
    if (!sessionStarted) return
    if (user?.role === 'trainer') {
      joinRoomWithToken()
    }
  }, [sessionStarted])


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
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <div className="text-lg font-bold">LearniLM🌎World</div>
            <div className="text-xs text-gray-500">
              {session.title} • {session.trainer.name}
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* SESSION INFO CARD */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                with {session.trainer.name}
              </p>
            </div>

            {/* STATUS BADGE */}
            <div
              className={`text-xs font-semibold px-3 py-1 rounded-full
              ${session.status === 'scheduled'
                  ? 'bg-yellow-100 text-yellow-700'
                  : session.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : session.status === 'ended'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-red-100 text-red-700'
                }`}
            >
              {session.status.toUpperCase()}
            </div>
          </div>

          {session.description && (
            <p className="mt-4 text-gray-700">
              {session.description}
            </p>
          )}

          {/* ACTIONS */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {/* TRAINER: START */}
            {session.status === 'scheduled' && user?.role === 'trainer' && (
              <button
                onClick={startSession}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Start Session
              </button>
            )}

            {/* STUDENT WAITING */}
            {session.status === 'scheduled' && user?.role === 'student' && (
              <div className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm">
                Waiting for trainer to start the session…
              </div>
            )}

            {/* LIVE SESSION */}
            {sessionStarted && (
              <>
                {user?.role === 'student' && (
                  <button
                    onClick={joinRoomWithToken}
                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                  >
                    Join Session
                  </button>
                )}

                {user?.role === 'trainer' && (
                  <button
                    onClick={endSession}
                    className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    End Session
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* VIDEO STAGE */}
        <div className="bg-black rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-[70vh] min-h-[520px] relative">
            <div
              ref={containerRef}
              className="w-full h-full zego-uikit-prebuilt"
            />

            {/* JOINING OVERLAY */}
            {sessionStarted && !zpRef.current && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm">
                Joining session…
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )

}

export default SessionRoom
