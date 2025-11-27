import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  BookOpen, Calendar, Star, DollarSign, Users,
  Award, TrendingUp,User
} from "lucide-react";
import StatCard from "./components/StatCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

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
        <StatCard color="#16a34a" icon={<DollarSign />} label="Total Earnings" value={`$${stats.totalEarnings}`} />
        <StatCard color="#22c55e" icon={<Calendar />} label="Upcoming" value={stats.upcomingSessions} />
        <StatCard color="#facc15" icon={<Award />} label="Rating" value={stats.averageRating.toFixed(1)} />
        <StatCard color="#0ea5e9" icon={<Users />} label="Students" value={stats.totalStudents} />
        <StatCard color="#f97316" icon={<Star />} label="Completed" value={stats.completedSessions} />
        <StatCard color="#9787F3" icon={<BookOpen />} label="Total Sessions" value={stats.totalSessions} />
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

export default TrainerHome;
