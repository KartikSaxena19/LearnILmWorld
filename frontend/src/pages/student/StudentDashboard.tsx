// src/pages/StudentDashboard.tsx
import React, { useState } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, Calendar, User, Menu, } from "lucide-react"
// Removed from above logout,
import { useAuth } from "../../contexts/AuthContext"
import bg_img from "../../assets/bg_dashboard.jpeg"
import logo from '../../assets/LearnilmworldLogo.jpg'

import StudentHome from "./StudentHome"
import StudentLanding from "./StudentLanding"
import StudentSessions from "./StudentSessions"
import StudentProfile from "./StudentProfile"

type AnyObj = Record<string, any>

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth() as AnyObj
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Home", href: "/student/home", icon: Home },
    { name: "My Sessions", href: "/student/sessions", icon: Calendar },
    { name: "Profile", href: "/student/profile", icon: User },
  ]

  const isActive = (path: string) => {
    if (path === "/student")
      return location.pathname === "/student"
    return location.pathname.startsWith(path)
  }

  return (
    <div
      className="min-h-screen bg-fixed"
      style={{
        backgroundImage: `url(${bg_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-[#FFF9F2] shadow-sm">
        <div className="flex items-center justify-between px-8 py-6">

          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#6B21A8]"
            >
              <Menu />
            </button>

            <h1 className="text-3xl font-bold text-[#6B21A8]">
              Dashboard
            </h1>
          </div>

          {/* Right */}
          <div className="text-sm text-gray-600">
            Role:{" "}
            <span className="font-semibold text-[#6B21A8]">
              Student
            </span>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64
        bg-gradient-to-b from-[#C9A7F7] to-[#9B6EF3]
        px-6 py-8
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center mb-10 hover:opacity-90 transition"
        >
          {/* Logo */}
          <img
            src={logo}
            alt="LearniLM"
            className="w-10 h-10 rounded-full mr-3"
          />

          {/* Wordmark */}
          <div className="flex items-center leading-none">
            <span className="font-bold text-gray-700 text-lg">
              LearniLM
            </span>

            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="inline-block text-xl mx-[2px]"
            >
              🌎
            </motion.span>

            <span className="font-bold text-gray-700 text-lg">
              World
            </span>
          </div>
        </Link>

        {/* Student Info */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
            <User className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">
              {user?.name || "Student"}
            </p>
            <p className="text-sm text-gray-800/70">
              Student Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${active
                    ? "bg-white text-[#6B21A8] font-semibold shadow-md"
                    : "text-gray-700 hover:bg-white/30"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="w-full bg-white text-[#6B21A8]
            py-3 rounded-full font-semibold
            shadow-md hover:scale-[1.02] transition"
          >
            Log Out →
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="pt-3 lg:pl-64">
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
  )
}

export default StudentDashboard
