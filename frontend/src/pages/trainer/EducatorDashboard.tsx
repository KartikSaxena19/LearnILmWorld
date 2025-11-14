// src/pages/EducatorDashboard.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, Users, Calendar, DollarSign, User, Star,
  Video, Globe, LogOut, Menu, X, Plus, Clock,
  MessageSquare, Award, BookOpen, Edit3, TrendingUp
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

/* -------------------------
   Trainer sub-pages (all inside same file)
   - TrainerHome
   - TrainerSessions
   - TrainerStudents
   - TrainerReviews
   - TrainerProfile
   ------------------------- */

/* ---------- TrainerHome ---------- */
const FRONTEND_URL= import.meta.env.VITE_FRONTEND_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const TrainerHome = () => {
  const { user } = useAuth() || {}
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 5.0,
    totalStudents: 0,
    upcomingSessions: 0
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, bookingsRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/sessions/my-sessions`),
        axios.get(`${API_BASE_URL}/api/bookings/trainer-bookings`),
        axios.get(`${API_BASE_URL}/api/auth/me`)
      ])
      const sessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : []
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : []
      const userData = userRes.data || {}

      setStats({
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        upcomingSessions: sessions.filter(s => s.status === 'scheduled').length,
        totalEarnings: userData.stats?.totalEarnings || 0,
        averageRating: userData.stats?.rating || 5.0,
        totalStudents: new Set(bookings.map(b => b.student?._id || b.studentId)).size
      })
      setRecentBookings(bookings.slice(0, 5))
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
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
    <div className="space-y-8 max-w-[1200px] mx-auto  p-6 rounded-2xl">
      {/* Welcome Section */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#9787F3] to-[#f97316] shadow-2xl text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold drop-shadow-md">
            Welcome back, {user?.name || 'Trainer'}!
          </h2>
        </div>
        <p className="text-white/90 font-medium">
          Empower your students and grow your teaching journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard color="#9787F3" icon={<BookOpen />} label="Total Sessions" value={stats.totalSessions} />
        <StatCard color="#22c55e" icon={<Calendar />} label="Upcoming" value={stats.upcomingSessions} />
        <StatCard color="#f97316" icon={<Star />} label="Completed" value={stats.completedSessions} />
        <StatCard color="#16a34a" icon={<DollarSign />} label="Total Earnings" value={`$${stats.totalEarnings}`} />
        <StatCard color="#0ea5e9" icon={<Users />} label="Students" value={stats.totalStudents} />
        <StatCard color="#facc15" icon={<Award />} label="Rating" value={stats.averageRating.toFixed(1)} />
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl p-6 bg-white shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#2D274B]">Recent Bookings</h3>
          <Link
            to="/trainer/students"
            className="text-[#9787F3] hover:text-[#6C5DD3] font-semibold transition-all"
          >
            View All Students
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking._id || booking.id}
                className="p-4 bg-white rounded-xl flex items-center justify-between hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#9787F3] rounded-xl flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2D274B]">{booking.studentName || booking.student?.name}</div>
                    <div className="text-gray-600 text-sm font-medium">
                      ${booking.amount} • {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#9787F3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[#9787F3]" />
            </div>
            <h3 className="text-xl font-bold text-[#2D274B] mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4 font-medium">
              You’ll see bookings here once students start enrolling
            </p>
            <Link
              to="/trainer/sessions"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#e66a11] font-semibold shadow-md transition-all"
            >
              View Your Sessions
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}



/* ---------------- StatCard Component ---------------- */
type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
};
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="rounded-xl p-5 text-center bg-white shadow-md border border-gray-100 hover:scale-105 transition-all duration-300">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <div className="text-2xl font-bold text-[#2D274B] mb-1">{value}</div>
    <div className="text-sm font-semibold" style={{ color }}>{label}</div>
  </div>
)

/* ---------- TrainerSessions ---------- */
const TrainerSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sessions/my-sessions`);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      await axios.put(`${API_BASE_URL}/api/sessions/${sessionId}/status`, { status });
      fetchSessions();
    } catch (err) {
      console.error("Failed to update session status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-900">My Sessions</h2>
        <Link
          to="/trainer/students"
          className="px-5 py-2 rounded-xl bg-[#3B3361] text-[#CBE56A] font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
        >
          <Calendar className="h-5 w-5 mr-2" /> Create New Session
        </Link>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <div
                key={session._id || session.id}
                className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#CBE56A] rounded-lg flex items-center justify-center shrink-0">
                      <Video className="h-5 w-5 text-[#3B3361]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-xs text-gray-600">
                        {session.students?.length || 0} student(s)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.scheduledDate
                          ? new Date(session.scheduledDate).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Status + Buttons */}
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        session.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : session.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : session.status === "active"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {String(session.status).toUpperCase()}
                    </div>

                    <div className="flex gap-2">
  {session.status === "scheduled" && (
    <button
      onClick={async () => {
        try {
          // 1️⃣ Update session to "active"
          await updateSessionStatus(session._id || session.id, "active");

          // 2️⃣ Open Jitsi in a new tab after update
          const meetingUrl = `${session.jitsiLink}?config.closePageUrl=${encodeURIComponent(`${FRONTEND_URL}/trainer/sessions`)}`;
          window.open(meetingUrl, "_blank");
        } catch (err) {
          console.error("Failed to start session:", err);
        }
      }}
      className="px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-xl text-sm"
    >
      Start
    </button>
  )}

  {session.status === "active" && (
    <>
      <a
        href={`${session.jitsiLink}?config.closePageUrl=${encodeURIComponent(`${FRONTEND_URL}/trainer/sessions`)}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-xl text-sm"
      >
        <Video className="h-4 w-4 mr-2" /> Join
      </a>

      <button
        onClick={() => updateSessionStatus(session._id || session.id, "completed")}
        className="px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-xl text-sm"
      >
        End
      </button>
    </>
  )}
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
                  {session.jitsiRoomName && (
                    <div className="flex items-center gap-1 text-[#3B3361] font-semibold">
                      <span className="mx-1">•</span>
                      <span>Room: {session.jitsiRoomName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#3B3361]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-7 w-7 text-[#3B3361]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No sessions yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create your first session with your students
            </p>
            <Link
              to="/trainer/students"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-xl hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Students
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};


/* ---------- TrainerStudents ---------- */
const TrainerStudents = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    duration: 60,
    language: "",
    level: "beginner",
    scheduledDate: "",
    scheduledTime: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings/trainer-bookings`);
      setBookings(
        Array.isArray(res.data)
          ? res.data.filter((b) => b.paymentStatus === "completed")
          : []
      );
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookings.length === 0) {
      alert("Please select at least one student");
      return;
    }
    try {
      const scheduledDateTime = new Date(
        `${sessionData.scheduledDate}T${sessionData.scheduledTime}`
      );
      await axios.post(`${API_BASE_URL}/api/sessions`, {
        ...sessionData,
        bookingIds: selectedBookings,
        scheduledDate: scheduledDateTime.toISOString(),
      });
      setShowCreateModal(false);
      setSelectedBookings([]);
      setSessionData({
        title: "",
        description: "",
        duration: 60,
        language: "",
        level: "beginner",
        scheduledDate: "",
        scheduledTime: "",
      });
      fetchBookings();
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create session");
    }
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }

  return (
  <div className="space-y-8 max-w-[1200px] mx-auto p-6">
    <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#2D274B]">My Students</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-5 py-2 rounded-xl bg-[#3B3361] text-[#CBE56A] font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" /> Create Session
        </button>
      </div>

      {/* Student List */}
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div
              key={booking._id || booking.id}
              className="p-6 bg-white rounded-xl flex items-center justify-between hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center">
                {/* Icon Box - matches home section style */}
                <div className="w-10 h-10 bg-[#9787F3] rounded-lg flex items-center justify-center mr-4">
                  <User className="h-5 w-5 text-white" />
                </div>

                {/* Student Info */}
                <div>
                  <div className="font-bold text-[#2D274B]">
                    {booking.studentName || booking.student?.name}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {booking.student?.email}
                  </div>
                  <div className="text-gray-500 text-sm font-medium">
                    Booked on{" "}
                    {new Date(booking.createdAt).toLocaleDateString()} • $
                    {booking.amount}
                  </div>
                </div>
              </div>

              {/* Status + Selection */}
              <div className="text-right">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                    booking.sessionId
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.sessionId ? "Session Created" : "Awaiting Session"}
                </div>

                {!booking.sessionId && (
                  <label className="flex items-center cursor-pointer justify-end">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking._id || booking.id)}
                      onChange={() => toggleBookingSelection(booking._id || booking.id)}
                      className="mr-2 accent-[#3B3361]"
                    />
                    <span className="text-sm text-gray-600">
                      Select for session
                    </span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#9787F3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-[#9787F3]" />
          </div>
          <h3 className="text-xl font-bold text-[#2D274B] mb-2">
            No students yet
          </h3>
          <p className="text-gray-600 font-medium">
            Students will appear here after they book sessions with you
          </p>
        </div>
      )}
    </div>

    {/* Create Session Modal (unchanged) */}
    {showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#2D274B]">
              Create New Session
            </h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleCreateSession} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selected Students ({selectedBookings.length})
              </label>
              <div className="text-sm text-gray-600">
                {selectedBookings.length === 0
                  ? "Please select students from the list above"
                  : `${selectedBookings.length} student(s) selected`}
              </div>
            </div>

            {/* Rest of modal form remains unchanged */}
            {/* ... */}
          </form>
        </div>
      </div>
    )}
  </div>
)

};

/* ---------- TrainerReviews ---------- */
const TrainerReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } })

  useEffect(() => { fetchReviews() }, [])

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reviews/trainer-reviews`)
      const reviewsData = Array.isArray(res.data) ? res.data : []
      setReviews(reviewsData)

      const totalReviews = reviewsData.length
      const averageRating = totalReviews > 0 ? reviewsData.reduce((s, r) => s + (r.rating || 0), 0) / totalReviews : 0
      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      reviewsData.forEach(r => { const rInt = Math.round(r.rating || 0); if (ratingDistribution[rInt] !== undefined) ratingDistribution[rInt]++ })

      setStats({ averageRating: Math.round(averageRating * 10) / 10, totalReviews, ratingDistribution })
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setLoading(false)
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
  <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
    {/* Top Summary Section */}
    <div className="grid md:grid-cols-2 gap-8">
      {/* Average Rating Card */}
      <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100 text-center">
        <div className="text-6xl font-extrabold text-[#3B3361] mb-3">
          {stats.averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 ${
                i < Math.floor(stats.averageRating)
                  ? "text-[#CBE56A] fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-700 font-medium">Average Rating</p>
        <p className="text-sm text-gray-500 mt-2">
          {stats.totalReviews} total reviews
        </p>
      </div>

      {/* Rating Distribution Card */}
      <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-[#3B3361] mb-6">
          Rating Distribution
        </h3>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <span className="w-8 text-sm font-semibold text-[#3B3361]">
                {rating}
              </span>
              <Star className="h-4 w-4 text-[#CBE56A] fill-current mx-2" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                <div
                  className="bg-[#3B3361] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      stats.totalReviews > 0
                        ? (stats.ratingDistribution[rating] /
                            stats.totalReviews) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {stats.ratingDistribution[rating]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Reviews List */}
    <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100">
      <h3 className="text-3xl font-bold text-[#3B3361] mb-8">All Reviews</h3>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id || review.id}
              className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#9787F3] rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#2D274B]">
                      {review.studentName || review.student?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (review.rating || 0)
                          ? "text-[#CBE56A] fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#9787F3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-[#9787F3]" />
          </div>
          <h3 className="text-xl font-bold text-[#2D274B] mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600">
            Reviews from students will appear here after completed sessions.
          </p>
        </div>
      )}
    </div>
  </div>
)
}

/* ---------- TrainerProfile (form) ---------- */
const TrainerProfile = () => {
  const { user, updateProfile } = useAuth()
  const CURRENT_YEAR = new Date().getFullYear()

  const defaultProfile = {
    bio: user?.profile?.bio || '',
    imageUrl: user?.profile?.imageUrl || '',
    avatar: user?.profile?.avatar || '',
    languages: Array.isArray(user?.profile?.languages) ? [...user.profile.languages] : [],
    trainerLanguages: Array.isArray(user?.profile?.trainerLanguages) ? [...user.profile.trainerLanguages] : [],
    experience: user?.profile?.experience ?? 0,
    hourlyRate: user?.profile?.hourlyRate ?? 25,
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    specializations: Array.isArray(user?.profile?.specializations) ? [...user.profile.specializations] : [],
    certifications: Array.isArray(user?.profile?.certifications) 
      ? user.profile.certifications.map(cert => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
          year: cert.year || null,
          certificateImage: cert.certificateImage || '',
          certificateLink: cert.certificateLink || ''
        }))
      : [],
    availability: Array.isArray(user?.profile?.availability) ? [...user.profile.availability] : [],
    profileImages: Array.isArray(user?.profile?.profileImages) ? [...user.profile.profileImages] : [],
    socialMedia: {
      instagram: (user?.profile?.socialMedia && (user.profile.socialMedia.get ? user.profile.socialMedia.get('instagram') : user.profile.socialMedia.instagram)) || '',
      youtube: (user?.profile?.socialMedia && (user.profile.socialMedia.get ? user.profile.socialMedia.get('youtube') : user.profile.socialMedia.youtube)) || '',
      linkedin: (user?.profile?.socialMedia && (user.profile.socialMedia.get ? user.profile.socialMedia.get('linkedin') : user.profile.socialMedia.linkedin)) || ''
    },
    teachingStyle: user?.profile?.teachingStyle || 'Conversational',
    studentAge: Array.isArray(user?.profile?.studentAge) ? [...user.profile.studentAge] : [],
    demoVideo: user?.profile?.demoVideo || '',
    isAvailable: user?.profile?.isAvailable ?? true,
    totalBookings: user?.profile?.totalBookings ?? 0,
    averageRating: user?.profile?.averageRating ?? 5.0,
  }

  const certFields = [
    { key: 'name', type: 'text', placeholder: 'Certification Name' },
    { key: 'issuer', type: 'text', placeholder: 'Issuer' },
    { key: 'year', type: 'number', placeholder: 'Year', min: 1950, max: CURRENT_YEAR },
    { key: 'certificateLink', type: 'url', placeholder: 'https://certificate-link.com' }
  ]


  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profile: defaultProfile
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const [newSpecialization, setNewSpecialization] = useState('')
  const [newStudentAge, setNewStudentAge] = useState('')
  const [newProfileImage, setNewProfileImage] = useState('')

  useEffect(() => {
    // ensure availability has 7 days (preserve existing)
    const ALL_DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
    const existing = (formData.profile.availability || []).reduce((acc, a) => { if (a && a.day) acc[a.day] = a; return acc }, {})
    const availability = ALL_DAYS.map(d => existing[d] || { day: d, startTime: null, endTime: null, available: false })
    if ((formData.profile.availability || []).length < 7) {
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, availability } }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* --- Generic handlers --- */
  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('profile.socialMedia.')) {
      const key = name.split('.')[2]
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, socialMedia: { ...prev.profile.socialMedia, [key]: value } } }))
      return
    }
    if (name.startsWith('profile.')) {
      const key = name.replace('profile.', '')
      const parsed = (key === 'experience' || key === 'hourlyRate') ? (parseFloat(value) || 0) : value
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, [key]: parsed } }))
      return
    }
    // top-level fields (name, email)
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addToArray = (field:any, value:unknown) => {
    if (!value) return
    setFormData(prev => ({ ...prev, profile: { ...prev.profile, [field]: [...(prev.profile[field] || []), value] } }))
  }
  const removeFromArray = (field:any, index:number) => {
    setFormData(prev => ({ ...prev, profile: { ...prev.profile, [field]: (prev.profile[field] || []).filter((_, i) => i !== index) } }))
  }

  const updateObjectInArray = (field, index, subfield, value) => {
    setFormData(prev => {
      const arr = Array.isArray(prev.profile[field]) ? [...prev.profile[field]] : []
      arr[index] = { ...arr[index], [subfield]: value }
      return { ...prev, profile: { ...prev.profile, [field]: arr } }
    })
  }

  const addComplexToArray = (field, obj) => {
    setFormData(prev => ({ ...prev, profile: { ...prev.profile, [field]: [...(prev.profile[field] || []), obj] } }))
  }

  const updateTrainerLangLevels = (index, value) => {
    const levels = String(value).split(',').map(s => s.trim()).filter(Boolean)
    updateObjectInArray('trainerLanguages', index, 'teachingLevel', levels)
  }

  const updateAvailability = (index, subfield, value) => {
    setFormData(prev => {
      const arr = Array.isArray(prev.profile.availability) ? [...prev.profile.availability] : []
      arr[index] = { ...arr[index], [subfield]: value }
      // if available turned off, clear times
      if (subfield === 'available' && !value) { arr[index].startTime = null; arr[index].endTime = null }
      return { ...prev, profile: { ...prev.profile, availability: arr } }
    })
  }

  const updateCertYear = (index, value) => {
    const year = value ? parseInt(value, 10) : null
    updateObjectInArray('certifications', index, 'year', year)
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

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')

    // local validation for cert years
    const badCert = (formData.profile.certifications || []).some(c => c.year && (c.year < 1950 || c.year > CURRENT_YEAR))
    if (badCert) {
      setError(`Certification year must be between 1950 and ${CURRENT_YEAR}`)
      setLoading(false); return
    }

    try {

      if (!user) {
      setError('User not found')
      setLoading(false)
      return
    }
    
       const updatedProfile = {
      ...user.profile,       // existing fields
      ...formData.profile    // updated fields from form
    }

      const result = await updateProfile({ 
      ...formData, 
      profile: updatedProfile 
    }) // expects updateProfile from context to return { success, error? }

      if (result?.success) setSuccess('Profile updated successfully!')
      else setError(result?.error || 'Failed to update profile')
    } catch (err) {
      console.error(err); setError('Failed to update profile')
    } finally { setLoading(false) }
  }

  // prefer imageUrl (primary) > avatar > first profileImages > empty
  const getPrimaryImage = () => {
    return formData.profile?.imageUrl || formData.profile?.avatar || (Array.isArray(formData.profile?.profileImages) && formData.profile.profileImages[0]) || ''
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
          
        </div>

         {/* Image: preview + URL + file upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Profile image</label>

            <div className="flex items-start gap-4">
              <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                {formData.profile.imageUrl ? (
                  // preview (base64 or remote url)
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img src={formData.profile.imageUrl} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-slate-500 px-2 text-center">No image</div>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5a3] focus:border-[#0ea5a3] transition-all duration-300 font-medium"
                />

                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer inline-block">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <span className="px-4 py-2 rounded-lg bg-gray-100 border font-medium text-sm hover:bg-gray-200">Upload image</span>
                  </label>

                  {formData.profile.imageUrl && (
                    <button type="button" onClick={handleRemoveImage} className="px-4 py-2 rounded-lg bg-red-50 border text-red-600 text-sm hover:bg-red-100">
                      Remove
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500">Tip: Paste an image URL or upload a file. Upload uses a local base64 preview — to persist, your updateProfile should accept image data or you should upload to storage and save resulting URL.</div>
              </div>
            </div>
          </div>

        {success && <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">{success}</div>}
        {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input name="email" type="email" value={formData.email} className="input-field bg-gray-50" disabled />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input name="profile.phone" value={formData.profile.phone} onChange={handleChange} className="input-field" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input name="profile.location" value={formData.profile.location} onChange={handleChange} className="input-field" placeholder="City, Country" />
              </div>

              
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea name="profile.bio" value={formData.profile.bio} onChange={handleChange} className="input-field" rows={4} placeholder="Tell students about yourself..." />
            </div>
          </div>


          {/* Resume Upload */}
          {/* <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  const dataUrl = reader.result as string
                  setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, resume: dataUrl }
                  }))
                }
                reader.readAsDataURL(file)
              }}
              className="input-field"
            />
            {formData.profile.resume && (
              <div className="mt-2">
                <a href={formData.profile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View Uploaded Resume
                </a>
                <button
                  type="button"
                  className="ml-2 text-red-600"
                  onClick={() => setFormData(prev => ({ ...prev, profile: { ...prev.profile, resume: '' } }))}
                >
                  Remove
                </button>
              </div>
            )}
          </div> */}


          {/* Teaching Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Teaching Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                <input type="number" name="profile.experience" value={formData.profile.experience} onChange={handleChange} className="input-field" min={0} step={0.5} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
                <input type="number" name="profile.hourlyRate" value={formData.profile.hourlyRate} onChange={handleChange} className="input-field" min={1} step={1} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teaching Style</label>
                <select name="profile.teachingStyle" value={formData.profile.teachingStyle} onChange={handleChange} className="input-field">
                  <option>Conversational</option>
                  <option>Grammar-focused</option>
                  <option>Immersive</option>
                  <option>Business-oriented</option>
                  <option>Exam Preparation</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Is Available for New Bookings</label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!formData.profile.isAvailable} onChange={(e) => setFormData(prev => ({ ...prev, profile: { ...prev.profile, isAvailable: e.target.checked } }))} />
                  <span>Yes</span>
                </label>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Languages</label>
              <ul className="space-y-2 mb-4">
                {(formData.profile.languages || []).map((lang, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    {lang}
                    <button type="button" onClick={() => removeFromArray('languages', idx)} className="text-red-600">Remove</button>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} className="input-field flex-1 mr-2" placeholder="Add new language" />
                <button type="button" onClick={() => { addToArray('languages', newLanguage); setNewLanguage('') }} className="btn-primary">Add</button>
              </div>
            </div>

            {/* Specializations */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specializations</label>
              <ul className="space-y-2 mb-4">
                {(formData.profile.specializations || []).map((spec, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">{spec}
                    <button type="button" onClick={() => removeFromArray('specializations', idx)} className="text-red-600">Remove</button>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input type="text" value={newSpecialization} onChange={(e) => setNewSpecialization(e.target.value)} className="input-field flex-1 mr-2" placeholder="Add new specialization" />
                <button type="button" onClick={() => { addToArray('specializations', newSpecialization); setNewSpecialization('') }} className="btn-primary">Add</button>
              </div>
            </div>

            {/* Student Age */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student Age Groups</label>
              <ul className="space-y-2 mb-4">
                {(formData.profile.studentAge || []).map((age, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">{age}
                    <button type="button" onClick={() => removeFromArray('studentAge', idx)} className="text-red-600">Remove</button>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input type="text" value={newStudentAge} onChange={(e) => setNewStudentAge(e.target.value)} className="input-field flex-1 mr-2" placeholder="Add new age group (e.g., Kids)" />
                <button type="button" onClick={() => { addToArray('studentAge', newStudentAge); setNewStudentAge('') }} className="btn-primary">Add</button>
              </div>
            </div>

            {/* Trainer Languages (complex) */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Trainer Languages</label>
              {(formData.profile.trainerLanguages || []).map((tl, idx) => (
                <div key={idx} className="bg-gray-100 p-4 rounded mb-4 space-y-2">
                  <input type="text" value={tl.language || ''} onChange={(e) => updateObjectInArray('trainerLanguages', idx, 'language', e.target.value)} className="input-field" placeholder="Language" />
                  <select value={tl.proficiency || 'Fluent'} onChange={(e) => updateObjectInArray('trainerLanguages', idx, 'proficiency', e.target.value)} className="input-field">
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                  </select>
                  <input type="text" value={(tl.teachingLevel || []).join(', ')} onChange={(e) => updateTrainerLangLevels(idx, e.target.value)} className="input-field" placeholder="Teaching Levels (comma-separated)" />
                  <button type="button" onClick={() => removeFromArray('trainerLanguages', idx)} className="text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addComplexToArray('trainerLanguages', { language: '', proficiency: 'Fluent', teachingLevel: [] })} className="btn-primary">Add Trainer Language</button>
            </div>

            {/* Certifications */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Certifications</label>
              {(formData.profile.certifications || []).map((cert, idx) => (
                <div key={idx} className="bg-gray-100 p-4 rounded mb-4 space-y-2">
                  
                  {certFields.map(f => (
                    <input
                      key={f.key}
                      type={f.type}
                      value={cert[f.key] ?? ''}
                      placeholder={f.placeholder}
                      min={f.min}
                      max={f.max}
                      onChange={(e) => {
                        const val = f.type === 'number' ? parseInt(e.target.value, 10) || null : e.target.value
                        updateObjectInArray('certifications', idx, f.key, val)
                      }}
                      className="input-field"
                    />
                  ))}

                  {/* Certificate Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Certificate Image</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => updateObjectInArray('certifications', idx, 'certificateImage', reader.result as string);
                      reader.readAsDataURL(file);
                    }} className="input-field" />
                    {cert.certificateImage && <img src={cert.certificateImage} alt="Cert" className="w-32 h-32 mt-2 object-cover rounded border" />}
                  </div>

                  <button type="button" onClick={() => removeFromArray('certifications', idx)} className="text-red-600">Remove</button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addComplexToArray  ('certifications', {
                    name: '',
                    issuer: '',
                    year: null,
                    certificateImage: '',
                    certificateLink: ''
                  })
                }
                className="btn-primary"
              >
                Add Certification
              </button>
            </div>


            {/* Availability */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
              {(formData.profile.availability || []).map((av, idx) => (
                <div key={String(av.day || idx)} className="bg-gray-100 p-4 rounded mb-4 space-y-2">
                  <div className="font-medium capitalize">{av.day}</div>
                  <label className="flex items-center"><input type="checkbox" checked={!!av.available} onChange={(e) => updateAvailability(idx, 'available', e.target.checked)} className="mr-2" /> Available</label>
                  {av.available && (
                    <div className="flex items-center space-x-2">
                      <input type="time" value={av.startTime || ''} onChange={(e) => updateAvailability(idx, 'startTime', e.target.value)} className="input-field" />
                      <span>to</span>
                      <input type="time" value={av.endTime || ''} onChange={(e) => updateAvailability(idx, 'endTime', e.target.value)} className="input-field" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Media & Social */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Media & Social Links</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Demo Video URL (YouTube)</label>
                <input type="url" name="profile.demoVideo" value={formData.profile.demoVideo} onChange={handleChange} className="input-field" placeholder="https://www.youtube.com/watch?v=..." />
              </div>

              

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                <input type="url" name="profile.socialMedia.instagram" value={formData.profile.socialMedia.instagram} onChange={handleChange} className="input-field" placeholder="https://instagram.com/username" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                <input type="url" name="profile.socialMedia.youtube" value={formData.profile.socialMedia.youtube} onChange={handleChange} className="input-field" placeholder="https://youtube.com/channel/..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                <input type="url" name="profile.socialMedia.linkedin" value={formData.profile.socialMedia.linkedin} onChange={handleChange} className="input-field" placeholder="https://linkedin.com/in/username" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? 'Updating...' : 'Update Profile'}</button>
            <button type="button" onClick={() => { setFormData({ name: user?.name || '', email: user?.email || '', profile: defaultProfile }); setSuccess(''); setError('') }} className="btn-ghost">Reset</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------------- EducatorDashboard (root) ---------------- */
const EducatorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/trainer", icon: Home },
    { name: "My Sessions", href: "/trainer/sessions", icon: Calendar },
    { name: "Students", href: "/trainer/students", icon: Users },
    { name: "Reviews", href: "/trainer/reviews", icon: Star },
    { name: "Profile", href: "/trainer/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/trainer")
      return location.pathname === "/trainer" || location.pathname === "/trainer/";
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

      {/* 🔹 Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#2D274B]/95 backdrop-blur-sm border-b border-white/30 text-[#dc8d33] shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#CBE56A] hover:text-[#dc8d33] transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center gap-1 group">
              <div className="text-xl md:text-xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center transition-transform duration-300 group-hover:scale-105">
                <span className="text-[#dc8d33] drop-shadow-lg group-hover:text-[#CBE56A] transition-colors">
                  LearniLM
                </span>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="inline-block mx-1 text-xl"
                >
                  🌎
                </motion.span>
                <span className="text-[#dc8d33] drop-shadow-lg group-hover:text-[#CBE56A] transition-colors">
                  World
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Role + Stats */}
          <div className="flex items-center gap-6 text-sm text-[#CBE56A]">
            <span className="text-[#dc8d33]">
              Role: <span className="font-semibold text-[#CBE56A]">Educator</span>
            </span>
            <span className="text-[#dc8d33]">
              Rating:{" "}
              <span className="font-semibold text-[#CBE56A]">
                {user?.stats?.rating || "5.0"}
              </span>
            </span>
            <span className="text-[#dc8d33]">
              Earnings:{" "}
              <span className="font-semibold text-[#CBE56A]">
                ${user?.stats?.totalEarnings || 0}
              </span>
            </span>
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

        {/* Logout Button */}
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
      <div className="pt-16 lg:pl-64">
        <div className="p-6">
          <Routes>
            <Route index element={<TrainerHome />} />
            <Route path="sessions" element={<TrainerSessions />} />
            <Route path="students" element={<TrainerStudents />} />
            <Route path="reviews" element={<TrainerReviews />} />
            <Route path="profile" element={<TrainerProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};


export default EducatorDashboard