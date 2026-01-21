import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'


type Role = 'student' | 'trainer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  secondaryEmail?: string;
  role: Role
  profile?: any
  stats?: any
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string; data?: any }>
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string; data?: any }>
  logout: () => void
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`)
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email })
    } catch (error: any) {
      await new Promise(r => setTimeout(r, 1500));
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email })
      // throw new Error(error.response?.data?.message || 'Failed to send reset link')
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password/${token}`, { newPassword })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password')
    }
  }


  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password })
      const { token: jwtToken, user: userFromServer } = response.data

      // const loginAdmin = (email: string, password: string) => {
      //   if (email === import.meta.env.VITE_ADMIN_EMAIL && password === import.meta.env.VITE_ADMIN_PASSWORD) {
      //     setIsAdmin(true)
      //     return { success: true }
      //   }
      //   return { success: false, error: 'Invalid admin credentials' }
      // }


      if (jwtToken) {
        localStorage.setItem('token', jwtToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
        setToken(jwtToken)
      }

      setUser(userFromServer)

      return { success: true, user: userFromServer }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData)
      const { token: jwtToken, user: userFromServer } = response.data

      if (jwtToken) {
        localStorage.setItem('token', jwtToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
        setToken(jwtToken)
      }

      setUser(userFromServer)

      return { success: true, user: userFromServer }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    setIsAdmin(false)  // clear admin login flag
  }

  const updateProfile = async (updates: any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile`, updates)
      setUser(prev => ({
        ...prev,               // keep old token + email + role  
        ...response.data      // update changed fields
      }))

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      }
    }
  }

  const value: AuthContextType = {
    user,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
