// src/pages/StudentDashboard.tsx
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, BookOpen, User, Calendar, Star, Clock,
  Video, Globe, LogOut, Menu, X, MessageSquare, TrendingUp, Users, MessageCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

/* ---------------------------
   Notes:
   - Converted to TypeScript (tsx)
   - UI/layout follows EducatorDashboard pattern (sidebar, top bar, content area)
   - Kept all original logic intact (API calls, handlers, modals, validations)
   - Preserved original color palette (primary teal: #9787F3)
   - Minor TS typing added for clarity, without altering behavior
   --------------------------- */

/* ---------- Types ---------- */
type AnyObj = Record<string, any>

/* Lightweight UI building blocks used by the requested Home screen */
/* ---------------- ServiceCard ---------------- */
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  bg?: string;
  title: string;
  desc: string;
  color: string;
}> = ({
  icon,
  bg = 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  title,
  desc,
}) => (
  <div className="p-6 rounded-2xl shadow-md bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    {/* Icon Section */}
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
      {icon}
    </div>

    {/* Title - dark and clear */}
    <h4 className="font-semibold text-xl text-[#2D274B]">
      {title}
    </h4>

    {/* Description */}
    <p className="text-sm text-gray-700 mt-2 leading-relaxed">
      {desc}
    </p>
  </div>
)


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; btnText: React.ReactNode; btnColor?: string }> = ({ icon, title, desc, btnText, btnColor = 'bg-emerald-500 hover:bg-emerald-600' }) => (
  <div className="p-6 rounded-2xl bg-white/90 border border-white/20 shadow-sm flex flex-col justify-between">
    <div>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 mt-2">{desc}</p>
    </div>
    <div className="mt-6">
      <button className={`px-4 py-2 text-white rounded-lg font-semibold ${btnColor}`}>{btnText}</button>
    </div>
  </div>
)
const FRONTEND_URL= import.meta.env.VITE_FRONTEND_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

/* ---------------- StudentDashboard ---------------- */
const StudentHome: React.FC = () => {
  const { user } = useAuth() as AnyObj
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalSpent: 0
  })
  const [recentSessions, setRecentSessions] = useState<AnyObj[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/sessions/my-sessions`),
        axios.get(`${API_BASE_URL}/api/bookings/my-bookings`)
      ])

      const sessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : []
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : []

      setStats({
        totalSessions: sessions.length,
        upcomingSessions: sessions.filter((s: AnyObj) => s.status === 'scheduled').length,
        completedSessions: sessions.filter((s: AnyObj) => s.status === 'completed').length,
        totalSpent: bookings.reduce((sum: number, b: AnyObj) => sum + (b.amount || 0), 0)
      })

      setRecentSessions(sessions.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto bg-[#dc8d33] p-6 rounded-2xl">
      {/* Welcome Section ( Shiny) */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#f97316] to-[#9787F3] shadow-2xl text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold drop-shadow-md">
            Welcome back, {user?.name || 'student'}!
          </h2>
        </div>
        <p className="text-white/90 font-medium">
          Continue your language learning journey
        </p>
      </div>

      {/* Stats Grid (No Shine) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="w-10 h-10 bg-[#9787F3] rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[#2D274B] mb-1">{stats.totalSessions}</div>
          <div className="text-[#9787F3] text-sm font-semibold">Total Sessions</div>
        </div>

        <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="w-10 h-10 bg-[#6ee7b7] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[#2D274B] mb-1">{stats.upcomingSessions}</div>
          <div className="text-[#16a34a] text-sm font-semibold">Upcoming</div>
        </div>

        <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[#2D274B] mb-1">{stats.completedSessions}</div>
          <div className="text-[#f97316] text-sm font-semibold">Completed</div>
        </div>

        <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="w-10 h-10 bg-[#9787F3] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[#2D274B] mb-1">${stats.totalSpent}</div>
          <div className="text-[#9787F3] text-sm font-semibold">Total Spent</div>
        </div>
      </div>

      {/* Recent Sessions (No Shine) */}
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#2D274B]">Recent Sessions</h3>
          <Link
            to="/student/sessions"
            className="text-[#9787F3] hover:text-[#6C5DD3] font-semibold transition-all"
          >
            View All
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session: AnyObj) => (
              <div
                key={session._id || session.id}
                className="p-4 bg-white rounded-xl flex items-center justify-between hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#9787F3] rounded-xl flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2D274B]">{session.title}</div>
                    <div className="text-gray-600 text-sm font-medium">
                      with {session.trainer?.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      session.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : session.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {session.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#9787F3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-[#9787F3]" />
            </div>
            <h3 className="text-xl font-bold text-[#2D274B] mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-4 font-medium">
              Start your learning journey today
            </p>
            <Link
              to="/main"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#e66a11] font-semibold shadow-md transition-all"
            >
              Book Your First Session
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- StudentSessions ---------------- */
const StudentSessions: React.FC = () => {
  const [sessions, setSessions] = useState<AnyObj[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<AnyObj | null>(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState('')
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sessions/my-sessions`)
      setSessions(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrainerIdFromSession = (session: AnyObj | null) => {
    if (!session) return null
    const trainer = session.trainer || session.trainerId || session.trainerObj
    if (!trainer) return null
    return trainer._id || trainer.id || trainer || null
  }

  const getBookingIdFromSession = (session: AnyObj | null) => {
    if (!session) return null
    if (Array.isArray(session.bookings) && session.bookings.length > 0) {
      return session.bookings[0]._id || session.bookings[0].id || null
    }
    if (session.booking) {
      return session.booking._id || session.booking.id || null
    }
    return session.bookingId || session.booking_id || null
  }

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedSession) return
    setSubmittingReview(true)
    setReviewError('')
    setReviewSuccess('')

    try {
      const trainerId = getTrainerIdFromSession(selectedSession)
      const bookingId = getBookingIdFromSession(selectedSession)

      if (!trainerId) throw new Error('Trainer ID not found on session')

      const payload = {
        sessionId: selectedSession._id || selectedSession.id,
        trainerId,
        bookingId,
        rating: reviewData.rating,
        comment: reviewData.comment
      }

      await axios.post(`${API_BASE_URL}/api/reviews`, payload)

      setReviewSuccess('Review submitted successfully')
      setShowReviewModal(false)
      setReviewData({ rating: 5, comment: '' })
      fetchSessions()
    } catch (error: any) {
      console.error('Failed to submit review:', error)
      setReviewError(error?.response?.data?.message || error.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-4 py-6">
      {/* Card Container */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">My Sessions</h2>

        {reviewSuccess && <div className="mb-4 text-sm text-green-700 font-medium">{reviewSuccess}</div>}
        {reviewError && <div className="mb-4 text-sm text-red-700 font-medium">{reviewError}</div>}

        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id || session.id}
                className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#9787F3] rounded-lg flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-xs text-gray-600">
                        with <span className="font-medium text-gray-800">{session.trainer?.name ?? '—'}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.scheduledDate
                          ? new Date(session.scheduledDate).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : session.status === 'active'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {String(session.status).toUpperCase()}
                    </div>

                    {/* changed the jitsi link to redirect when closed to us */}
                    <div className="flex gap-2">
                      {(session.status === 'scheduled' || session.status === 'active') ? (
                        <Link
                          to={`/student/session/${session._id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#9787F3] text-white rounded-md text-sm hover:bg-[#7f6ee5] focus:outline-none"
                        >
                          <Video className="h-4 w-4" /> <span>Join</span>
                        </Link>
                      ) : session.status === 'completed' ? (
                        <button
                          onClick={() => {
                            setSelectedSession(session)
                            setShowReviewModal(true)
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f97316] text-white rounded-md text-sm hover:bg-[#e66a11]"
                        >
                          <Star className="h-4 w-4" /> <span>Review</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {session.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{session.description}</p>
                )}

                <div className="flex items-center text-xs text-gray-500 font-medium mt-3 gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {session.duration}m</span>
                  </div>
                  {session.language && (
                    <div className="flex items-center gap-1">
                      <span className="mx-1">•</span>
                      <span>Language: {session.language}</span>
                    </div>
                  )}
                  {session.level && (
                    <div className="flex items-center gap-1">
                      <span className="mx-1">•</span>
                      <span>Level: {session.level}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#9787F3]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-7 w-7 text-[#9787F3]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No sessions yet</h3>
            <p className="text-sm text-gray-600 mb-4">Book your first session to get started</p>
            <Link
              to="/main"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#9787F3] text-white rounded-md text-sm hover:bg-[#7f6ee5]"
            >
              Browse Trainers
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSession && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 max-w-lg w-full shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Leave a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                      className={`p-1 rounded-md transition-colors ${
                        star <= reviewData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      aria-label={`Rate ${star}`}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-transparent text-sm"
                  rows={3}
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-3 py-2 border border-gray-200 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 px-3 py-2 bg-[#9787F3] text-white text-sm font-semibold rounded-md hover:bg-[#7f6ee5]"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- StudentProfile ---------------- */
const StudentProfile: React.FC = () => {
  const { user, updateProfile } = useAuth() as AnyObj

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile: {
      bio: '',
      languages: [] as string[],
      phone: '',
      location: '',
      imageUrl: '',
      highestQualification: '',
      collegeName: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setFormData({
      name: user.name || '',
      email: user.email || '',
      profile: {
        bio: user?.profile?.bio || '',
        languages: user?.profile?.languages || [],
        phone: user?.profile?.phone || '',
        location: user?.profile?.location || '',
        imageUrl: user?.profile?.imageUrl || '',
        highestQualification: user?.profile?.highestQualification || '',
        collegeName: user?.profile?.collegeName || ''
      }
    })
  }, [user])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          imageUrl: dataUrl
        }
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        imageUrl: ''
      }
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!formData.name?.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    try {
      const payload = {
        name: formData.name,
        profile: {
          bio: formData.profile.bio,
          languages: formData.profile.languages,
          phone: formData.profile.phone,
          location: formData.profile.location,
          imageUrl: formData.profile.imageUrl,
          highestQualification: formData.profile.highestQualification,
          collegeName: formData.profile.collegeName
        }
      }

      const result = await updateProfile?.(payload)

      if (result?.success) {
        setSuccess('Profile updated successfully!')
      } else {
        setError(result?.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-[900px] mx-auto">
      <div className="rounded-2xl p-8 bg-white shadow-xl border border-gray-100 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-[#2D274B] mb-6">
          My Profile
        </h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Image
            </label>

            <div className="flex items-start gap-4">
              <div className="w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                {formData.profile.imageUrl ? (
                  <img
                    src={formData.profile.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  id="profile.imageUrl"
                  name="profile.imageUrl"
                  value={formData.profile.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste image URL (or upload below)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
                />

                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="px-4 py-2 rounded-lg bg-gray-100 border text-sm hover:bg-gray-200">
                      Upload Image
                    </span>
                  </label>

                  {formData.profile.imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm border hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-medium text-sm"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="profile.bio"
              name="profile.bio"
              value={formData.profile.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
            />
          </div>

          {/* Contact + Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="profile.phone"
                value={formData.profile.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="profile.location"
                value={formData.profile.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Education Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Highest Qualification
              </label>
              <input
                type="text"
                name="profile.highestQualification"
                value={formData.profile.highestQualification}
                onChange={handleChange}
                placeholder="e.g. B.Sc. Computer Science"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College / University
              </label>
              <input
                type="text"
                name="profile.collegeName"
                value={formData.profile.collegeName}
                onChange={handleChange}
                placeholder="College or University name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#9787F3] text-white rounded-lg hover:bg-[#8a75f0] font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )

}

/* ---------------- StudentLanding Home ---------------- */
const StudentLanding: React.FC = () => {
  const { user } = useAuth() as AnyObj

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
      {/* Welcome Section (Shiny Gradient like Dashboard) */}
      <div className="rounded-2xl p-8 bg-gradient-to-r from-[#f97316] to-[#9787F3] shadow-2xl text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold drop-shadow-md">
            Keep Growing, {user?.name || "Learner"}! 🚀
          </h1>
        </div>
        <p className="text-white/90 font-medium">
          Every step you take brings you closer to mastering your goals with LearniLM🌎World..
        </p>
      </div>

      {/* Explore Services */}
      <div>
        <h2 className="text-2xl font-bold text-[#2D274B] mb-6 text-center">Explore Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            icon={<BookOpen className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-emerald-500 to-emerald-600"
            title="English Training"
            desc="Improve communication and language skills"
            color="text-emerald-100"
          />
          <ServiceCard
            icon={<Users className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-blue-500 to-blue-600"
            title="Professional Trainers"
            desc="Get expert guidance for your career path"
            color="text-blue-100"
          />
          <ServiceCard
            icon={<MessageCircle className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-purple-500 to-purple-600"
            title="Improve Communication"
            desc="Practice and perfect your interview skills"
            color="text-purple-100"
          />
          <ServiceCard
            icon={<Star className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-orange-500 to-orange-600"
            title="Language Development"
            desc="Build confidence and interpersonal skills"
            color="text-orange-100"
          />
        </div>
      </div>

      {/* Bottom Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FeatureCard
          icon={<Users className="w-6 h-6 text-emerald-500" />}
          title="Find Your Perfect Trainer"
          desc="Browse through our network of expert trainers and counselors to find the perfect match for your learning goals."
          btnText={<Link to="/main" className="block">Browse All Trainers</Link>}
          btnColor="bg-emerald-500 hover:bg-emerald-600"
        />
        <FeatureCard
          icon={<MessageCircle className="w-6 h-6 text-blue-500" />}
          title="Your Learning Journey"
          desc="Keep track of your sessions, view feedback from trainers, and monitor your progress."
          btnText={<Link to="/student/sessions" className="block">View My Sessions</Link>}
          btnColor="bg-blue-500 hover:bg-blue-600"
        />
      </div>
    </div>
  )
}


/* ---------------- StudentDashboard (root) ---------------- */
const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth() as AnyObj;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/student/home", icon: Home },
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "My Sessions", href: "/student/sessions", icon: Calendar },
    { name: "My Profile", href: "/student/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/student")
      return location.pathname === "/student" || location.pathname === "/student/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#dc8d33]">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 Sticky, scrollable header with shine and animation */}
      <header className="sticky top-0 z-40 bg-[#2D274B]/95 backdrop-blur-sm border-b border-white/30 text-[#dc8d33] shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#CBE56A] hover:text-[#dc8d33] transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Animated Logo with Link */}
            <Link to="/" className="flex items-center gap-1 group">
              <div className="text-xl md:text-xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center transition-transform duration-300 group-hover:scale-105">
                {/* LearniLM */}
                <span className="text-[#dc8d33] drop-shadow-lg group-hover:text-[#CBE56A] transition-colors">LearniLM</span>

                {/* Rotating Globe */}
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="inline-block mx-1 text-xl"
                >
                  🌎
                </motion.span>

                {/* World */}
                <span className="text-[#dc8d33] drop-shadow-lg group-hover:text-[#CBE56A] transition-colors">World</span>
              </div>
            </Link>
          </div>

          {/* Right: Role */}
          <div className="text-sm">
            Role:{" "}
            <span className="font-semibold text-[#CBE56A]">Student</span>
          </div>
        </div>
      </header>


      {/* Sidebar */}
      <div
        className={`fixed top-16 inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#2D274B] via-[#3B3361] to-[#2D274B] shadow-lg border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 mt-2 space-y-2">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-[#CBE56A] text-[#2D274B] shadow-md"
                    : "text-[#CBE56A] hover:bg-[#dc8d33]/20 hover:text-[#dc8d33] hover:translate-x-1"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" /> {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 bg-[#3B3361] text-[#CBE56A] hover:bg-[#CBE56A] hover:text-[#2D274B] rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <LogOut className="h-5 w-5 mr-3" /> Sign Out
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div className="pt-16 lg:pl-64"> {/* padding top = header height */}
        <div className="p-6">
          <Routes>
            <Route index element={<StudentHome />} />
            <Route path="home" element={<StudentLanding />} />
            <Route path="sessions" element={<StudentSessions />} />
            <Route path="profile" element={<StudentProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
