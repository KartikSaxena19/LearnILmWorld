// src/pages/student/StudentHome.tsx
import { BookOpen, Calendar, Star, User, TrendingUp } from "lucide-react";
// MessageCircle, Globe, Users => removed these unused lucide icons
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


/* ---------- Types ---------- */
type AnyObj = Record<string, any>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

        {/* <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="w-10 h-10 bg-[#9787F3] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[#2D274B] mb-1">${stats.totalSpent}</div>
          <div className="text-[#9787F3] text-sm font-semibold">Total Spent</div>
        </div> */}
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

export default StudentHome;
