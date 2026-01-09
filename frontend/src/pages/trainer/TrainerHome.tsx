import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"
import {
  Users,
  Star,
  DollarSign,
  Calendar,
  CheckCircle,
  User,
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const TrainerHome = () => {
  const { user } = useAuth() ?? {}
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    students: 0,
    rating: 5,
    earnings: 0,
    totalSessions: 0,
    upcoming: 0,
    completed: 0,
  })

  const [earningsData, setEarningsData] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const generateMonthlyData = () => {
    const now = new Date()
    const data = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      data.push({
        label: d.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        }),
        earnings: Math.floor(Math.random() * 400) + 150,
      })
    }
    return data
  }

  const fetchDashboard = async () => {
    try {
      const [sessionsRes, bookingsRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/sessions/my-sessions`),
        axios.get(`${API_BASE_URL}/api/bookings/trainer-bookings`),
        axios.get(`${API_BASE_URL}/api/auth/me`),
      ])

      const sessions = sessionsRes.data || []
      const bookings = bookingsRes.data || []
      const userData = userRes.data || {}

      setStats({
        students: new Set(bookings.map((b: any) => b.student?._id)).size,
        rating: userData.stats?.rating || 5,
        earnings: userData.stats?.totalEarnings || 0,
        totalSessions: sessions.length,
        upcoming: sessions.filter((s: any) => s.status === "scheduled").length,
        completed: sessions.filter((s: any) => s.status === "completed").length,
      })

      setRecentBookings(bookings.slice(0, 5))
      setEarningsData(generateMonthlyData())
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
    <div className="space-y-10 max-w-7xl mx-auto w-full">

      {/* 🔹 PAGE TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#6B21A8]">
          Dashboard
        </h1>
      </div>


      {/*  GRAPH */}
      <div className="bg-[#F6EFFF] rounded-[32px] p-8 shadow-md">
        <h3 className="text-xl font-semibold text-[#6B21A8] mb-6">
          Activity
        </h3>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData} margin={{ left: 10, right: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />

              <XAxis dataKey="label">
                <Label
                  value="Months"
                  offset={-20}
                  position="insideBottom"
                  fill="#6B21A8"
                  fontSize={12}
                />
              </XAxis>

              <YAxis>
                <Label
                  value="Earnings ($)"
                  angle={-90}
                  position="insideLeft"
                  fill="#6B21A8"
                  fontSize={12}
                />
              </YAxis>

              <Tooltip />

              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>

      {/*  STATISTICS */}
      <div className=" bg-gradient-to-br from-[#F7EFFF] via-[#FBEFFF] to-[#F3E8FF] rounded-[40px] p-10 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">

          {/* LEFT INFO */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-semibold text-[#6B21A8] mb-3">
              Statistics
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your performance statistics for the selected period.
            </p>
            <p className="text-sm text-[#6B21A8] font-medium mt-2">
              Current period: <span className="font-semibold">Overall</span>
            </p>
          </div>

          {/* RIGHT STATS */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
            <StatPill icon={<Users />} label="Students" value={stats.students} />
            <StatPill icon={<Star />} label="Ratings" value={stats.rating} />
            <StatPill icon={<DollarSign />} label="Earnings" value={`$${stats.earnings}`} />
            <StatPill icon={<Calendar />} label="Total Sessions" value={stats.totalSessions} />
            <StatPill icon={<Calendar />} label="Upcoming Events" value={stats.upcoming} />
            <StatPill icon={<CheckCircle />} label="Session Completed" value={stats.completed} />
          </div>

        </div>
      </div>


      {/* 🔹 RECENT BOOKINGS (STITCHED BACK) */}
      <div className="bg-white rounded-[32px] p-8 shadow-md border border-purple-100">
        <h3 className="text-xl font-semibold text-[#6B21A8] mb-6">
          Recent Bookings
        </h3>

        {recentBookings.length ? (
          <div className="space-y-4">
            {recentBookings.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between p-4 rounded-2xl border border-purple-100 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <User className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2D274B]">
                      {b.student?.name || "Unknown Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${b.amount} • {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span className="text-sm capitalize px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No bookings yet</p>
        )}
      </div>
    </div>
  )
}

export default TrainerHome

/* ---------- UI COMPONENT ---------- */

const StatPill = ({ icon, label, value }: any) => (
  <div className="
    bg-white 
    rounded-[32px] 
    px-6 py-7 
    flex flex-col 
    items-center 
    text-center 
    gap-3 
    border border-purple-100
    shadow-sm
  ">
    {/* Icon Badge */}
    <div className="
      w-14 h-14 rounded-full bg-gradient-to-br from-[#E9D5FF] to-[#FBCFE8] flex items-center justify-center shadow-inner
    ">
      <div className="
        w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#7C3AED]
      ">
        {icon}
      </div>
    </div>

    {/* Value */}
    <p className="text-2xl font-semibold text-[#6B21A8]">
      {value}
    </p>

    {/* Label */}
    <p className="text-sm text-gray-500">
      {label}
    </p>
  </div>
)


