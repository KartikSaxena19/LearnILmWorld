// src/pages/EducatorDashboard.jsx
import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, Users, Calendar, User, Star, LogOut, Menu
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import bg_img from '../../assets/bg_dashboard.jpeg'
import logo from '../../assets/LearnilmworldLogo.jpg'
import TrainerHome from './TrainerHome'
import TrainerSessions from './TrainerSessions'
import TrainerStudents from './TrainerStudents'
import TrainerReviews from './TrainerReviews'
import TrainerProfile from './TrainerProfile'



// // src/pages/trainer/TrainerProfile.tsx
// import { useState, useEffect, ChangeEvent } from "react";
// import { useAuth } from '../../contexts/AuthContext'
// import ReactFlagsSelect from "react-flags-select";


/* ---------- TrainerHome ---------- */
// const FRONTEND_URL= import.meta.env.VITE_FRONTEND_URL;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 




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
    <div className="min-h-screen bg-fixed" style={{
      backgroundImage:
        `url(${bg_img})`,
      position: "relative",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
    }}>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FFF9F2]">
        <div className="flex items-center justify-between px-8 py-6">

          {/* Left: Title */}
          <div>
            <h1 className="text-3xl font-bold text-[#6B21A8]">
              Dashboard
            </h1>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-10 text-sm">

            <div className="text-center">
              <p className="text-gray-500">Students</p>
              <p className="text-lg font-bold text-[#6B21A8]">
                10<span className="text-red-500">+</span>
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-500">Ratings</p>
              <p className="text-lg font-bold text-[#6B21A8]">
                4.2<span className="text-yellow-400">★</span>
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-500">Earnings</p>
              <p className="text-lg font-bold text-[#6B21A8]">
                ${user?.stats?.totalEarnings || 25}
              </p>
            </div>

          </div>
        </div>
      </header>


      {/* Sidebar */}
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


        {/* User */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
            <User className="text-white" />
          </div>
          <div>
            <p className="text-gray-700 font-semibold">
              {user?.name || "Sarah Mitchell"}
            </p>
            <p className="text-gray-800/70 text-sm">
              Trainer Dashboard
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


      {/* Main Content */}
      <div className="pt-3 lg:pl-64">
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