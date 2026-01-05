// FILE: src/pages/MainPage.tsx
import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import bg_img from '../assets/bg_main.jpeg'
import bg_h_img from '../assets/header_bg.jpg'
import SearchBar from '../components/SearchBar'
import LearningTypeSelector from '../components/LearningTypeSelector'
import FiltersPanel from '../components/FiltersPanel'
import TrainersGrid from '../components/TrainersGrid'
import { useAuth } from '../contexts/AuthContext'
import CurrencySelector from '../components/CurrencySelector'


const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [learningType, setLearningType] = useState<'language' | 'subject' | 'hobby'>('language')
  const [languageMode, setLanguageMode] = useState<string>('subject')

  const { user, loading } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/login";

    const role = user.role.toLowerCase();

    if (role === "student") return "/student";
    if (role === "trainer") return "/trainer";
    if (role === "admin") return "/admin";

    return "/main"; // fallback
  };

  const [nationalities, setNationalities] = useState<string[]>([])


  const [filters, setFilters] = useState<any>({
    language: '',
    specialization: '',
    hobby: '',
    minRate: '',
    maxRate: '',
    experience: '',
    rating: '',
    sortBy: 'rating',
    nationality: ''
  })


  const clearFilters = useCallback(() => {
    setFilters({
      language: '',
      specialization: '',
      hobby: '',
      minRate: '',
      maxRate: '',
      experience: '',
      rating: '',
      sortBy: 'rating',
      nationality: ''
    })
    setSearchTerm('')
  }, [])


  return (
    <>
      <div className="min-h-screen bg-fixed text-[#2D274B]" style={{
        backgroundImage: `url(${bg_img})`,
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%'
      }}>


        {/* Floating decorative orbs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-28 h-28 rounded-full" style={{ background: '#9787F3', opacity: 0.46, animation: 'floaty 6s ease-in-out infinite' }} />
          <div className="absolute top-40 right-20 w-20 h-20 rounded-full" style={{ background: '#9787F3', opacity: 0.66, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
        </div>


        {/* Header */}
        <header className="sticky top-0 z-40 bg-fixed">
          <div className="px-4 pt-4">
            <div
              className="
        mx-auto
        max-w-7xl
        rounded-full
        bg-[#6B48AF]/90
        backdrop-blur-md
        shadow-xl
        border border-white/30
      "
              style={{
                backgroundImage:
                  `url(${bg_h_img})`,
                position: "relative",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
              }}
            >
              <div className="px-6 sm:px-10 py-3">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">

                  {/* LOGO */}
                  <Link to="/" className="flex items-center">
                    <div className="text-2xl md:text-3xl font-[Good Vibes] font-extrabold tracking-wide inline-flex items-center">
                      <span className="text-[#FFFAF1] drop-shadow-lg">
                        LearniLM
                      </span>

                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                        className="inline-block mx-1 text-3xl"
                      >
                        🌎
                      </motion.span>

                      <span className="text-[#FFFAF1] drop-shadow-lg">
                        World
                      </span>
                    </div>
                  </Link>

                  {/* NAV */}
                  <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">

                    <CurrencySelector variant="header" />

                    {!user ? (
                      <Link
                        to="/login"
                        className="px-5 py-2 rounded-full bg-[#CBE56A] text-[#2D274B] font-semibold hover:scale-105 transition"
                      >
                        Sign In
                      </Link>
                    ) : (
                      <Link
                        to={getDashboardPath()}
                        className="px-5 py-2 rounded-full bg-[#CBE56A] text-[#2D274B] font-semibold hover:scale-105 transition"
                      >
                        Dashboard
                      </Link>
                    )}
                  </nav>

                </div>
              </div>
            </div>
          </div>
        </header>


        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">


          {/* Hero */}
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#F64EBB] mb-2 break-keep">Find Your Perfect Trainer</h1>
            <p className="text-2xl font-bold max-w-3xl mx-auto">Connect with expert trainers from around the world. Start your journey to today.</p>
          </div>


          {/* Search */}
          <div className="flex justify-center mb-10">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>


          {/* Learning Type Selector + Filters */}
          <div className="max-w-6xl mx-auto mb-10 px-4">
            <div className="flex justify-center mb-6 w-full">
              <LearningTypeSelector learningType={learningType} onChange={(t) => {
                setLearningType(t)
                // reset fields relevant to other types
                setFilters((prev: any) => ({ ...prev, language: '', specialization: '', hobby: '' }))
                setLanguageMode('subject')
              }} />
            </div>

            {/* <div className="flex justify-end my-4 mr-8">
            <button onClick={clearFilters} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-[#2D274B] text-lg font-bold">Clear All</button>
          </div> */}

            <FiltersPanel learningType={learningType} filters={filters} setFilters={setFilters} nationalities={nationalities} clearFilters={clearFilters} />

          </div>


          {/* Trainers Grid (fetching + pagination inside) */}
          <TrainersGrid searchTerm={searchTerm} filters={filters} learningType={learningType} setNationalities={setNationalities} />


        </main>


      </div>
      <Footer />
    </>
  )
}


export default MainPage