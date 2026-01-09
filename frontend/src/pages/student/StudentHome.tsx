// src/pages/student/StudentHome.tsx
import { BookOpen, Calendar, Star, User, TrendingUp } from "lucide-react";
// MessageCircle, Globe, Users => removed these unused lucide icons
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatPill from "./components/StarPill";


/* ---------- Types ---------- */
type AnyObj = Record<string, any>

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const weeklyActivity = [
  { day: "Mon", classes: 1 },
  { day: "Tue", classes: 3 },
  { day: "Wed", classes: 1 },
  { day: "Thu", classes: 2 },
  { day: "Fri", classes: 1 },
  { day: "Sat", classes: 0 },
  { day: "Sun", classes: 0 },
]


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
    <div className="max-w-[1200px] mx-auto p-6 space-y-8">

      {/* DASHBOARD HEADER */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-[#2D274B]">
          Dashboard
        </h1>

      </div>

      {/* Activity Card */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2D274B]">
            Activity
          </h2>
          <span className="text-sm text-gray-500">
            Classes completed this week
          </span>
        </div>

        {/* Placeholder graph */}
        {/* <div className="h-48 rounded-xl bg-gradient-to-r from-[#9787F3]/30 to-[#f97316]/30 flex items-center justify-center text-gray-600 font-semibold">
            Activity graph coming soon
          </div> */}

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="classes"
                stroke="#9787F3"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* STATISTICS */}
      <div className="bg-gradient-to-br from-[#F6EDFF] to-[#FFF1E6] rounded-[28px] p-8 shadow-md">
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* LEFT TEXT  */}
          <div className="w-full lg:flex-[0.35]">
            <h2 className="text-2xl font-bold text-[#6B21A8] mb-2">
              Statistics
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your performance statistics for{" "}
              <span className="font-semibold text-[#6B21A8]">
                1 week
              </span>{" "}
              period
            </p>
          </div>

          {/* RIGHT STATS  */}
          <div className="flex flex-[0.65] items-center  gap-8">

            <StatPill
              icon={<BookOpen className="text-[#7C3AED] w-5 h-5" />}
              value={stats.totalSessions}
              label={<>Total<br />Sessions</>}
              iconBg="bg-[#E9D8FD]"
            />

            <StatPill
              icon={<Calendar className="text-green-600 w-5 h-5" />}
              value={stats.upcomingSessions}
              label={<>Upcoming<br />Sessions</>}
              iconBg="bg-[#DCFCE7]"
            />

            <StatPill
              icon={<Star className="text-orange-500 w-5 h-5" />}
              value={stats.completedSessions}
              label={<>Session<br />Completed</>}
              iconBg="bg-[#FFEDD5]"
            />

          </div>
        </div>
      </div>


      {/* RECENT SESSIONS */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2D274B]">
            Recent Sessions
          </h2>
          <Link
            to="/student/sessions"
            className="text-[#6B21A8] font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session: AnyObj) => (
              <div
                key={session._id || session.id}
                className="flex justify-between items-center p-4 rounded-xl border hover:shadow-sm"
              >
                <div>
                  <p className="font-semibold">
                    {session.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    with {session.trainer?.name}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${session.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No sessions yet
          </p>
        )}
      </div>

    </div>
  )

}

export default StudentHome;
