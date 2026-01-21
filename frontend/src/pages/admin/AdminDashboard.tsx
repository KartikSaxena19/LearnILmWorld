// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, UserPlus, Users, Calendar, FilePlus, Trash2, LogOut, X, Edit3,  TrendingUp, User, BookOpen, Menu } from 'lucide-react'
// Eye, Menu, removed from lucide icons
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import AdminSessions from './AdminSessions'
import AdminReviews from './AdminReviews'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type AnyObj = Record<string, any>

interface Certification {
  name: string
  certificateImage: string
  year: string
  certificateLink: string
}

interface UserProfile {
  education?: string
  experience?: string
  certifications?: Certification[]
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  phone?: string
  bio?: string
}


interface UserForm {
  name: string
  email: string
  role: 'student' | 'trainer'
  password: string
  profile: UserProfile
}

interface Session {
  _id: string
  title: string
  trainer?: { name: string; email: string }
  status?: string
  createdAt?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

/* -------------------------- Admin Home -------------------------- */

const AdminHome: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalSessions: 0,
    totalReviews: 0
  })
  const [recentSessions, setRecentSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = res.data
      setStats({
        totalUsers: data.totalUsers || 0,
        totalTrainers: data.totalTrainers || 0,
        totalSessions: data.totalSessions || 0,
        totalReviews: data.totalReviews || 0
      })
      setRecentSessions(data.recentSessions || [])
    } catch (error) {
      console.error('Failed to fetch admin dashboard stats:', error)
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
    <div className="space-y-6 max-w-[1200px] mx-auto w-full">
      {/* Welcome Section */}
      <div className="glass-effect rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#0ea5a3] rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">Welcome, Admin!</h2>
        </div>
        <p className="text-gray-600 font-medium text-sm sm:text-base">Monitor users, trainers, sessions, and reviews</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/users" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
          <div className="w-10 h-10 bg-[#0ea5a3] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers}</div>
          <div className="text-gray-600 text-sm font-medium">Users</div>
        </Link>

        <Link to="/admin/trainers" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
          <div className="w-10 h-10 bg-[#6ee7b7] rounded-xl flex items-center justify-center mx-auto mb-3">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTrainers}</div>
          <div className="text-gray-600 text-sm font-medium">Trainers</div>
        </Link>

        <Link to="/admin/sessions" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
          <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalSessions}</div>
          <div className="text-gray-600 text-sm font-medium">Sessions</div>
        </Link>

        <Link to="/admin/reviews" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
          <div className="w-10 h-10 bg-[#0ea5a3] rounded-xl flex items-center justify-center mx-auto mb-3">
            <FilePlus className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalReviews}</div>
          <div className="text-gray-600 text-sm font-medium">Reviews</div>
        </Link>
      </div>

      {/* Recent Sessions */}
      <div className="glass-effect rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Sessions</h3>
          <Link to="/admin/sessions" className="text-accent hover:text-accent-dark font-medium text-sm">View All</Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session._id} className="p-4 bg-white bg-opacity-50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center w-full sm:w-auto">
                  <div className="w-10 h-10 bg-[#0ea5a3] rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{session.title}</div>
                    <div className="text-gray-600 text-sm font-medium truncate">Trainer: {session.trainer?.name || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto pl-[52px] sm:pl-0">
                  <div className="text-xs text-gray-500">{new Date(session.createdAt || '').toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#0ea5a3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-[#0ea5a3]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-4 font-medium">New sessions will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------- Admin Users -------------------------- */
const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AnyObj[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    email: '',
    role: 'student',
    password: '',
    profile: { certifications: [], verificationStatus: 'pending' }
  })
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(Array.isArray(res.data) ? res.data : [])
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 401) {
        alert('Unauthorized. Please log in again.')
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadExcel = (data: any[], filename: string) => {
    if (!data.length) {
      alert("No data to export.")
      return
    }

    const truncate = (text: any) => {
      if (typeof text !== "string") return text
      return text.length > 32000 ? text.slice(0, 32000) + "..." : text
    }

    const flattened = data.map(user => {
      const verifiedOn = user.profile?.verifiedAt || user.updatedAt
      const daysAfterJoining =
        user.role === "trainer" && user.profile?.verificationStatus === "verified"
          ? Math.floor((Date.now() - new Date(verifiedOn).getTime()) / (1000 * 60 * 60 * 24))
          : ""

      return {
        "Full Name": truncate(user.name),
        "Email Address": truncate(user.email),
        "Role": user.role.charAt(0).toUpperCase() + user.role.slice(1),
        "Status": user.isActive ? "Online" : "Offline",
        "Joined On": new Date(user.createdAt).toLocaleDateString(),
        "Last Updated": new Date(user.updatedAt).toLocaleDateString(),
        ...(user.role === "trainer" && { "Days After Joining": daysAfterJoining }),

        "Education": truncate(user.profile?.education),
        "Experience": truncate(user.profile?.experience),
        "Phone": truncate(user.profile?.phone),
        "Location": truncate(user.profile?.location),
        "Verification Status": user.profile?.verificationStatus,
        "Certifications": truncate(
          user.profile?.certifications
            ?.map((c: any) => `${c.name} (${c.year || ""})`)
            .join("; ")
        ),

        "Total Sessions": user.stats?.totalSessions,
        "Completed Sessions": user.stats?.completedSessions,
        "Total Earnings ($)": user.stats?.totalEarnings,
        "Average Rating": user.stats?.rating || user.stats?.averageRating,
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(flattened)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }



const handleDownloadAll = () => downloadExcel(users, "All_Users")

const handleDownloadStudents = () =>
  downloadExcel(users.filter(u => u.role === 'student'), "Students_Data")

const handleDownloadTrainers = () =>
  downloadExcel(users.filter(u => u.role === 'trainer'), "Trainers_Data")



  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('profile.')) {
      const key = name.split('.')[1]
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handle certification change
  const handleCertChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedCerts = [...(prev.profile.certifications || [])]
      updatedCerts[index] = { ...updatedCerts[index], [field]: value }
      return { ...prev, profile: { ...prev.profile, certifications: updatedCerts } }
    })
  }

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        certifications: [
          ...(prev.profile.certifications || []),
          { name: '', certificateImage: '', year: '', certificateLink: '' }
        ]
      }
    }))
  }

  const removeCertification = (index: number) => {
    setFormData(prev => {
      const updatedCerts = [...(prev.profile.certifications || [])]
      updatedCerts.splice(index, 1)
      return { ...prev, profile: { ...prev.profile, certifications: updatedCerts } }
    })
  }

  const handleCreateOrUpdate = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.email || (editingUserId === null && !formData.password)) {
      setError('Name, email, and password (for new users) are required.')
      return
    }

    try {
      if (editingUserId) {
        await axios.put(`${API_BASE_URL}/api/admin/users/${editingUserId}`, formData)
        setSuccess('User updated successfully.')
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/users`, formData)
        setSuccess('User created successfully.')
      }

      setFormData({
        name: '',
        email: '',
        role: 'student',
        password: '',
        profile: { certifications: [], verificationStatus: 'pending' }
      })
      setEditingUserId(null)
      fetchUsers()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Operation failed.')
    }
  }

  const handleEdit = (user: AnyObj) => {
    setEditingUserId(user._id)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      profile: {
        ...user.profile,
        certifications: user.profile?.certifications || [],
        verificationStatus: user.profile?.verificationStatus || 'pending'
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto w-full">
      <div className="glass-effect rounded-2xl p-4 sm:p-6 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{editingUserId ? 'Edit User / Trainer' : 'Create User / Trainer'}</h2>

        {error && <div className="text-red-700 mb-3 bg-red-50 p-2 rounded">{error}</div>}
        {success && <div className="text-green-700 mb-3 bg-green-50 p-2 rounded">{success}</div>}

        {/* === Role Selection === */}
        <div className="flex flex-wrap gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} className="w-4 h-4 text-[#0ea5a3]" />
            Student
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="trainer" checked={formData.role === 'trainer'} onChange={handleChange} className="w-4 h-4 text-[#0ea5a3]" />
            Trainer
          </label>
        </div>

        <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="p-3 border rounded-md w-full" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 border rounded-md w-full" required />
          <input type="password" name="password" placeholder={editingUserId ? 'New Password (optional)' : 'Password'} value={formData.password} onChange={handleChange} className="p-3 border rounded-md w-full" />

          {/* Verification Status (always visible for trainer) */}
          {formData.role === 'trainer' && (
            <select name="profile.verificationStatus" value={formData.profile.verificationStatus || 'pending'} onChange={handleChange} className="p-3 border rounded-md w-full">
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          )}

          {formData.role === 'trainer' && (
            <>
              <input type="text" name="profile.education" placeholder="Degree / Education" value={formData.profile.education || ''} onChange={handleChange} className="p-3 border rounded-md" />
              <input type="text" name="profile.experience" placeholder="Experience (years)" value={formData.profile.experience || ''} onChange={handleChange} className="p-3 border rounded-md" />


              {/* Certifications Section */}
              <div className="col-span-1 md:col-span-4 mt-2">
                <h4 className="font-semibold mb-2">Certifications</h4>
                {(formData.profile.certifications || []).map((cert, index) => (
                  <div key={index} className="grid grid-cols-1  md:grid-cols-4 gap-3 mb-2 p-3 border rounded-md">
                    <input type="text" placeholder="Certificate Name" value={cert.name} onChange={(e) => handleCertChange(index, 'name', e.target.value)} className="p-2 border rounded-md w-full" />
                    <input type="text" placeholder="Certificate Image URL" value={cert.certificateImage} onChange={(e) => handleCertChange(index, 'certificateImage', e.target.value)} className="p-2 border rounded-md w-full" />
                    <input type="number" placeholder="Issued Year" value={cert.year || ''} onChange={(e) => handleCertChange(index, 'year', e.target.value)} className="p-2 border rounded-md w-full" />
                    <input type="text" placeholder="Certificate Link" value={cert.certificateLink} onChange={(e) => handleCertChange(index, 'certificateLink', e.target.value)} className="p-2 border rounded-md w-full" />
                    <button type="button" onClick={() => removeCertification(index)} className="col-span-4 bg-red-100 text-red-700 rounded-md py-1 hover:bg-red-200">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addCertification} className="mt-2 w-full sm:w-auto bg-blue-100 text-blue-700 rounded-md py-2 px-4 hover:bg-blue-200">
                  Add Certification
                </button>
              </div>
            </>
          )}

          <button type="submit" className="col-span-1 md:col-span-1 bg-[#0ea5a3] text-white p-3 rounded-md hover:shadow-lg transition">
            {editingUserId ? 'Update User' : 'Create User'}
          </button>
        </form>


        {/* === Users List === */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">All Users</h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
          
          <button
            onClick={handleDownloadAll}
            className="bg-[#0ea5a3] text-white px-4 py-2 rounded-xl shadow hover:bg-[#0d8b8a] text-sm w-full sm:w-auto"
          >
            Download All Users
          </button>

          <button
            onClick={handleDownloadStudents}
            className="bg-[#38bdf8] text-white px-4 py-2 rounded-xl shadow hover:bg-[#209ac9] text-sm w-full sm:w-auto"
          >
            Download Students
          </button>

          <button
            onClick={handleDownloadTrainers}
            className="bg-[#6ee7b7] text-gray-900 px-4 py-2 rounded-xl shadow hover:bg-[#34d399] text-sm w-full sm:w-auto"
          >
            Download Trainers
          </button>
        </div>

        <div className="space-y-2">
          {users.map(user => (
            <div key={user._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white/50 rounded-xl shadow gap-3">
              <div className="break-all">
                <span className="font-semibold">{user.name}</span> <span className="text-sm text-gray-600">({user.role})</span> - <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button onClick={() => handleEdit(user)} className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex-1 sm:flex-none justify-center flex"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(user._id)} className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex-1 sm:flex-none justify-center flex"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------- Admin Trainers (Updated) -------------------------- */
const AdminTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<AnyObj[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_BASE_URL}/api/admin/trainers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTrainers(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Failed to fetch trainers:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto w-full">
      <div className="glass-effect rounded-2xl p-4 sm:p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Trainers Overview</h2>

        {trainers.length === 0 ? (
          <div className="text-center text-gray-600 py-10 text-lg">
            No trainers found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/60 backdrop-blur">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#0ea5a3] text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-center font-semibold">Sessions</th>
                  <th className="py-3 px-4 text-center font-semibold">Completed</th>
                  <th className="py-3 px-4 text-center font-semibold">Students</th>
                  <th className="py-3 px-4 text-center font-semibold">Earnings</th>
                  <th className="py-3 px-4 text-center font-semibold">Rating</th>
                  <th className="py-3 px-4 text-center font-semibold">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trainers.map((t, i) => (
                  <tr
                    key={t._id || i}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{t.name}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{t.email}</td>
                    <td className="py-3 px-4 text-center text-gray-700 whitespace-nowrap">
                      {t.dashboardStats?.totalSessions || 0}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 whitespace-nowrap">
                      {t.dashboardStats?.completedSessions || 0}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 whitespace-nowrap">
                      {t.dashboardStats?.totalStudents || 0}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 font-semibold whitespace-nowrap">
                      ${t.dashboardStats?.totalEarnings?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md text-sm font-medium ${
                          t.dashboardStats?.averageRating >= 4
                            ? 'bg-green-100 text-green-700'
                            : t.dashboardStats?.averageRating >= 3
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {t.dashboardStats?.averageRating
                          ? t.dashboardStats?.averageRating.toFixed(1)
                          : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md text-sm capitalize ${
                          t.profile?.verificationStatus === 'verified'
                            ? 'bg-green-100 text-green-700'
                            : t.profile?.verificationStatus === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {t.profile?.verificationStatus || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------- Admin Dashboard Root -------------------------- */
const AdminDashboard: React.FC = () => {
  const { logout } = useAuth() as any
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  

  const navigation = [
    { name: 'Home', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Trainers', href: '/admin/trainers', icon: UserPlus },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Reviews', href: '/admin/reviews', icon: FilePlus },
  ]

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white bg-opacity-95 backdrop-blur-lg border-r border-white border-opacity-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Link to="/" className="text-lg font-semibold">LearniLM🌍World</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map(nav => (
            <Link
              key={nav.name}
              to={nav.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive(nav.href) ? 'bg-[#0ea5a3] text-white shadow-lg' : 'text-gray-600 hover:bg-[#0ea5a3]/10 hover:text-[#0ea5a3]'}`}
            >
              <nav.icon className="h-5 w-5" /> {nav.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 p-4 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 w-full bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <div className="lg:hidden p-4 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-30 shadow-sm">
          <span className="font-bold text-[#0ea5a3]">LearniLM Admin</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/trainers" element={<AdminTrainers />} />
            <Route path="/sessions" element={<AdminSessions />} />
            <Route path="/reviews" element={<AdminReviews />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}




export default AdminDashboard
