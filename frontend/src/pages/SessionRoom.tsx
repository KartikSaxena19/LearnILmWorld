import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Video, Users, Clock, Globe, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

interface Session {
  _id: string
  title: string
  description?: string
  trainer: { _id: string; name: string; email: string }
  students: Array<{ _id: string; name: string; email: string }>
  jitsiLink?: string
  jitsiRoomName?: string
  status: string
  duration?: number
  scheduledDate?: string
  language?: string
  level?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// helper to load Jitsi script and wait until window.JitsiMeetExternalAPI exists
const loadJitsiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).JitsiMeetExternalAPI) {
      return resolve()
    }

    const existing = document.querySelector('script[data-jitsi-api]')
    if (existing) {
      // if a script is already injected but api not yet available, wait a bit
      const checkInterval = setInterval(() => {
        if ((window as any).JitsiMeetExternalAPI) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 200)
      // safety timeout
      setTimeout(() => {
        clearInterval(checkInterval)
        if ((window as any).JitsiMeetExternalAPI) resolve()
        else reject(new Error('Jitsi API load timeout'))
      }, 10000)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.setAttribute('data-jitsi-api', 'true')
    script.onload = () => {
      // in some cases onload fires before API attached; wait shortly
      const checkInterval = setInterval(() => {
        if ((window as any).JitsiMeetExternalAPI) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 150)
      setTimeout(() => {
        clearInterval(checkInterval)
        if ((window as any).JitsiMeetExternalAPI) resolve()
        else reject(new Error('Jitsi API did not initialize after script load'))
      }, 8000)
    }
    script.onerror = () => reject(new Error('Failed to load Jitsi script'))
    document.body.appendChild(script)
  })
}

const SessionRoom: React.FC = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [jitsiLoading, setJitsiLoading] = useState(false)
  const jitsiApiRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (sessionId) fetchSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const fetchSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sessions/${sessionId}`)
      setSession(response.data)
      if (response.data.status === 'active') {
        setSessionStarted(true)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load session')
    } finally {
      setLoading(false)
    }
  }

  // start the session (trainer)
  const startSession = async () => {
    if (!session || user?.role !== 'trainer') return
    try {
      await axios.put(`${API_BASE_URL}/api/sessions/${session._id}/status`, { status: 'active' })
      setSessionStarted(true)
      setSession({ ...session, status: 'active' })
      // optionally auto-scroll into view:
      setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth' }), 300)
    } catch (err) {
      console.error('Failed to start session', err)
    }
  }

  const endSession = async () => {
    if (!session || user?.role !== 'trainer') return
    try {
      await axios.put(`${API_BASE_URL}/api/sessions/${session._id}/status`, { status: 'completed' })
      // dispose Jitsi if active
      if (jitsiApiRef.current) {
        try { jitsiApiRef.current.dispose() } catch {}
        jitsiApiRef.current = null
      }
      navigate(user.role === 'trainer' ? '/trainer/sessions' : '/student/sessions')
    } catch (err) {
      console.error('Failed to end session', err)
    }
  }

  // create the Jitsi instance (safe initialization)
  const startEmbeddedJitsi = async () => {
    if (!session || !session.jitsiRoomName) {
      setError('Missing jitsiRoomName for this session')
      return
    }
    if (jitsiApiRef.current) return // already created

    try {
      setJitsiLoading(true)
      await loadJitsiScript()
      if (!(window as any).JitsiMeetExternalAPI) {
        setError('Jitsi API not available')
        setJitsiLoading(false)
        return
      }

      const domain = 'meet.jit.si'
      const options = {
        roomName: session.jitsiRoomName,
        parentNode: containerRef.current,
        width: '100%',
        height: 600,
        userInfo: { displayName: user?.name || 'Guest' },
        configOverwrite: {
          prejoinPageEnabled: false // optional: skip prejoin
        },
        interfaceConfigOverwrite: {
          SHOW_WATERMARK_FOR_GUESTS: false
        }
      }

      // @ts-ignore
      const api = new (window as any).JitsiMeetExternalAPI(domain, options)
      jitsiApiRef.current = api

      api.addEventListener('videoConferenceJoined', () => {
        console.log('Joined Jitsi room', session.jitsiRoomName)
      })

      api.addEventListener('readyToClose', () => {
        // cleanup then navigate back
        try { api.dispose() } catch {}
        jitsiApiRef.current = null
        navigate(user?.role === 'trainer' ? '/trainer/sessions' : '/student/sessions')
      })

      // also listen for participantLeft / ended events if needed

    } catch (err) {
      console.error('Failed to initialize Jitsi:', err)
      setError('Failed to load meeting. Check console.')
    } finally {
      setJitsiLoading(false)
    }
  }

  // when sessionStarted flips to true, start Jitsi
  useEffect(() => {
    if (sessionStarted) startEmbeddedJitsi()
    // cleanup if user navigates away
    return () => {
      if (jitsiApiRef.current) {
        try { jitsiApiRef.current.dispose() } catch {}
        jitsiApiRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStarted, session?.jitsiRoomName])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading session…</div>
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-xl font-semibold">Session not available</h2>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-4 btn-primary">Go back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <div className="font-bold">LEARN🌎SPHERE</div>
            <div className="text-xs text-gray-500">Live lessons</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm">Back</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg p-6 shadow mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{session.title}</h1>
              <p className="text-sm text-gray-600">with {session.trainer.name}</p>
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-gray-100">{session.status}</div>
          </div>

          <p className="mt-4 text-gray-700">{session.description}</p>

          <div className="mt-6 flex items-center gap-3">
            {session.status === 'scheduled' && user?.role === 'trainer' && (
              <button onClick={startSession} className="btn-primary">Start Session</button>
            )}

            {(session.status === 'active' || sessionStarted) && (
              <>
                {!sessionStarted ? (
                  <button onClick={() => setSessionStarted(true)} className="btn-primary">
                    <Video className="inline-block mr-2" /> Join Video Call
                  </button>
                ) : (
                  <div className="text-sm text-gray-600">Meeting is live below</div>
                )}
                {user?.role === 'trainer' && (
                  <button onClick={endSession} className="btn-secondary ml-3">End Session</button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Jitsi container */}
        <div ref={containerRef} id="jitsi-container" className="w-full rounded-lg overflow-hidden shadow" style={{ minHeight: 200 }}>
          {jitsiLoading && (
            <div className="p-8 text-center text-gray-600">Loading meeting…</div>
          )}
          {!sessionStarted && <div className="p-6 text-sm text-gray-500">Click “Join Video Call” to load the meeting here.</div>}
        </div>
      </main>
    </div>
  )
}

export default SessionRoom
