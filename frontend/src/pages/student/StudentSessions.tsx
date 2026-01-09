// src/pages/student/StudentSession.tsx
import React, { useEffect, useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Calendar, Star, Clock,
  Video, X
} from 'lucide-react'
import axios from 'axios'

/* ---------- Types ---------- */
type AnyObj = Record<string, any>

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const hasUserReviewedSession = (session: AnyObj) => {
    return Boolean(
      session.review ||
      session.reviewId ||
      (Array.isArray(session.reviews) && session.reviews.length > 0)
    )
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
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${['ended', 'completed'].includes(session.status)
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
                          to={`/session/${session._id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#9787F3] text-white rounded-md text-sm hover:bg-[#7f6ee5] focus:outline-none"
                        >
                          <Video className="h-4 w-4" /> <span>Join</span>
                        </Link>
                      ) : (session.status === 'completed' || session.status === 'ended') ? (
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
                      className={`p-1 rounded-md transition-colors ${star <= reviewData.rating
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

export default StudentSessions