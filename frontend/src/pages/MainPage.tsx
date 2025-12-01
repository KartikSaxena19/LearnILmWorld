import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Search, Filter, Star, Globe, Clock, User, MapPin, ChevronDown, X, Play, Heart
} from 'lucide-react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import * as Flags from "country-flag-icons/react/3x2";

/** Trainer types: demoVideo optional */
interface Trainer {
  _id: string
  name?: string
  email?: string
  profile?: {
    bio?: string
    languages?: string[]
    trainerLanguages?: Array<{
      language?: string
      proficiency?: string
      teachingLevel?: string[]
    }>
    experience?: number
    hourlyRate?: number
    avatar?: string
    imageUrl?: string         // <-- primary image field from your schema
    location?: string
    specializations?: string[]
    nationalityCode?: string
    isAvailable?: boolean
    averageRating?: number
    totalBookings?: number
    demoVideo?: string // optional demo video URL (YouTube or MP4)
  }
  stats?: {
    rating?: number
    totalSessions?: number
  }
}

interface ShowFiltersState {
  language: boolean;
  subject: boolean;
  nationality: boolean;
}

interface FiltersState {
  language: string
  minRate: string
  maxRate: string
  experience: string
  specialization: string
  rating: string
  sortBy: string
  nationality: string | undefined
}



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const MainPage: React.FC = () => {
  // ---------- hooks (always declared in same order) ----------
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState<ShowFiltersState>({language: false, subject: false, nationality: false});

  const [filters, setFilters] = useState<FiltersState>({
    language: '',
    minRate: '',
    maxRate: '',
    experience: '',
    specialization: '',
    rating: '',
    sortBy: 'rating',
    nationality:'',
  })


  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const selectedLang = params.get("language");
    const selectedSubject = params.get("subject");

    if (selectedLang) {
      setFilters(prev => ({
        ...prev,
        language: selectedLang,
      }));
      setLearningType("language");
      setLanguageMode("subject");
    }

    if (selectedSubject) {
      setFilters(prev => ({
        ...prev,
        specialization: selectedSubject,
      }));
      setLearningType("subject");
    }
  }, [location.search]);



  const [learningType, setLearningType] = useState("language"); 

  const handleLearningTypeChange = (type: any) => {
  setLearningType(type);

  // Reset all filters when switching type
  setFilters({
    language: '',
    minRate: '',
    maxRate: '',
    experience: '',
    specialization: '',
    rating: '',
    sortBy: 'rating',
    nationality:'',
  });

  // Also reset languageMode when switching away from Language Mode
  setLanguageMode("subject");
  };


  const [languageMode, setLanguageMode] = useState(""); 
  // "subject" | "profession"

  // which trainer is currently showing a player (id) — only one at a time
  const [openVideoId, setOpenVideoId] = useState<string | null>(null)

  // local favorites state (UI-only example)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  // ref for video element map (not used for attaching listeners here, but handy)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  // ---------- helpers (pure functions) ----------
  const parseNumber = (val: string | number | undefined, fallback = 0) => {
    if (val === undefined || val === null || val === '') return fallback
    const n = Number(val)
    return Number.isFinite(n) ? n : fallback
  }

  const getRating = useCallback((t: Trainer): number => {
    const s = t?.stats?.rating
    const p = t?.profile?.averageRating
    const rv = typeof s === 'number' && !Number.isNaN(s) ? s : (typeof p === 'number' && !Number.isNaN(p) ? p : 0)
    return rv
  }, [])

  const isYouTube = (url?: string) => {
    if (!url) return false
    return url.includes('youtube.com') || url.includes('youtu.be')
  }
  const toYouTubeEmbed = (url: string) => {
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split(/[?&]/)[0]
        return `https://www.youtube.com/embed/${id}`
      }
      const u = new URL(url)
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      return url
    } catch {
      return url
    }
  }

  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  const renderFlag = (code?: string) => {
    if (!code) return null;
    const upper = code.toUpperCase();

    const Flag = (Flags as any)[upper];
    if (!Flag) return null; // invalid ISO code

    return (
      <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm">
        <Flag title={upper} className="w-full h-full object-cover" />
      </div>
    );
  };




  const handleDashboardClick = () => {

    if (!user && !isAdmin) {
      navigate('/login')
      return
    }

    if (isAdmin) {
      navigate('/admin')
      return
    }

    if (user) {
      if (user.role === 'trainer') navigate('/trainer')
      else if (user.role === 'student') navigate('/student')
    }
  }

  // ---------- data fetching ----------
  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        // 1️ Fetch trainers
        const response = await axios.get(`${API_BASE_URL}/api/users/trainers`)
        let data = Array.isArray(response.data) ? response.data : []

        // Keep only verified trainers
        data = data.filter(trainer => trainer.profile.verificationStatus === 'verified')

        //  Fetch public review counts (no auth)
        const countsRes = await axios.get(`${API_BASE_URL}/api/reviews/counts`)

        // 3️ Merge the counts into trainers
        const counts = countsRes.data || {}
        const merged = data.map(trainer => ({
          ...trainer,
          profile: {
            ...trainer.profile,
            totalBookings: counts[trainer._id] || 0  //  attach reviews count safely
          }
        }))

        if (mounted) setTrainers(merged)
      } catch (error) {
        console.error('Failed to fetch trainers or counts:', error)
        if (mounted) setTrainers([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "jp", name: "Japanese", flag: "🇯🇵" }
  ];


  // ---------- derived filtered list (stable hooks) ----------
  const filteredTrainers = useMemo(() => {
    try {
      let list = (Array.isArray(trainers) ? [...trainers] : []).filter(Boolean);

      const q = (searchTerm || '').trim().toLowerCase();

      // Full-text search
      if (q) {
        list = list.filter(trainer => {
          if (!trainer) return false;
          const name = (trainer.name || '').toLowerCase();
          const bio = (trainer.profile?.bio || '').toLowerCase();

          //  Merge both normal and trainerLanguages for simpler search
          const allLangs = [
            ...(trainer.profile?.languages || []),
            ...(trainer.profile?.trainerLanguages?.map(tl => tl.language || '') || [])
          ]
            .filter(Boolean)
            .map(l => l.toLowerCase());

          const specializations = (trainer.profile?.specializations || [])
            .filter(Boolean)
            .map(s => s.toLowerCase());

          return (
            name.includes(q) ||
            bio.includes(q) ||
            allLangs.some(lang => lang.includes(q)) ||
            specializations.some(spec => spec.includes(q))
          );
        });
      }

      // Language Filter
      if (filters.language.trim() !== '') {
        const langQ = filters.language.trim().toLowerCase();

        list = list.filter(trainer => {
          const allLangs = [
            ...(trainer.profile?.languages || []),
            ...(trainer.profile?.trainerLanguages?.map(tl => tl.language || '') || [])
          ]
            .filter(Boolean)
            .map(l => l.toLowerCase());

          return allLangs.some(lang => lang.includes(langQ));
        });
      }
      

      // Price filters
      const min = parseNumber(filters.minRate, 0);
      const max = parseNumber(filters.maxRate, Infinity);
      if (filters.minRate !== '') {
        list = list.filter(t => parseNumber(t.profile?.hourlyRate, 0) >= min);
      }
      if (filters.maxRate !== '') {
        list = list.filter(t => parseNumber(t.profile?.hourlyRate, 0) <= max);
      }

      // Experience
      if (filters.experience !== '') {
        const minExp = parseNumber(filters.experience, 0);
        list = list.filter(t => parseNumber(t.profile?.experience, 0) >= minExp);
      }

      // Specialization
      if (filters.specialization.trim() !== '') {
        const specQ = filters.specialization.trim().toLowerCase();
        list = list.filter(t =>
          (t.profile?.specializations || [])
            .filter(Boolean)
            .some(s => s.toLowerCase().includes(specQ))
        );
      }

      // Rating
      if (filters.rating !== '') {
        const minRating = parseNumber(filters.rating, 0);
        list = list.filter(t => getRating(t) >= minRating);
      }

      // Nationality
      if (filters.nationality) {
        list = list.filter(
          t => t.profile?.nationalityCode === filters.nationality
        );
      }


      // Sorting
      switch (filters.sortBy) {
        case 'rating':
          list.sort((a, b) => getRating(b) - getRating(a));
          break;
        case 'price_low':
          list.sort(
            (a, b) =>
              parseNumber(a.profile?.hourlyRate, 0) -
              parseNumber(b.profile?.hourlyRate, 0)
          );
          break;
        case 'price_high':
          list.sort(
            (a, b) =>
              parseNumber(b.profile?.hourlyRate, 0) -
              parseNumber(a.profile?.hourlyRate, 0)
          );
          break;
        case 'experience':
          list.sort(
            (a, b) =>
              parseNumber(b.profile?.experience, 0) -
              parseNumber(a.profile?.experience, 0)
          );
          break;
        default:
          break;
      }

      return list;
    } catch (err) {
      console.error('filtering error', err);
      return [];
    }
  }, [trainers, searchTerm, filters, getRating]);


  // Build a list of unique nationality codes from all trainers
  const uniqueNationalities = Array.from(
    new Set(
      (trainers || [])
        .map(t => t.profile?.nationalityCode)
        .filter(Boolean)
    )
  );


  // ---------- stable callbacks ----------
  const clearFilters = useCallback(() => {
    setFilters({
      language: '',
      minRate: '',
      maxRate: '',
      experience: '',
      specialization: '',
      rating: '',
      sortBy: 'rating',
      nationality: '',
    })
    setSearchTerm('')
  }, [])

  const toggleVideo = useCallback((id: string) => {
    setOpenVideoId(prev => (prev === id ? null : id))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  // ---------- loading UI early return (hooks declared above) ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-pale-top, #f5f7fb)' }}>
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    )
  }

  const assignTopTrainer = async () => {
    if (!user) return

    const studentLanguage = user?.profile?.learningLanguage || localStorage.getItem('learningLanguage')

    let availableTrainers = filteredTrainers.filter(t => t.profile?.isAvailable)

    if (studentLanguage) {
      availableTrainers = availableTrainers.filter(t =>
        t.profile?.trainerLanguages?.some(tl =>
          tl.language?.toLowerCase() === studentLanguage.toLowerCase()
        )
      )
    }


    // Find first available trainer
    const topTrainer = availableTrainers.sort((a, b) =>
      (b.profile?.averageRating || 0) - (a.profile?.averageRating || 0)
    )[0]

    if (!topTrainer) {
      alert('No trainers are currently available. Please try again later.')
      return
    }

    // Redirect to booking page instead of directly assigning
    navigate(`/book/${topTrainer._id}`)
  }



  // ---------- render ----------
  return (
    <div className="min-h-screen bg-[#dc8d33] text-[#2D274B]" 
    // style={{ background: `linear-gradient(180deg,var(--bg-pale-top),var(--bg-pale-bottom))` }}
    >
      {/* Floating decorative orbs (kept) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-16 left-8 w-28 h-28 rounded-full" style={{ background: '#9787F3', opacity: 0.06, animation: 'floaty 6s ease-in-out infinite' }} />
        <div className="absolute top-40 right-12 w-20 h-20 rounded-full" style={{ background: '#9787F3', opacity: 0.06, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 rounded-full" style={{ background: 'var(--accent-orange)', opacity: 0.04, animation: 'floaty 6s ease-in-out infinite', animationDelay: '3.2s' }} />
      </div>

      {/* Header (smaller) */}
      <header className="sticky top-0 z-40 bg-[#2D274B]/95 backdrop-blur-sm border-b border-white/30 text-[#dc8d33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-3 gap-3 sm:gap-0">
            <Link to="/" className="flex items-center">
              <div>
                <div className="text-2xl md:text-3xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center">
                {/* LEARN */}
                <span className="text-[#dc8d33] bg-clip-text  drop-shadow-lg">
                  LearniLM
                </span>

                {/* Rotating Globe */}
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="inline-block mx-1 text-3xl"
                >
                  🌎
                </motion.span>

                {/* World */}
                <span className=" bg-clip-text text-[#dc8d33] drop-shadow-lg">
                  World
                </span>

                {/* Optional subtle shine */}
                {/* <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-full blur-xl pointer-events-none"
                  animate={{ x: [-200, 200] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                /> */}
              </div>

              </div>
            </Link>

            <nav className="flex items-center space-x-4">
              <button
                onClick={handleDashboardClick}
                className="relative overflow-hidden group px-5 py-2 rounded-xl font-semibold text-[#2D274B] bg-[#CBE56A] hover:bg-[#CBE56A] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="relative z-10">Dashboard</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#9787F3] to-[var(--accent-orange)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
         {/* Page title (single-line hero) */}
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold  mb-2 break-keep">
            Find Your Perfect  Trainer
          </h1>
          {/* Description below the hero line */}
          <p className="text-2xl text-white font-bold max-w-3xl mx-auto">
            Connect with expert trainers from around the world. Start your journey to today.
          </p>
        </div>

        {/*  TOP SEARCH BAR */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D274B] h-5 w-5" />
              <input
                type="text"
                placeholder="Search trainers by name, language, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9787F3] text-lg"
              />
            </div>
          </div>
        </div>


        {/* 6 MINI FILTER BLOCKS */}
        <div className="max-w-6xl mx-auto mb-10 px-4">
          {/* Learn a langauge button */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleLearningTypeChange("language")}
              className={`px-4 py-2 rounded-lg text-lg font-bold ${
                learningType === "language"
                  ? "bg-[#CBE56A] text-[#2D274B]"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Learn a Language
            </button>

            <button
              onClick={() => handleLearningTypeChange("subject")}
              className={`px-4 py-2 rounded-lg text-lg font-bold ${
                learningType === "subject"
                  ? "bg-[#CBE56A] text-[#2D274B]"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Learn a Subject
            </button>
          </div>

          {/* heading */}
          <h2 className="text-xl font-bold text-[#2D274B] mb-4">I'm Learning</h2>

          {/* 6 ITEMS PER ROW ALWAYS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">

            {/* Language Filter */}
            {learningType === "language" && (
            <div className="relative p-3 bg-[#2D274B] rounded-xl shadow-sm ">
              <label className="text-base font-bold text-[#dc8d33]">What's Next?</label>

              <button
                onClick={() => setShowFilters((prev) => ({ ...prev, language: !prev.language }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm font-semibold flex justify-between items-center"
              >
                <span>
                  {filters.language
                    ? `${LANGUAGES.find(l => l.name === filters.language)?.flag || ""} ${filters.language}`
                    : "Language"}
                </span>
                <ChevronDown className={`h-4 w-4 ${showFilters.language ? "rotate-180" : ""}`} />
              </button>

              {showFilters.language && (
                <div className="absolute bg-white shadow-xl rounded-xl p-3 mt-2 w-40 z-30 max-h-48 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.language}
                    onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm"
                  />

                  {LANGUAGES.filter(l =>
                    l.name.toLowerCase().includes(filters.language.toLowerCase())
                  ).map(lang => (
                    <div
                      key={lang.code}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, language: lang.name }));
                        setShowFilters((prev) => ({ ...prev, language: false }));
                      }}
                      className="cursor-pointer flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* {learningType === "language" && (
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <label className="text-xs font-semibold text-[#2D274B] mb-2">
                  Learn Language As:
                </label>

                <select
                  value={languageMode}
                  onChange={(e) => setLanguageMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 border-gray-300 text-sm text-gray-700 focus:outline-none"
                >
                  <option value="profession" selected>Profession</option>
                  <option value="subject">Subject</option>
                </select>
              </div>
            )} */}


            {/* Specialization / Subjects Dropdown */}
            {learningType === "subject" && (
            <div className="relative p-3 bg-[#2D274B] rounded-xl shadow-sm">
              <label className="text-base font-bold text-[#dc8d33]">Area of Mastery</label>

              <button
                onClick={() => setShowFilters((prev) => ({ ...prev, subject: !prev.subject }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm  font-semibold flex justify-between items-center"
              >
                <span>{filters.specialization || "Subject"}</span>
                <ChevronDown className={`h-4 w-4 ${showFilters.subject ? "rotate-180" : ""}`} />
              </button>

              {showFilters.subject && (
                <div className="absolute bg-white shadow-xl rounded-xl p-3 mt-2 w-48 z-30 max-h-48 overflow-y-auto text-base">
                  {[
                    "Mathematics",
                    "Science",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "English",
                    "Hindi",
                    "Social Science",
                    "Geography",
                    "History",
                    "Civics",
                    "Computer Science",
                    "Economics",
                    "Accountancy",
                    "Business Studies",
                  ].map((subj) => (
                    <div
                      key={subj}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, specialization: subj }));
                        setShowFilters((prev) => ({ ...prev, subject: false }));
                      }}
                      className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      {subj}
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}


            {/* Experience */}
            <div className="p-3 bg-[#2D274B] rounded-xl shadow-sm  ">
              <label className="text-base font-semibold text-[#dc8d33]">Experience (yrs)</label>
              {/* <input
                type="number"
                value={filters.experience}
                onChange={e => setFilters(p => ({ ...p, experience: e.target.value }))}
                className="w-full mt-1 px-2 py-2 border border-gray-300 text-[#dc8d33] bg-[#CBE56A] rounded-lg text-sm font-semibold"
              /> */}
              <select
                value={filters.experience}
                onChange={e => setFilters(p => ({ ...p, rating: e.target.value }))}
                className="w-full mt-1 px-2 py-2 border bg-[#CBE56A] rounded-lg text-base font-semibold "
              >
                <option value="0">0</option>
                <option value="2">2</option>
                <option value="5">5+</option>
                <option value="10">10+</option>
              </select>
            </div>

            {/* Rating */}
            <div className="p-3 bg-[#2D274B] rounded-xl shadow-sm ">
              <label className="text-base font-semibold text-[#dc8d33]">Rating</label>
              <select
                value={filters.rating}
                onChange={e => setFilters(p => ({ ...p, rating: e.target.value }))}
                className="w-full mt-1 px-2 py-2 border bg-[#CBE56A] rounded-lg text-base font-semibold "
              >
                <option value="">Any</option>
                <option value="4.5">4.5+</option>
                <option value="4.0">4.0+</option>
                <option value="3.5">3.5+</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="p-3 bg-[#2D274B] rounded-xl shadow-sm ">
              <label className="text-base font-bold text-[#dc8d33]">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(p => ({ ...p, sortBy: e.target.value }))}
                className="w-full mt-1 px-2 py-2 border border-gray-300 bg-[#CBE56A] rounded-lg text-sm font-semibold"
              >
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>

            {/* Min + Max Price Combined */}
            <div className="py-3 px-2 bg-[#2D274B] rounded-xl shadow-sm ">
              <label className="text-base font-bold text-[#dc8d33]">Price Range ($/hr)</label>

              <div className="flex items-center gap-2 mt-1 text-[#2D274B]">
                <input
                  type="number"
                  value={filters.minRate}
                  onChange={(e) => setFilters(p => ({ ...p, minRate: e.target.value }))}
                  className="w-1/2 px-2 py-2 border border-gray-300  bg-[#CBE56A] rounded-lg text-sm font-semibold"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.maxRate}
                  onChange={(e) => setFilters(p => ({ ...p, maxRate: e.target.value }))}
                  className="w-1/2 px-2 py-2 border border-gray-300 bg-[#CBE56A] rounded-lg text-sm font-bold"
                  placeholder="Max"
                />
              </div>
            </div>

          {/* Nationality Filter */}
          <div className="relative p-3 bg-[#2D274B] rounded-xl shadow-sm">
            <label className="text-base font-bold text-[#dc8d33]">Nationality</label>

            <button
              onClick={() =>
                setShowFilters(prev => ({ ...prev, nationality: !prev.nationality }))
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm font-semibold flex justify-between items-center"
            >
              <span className="flex items-center gap-2">
                {filters.nationality ? (
                  <>
                    {renderFlag(filters.nationality)}
                    {filters.nationality}
                  </>
                ) : (
                  "Select Nationality"
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 ${showFilters.nationality ? "rotate-180" : ""}`}
              />
            </button>

            {showFilters.nationality && (
              <div className="absolute bg-white shadow-xl rounded-xl p-3 mt-2 w-48 z-30 max-h-48 overflow-y-auto">
                {uniqueNationalities.map(code => (
                  <div
                    key={code}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, nationality: code }));
                      setShowFilters(prev => ({ ...prev, nationality: false }));
                    }}
                    className="cursor-pointer flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    {renderFlag(code)}
                    <span>{code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>


          </div>

          {/* CLEAR BUTTON */}
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-[#2D274B] text-lg font-bold"
            >
              Clear All
            </button>
          </div>

        </div>


        {/* FOUND COUNT */}
        <div className="mb-6 text-center">
          <p className="text-lg text-white">
            Found <span className="font-bold text-[#2D274B]">{filteredTrainers.length}</span> trainers
          </p>
        </div>

        {user?.role === 'student' && filteredTrainers.length > 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={assignTopTrainer}
              className="px-6 py-3 bg-[#CBE56A] text-[#2D274B] rounded-xl font-semibold hover:bg-[#CBE56A] transition"
            >
              Assign Me a Top Trainer
            </button>
          </div>
        )}


        {/* Trainers Grid */}
        <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {filteredTrainers.map((trainer, index) => {
            const id = trainer._id || `trainer-${index}`

            // PREFER imageUrl (primary) then avatar - uses your schema's imageUrl field.
            const avatar = trainer.profile?.imageUrl || trainer.profile?.avatar || ''

            const rating = getRating(trainer) || 0
            const reviews = parseNumber(trainer.profile?.totalBookings, 0)

            // languages fallback
            const languagesList = (Array.isArray(trainer.profile?.trainerLanguages) && trainer.profile!.trainerLanguages!.length > 0)
              ? trainer.profile!.trainerLanguages!.slice(0, 3).map(tl => tl.language || '')
              : (Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.slice(0, 3) : [])

            const demoUrl = trainer.profile?.demoVideo
            const showingVideo = openVideoId === id && !!demoUrl

            return (
              <article
                key={id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105 ring-1 ring-gray-50 flex flex-col"
                style={{ minHeight: 360 }}
              >
                {/* Demo video / poster (stays at top) */}
                {demoUrl ? (
                  <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-100">
                    {!showingVideo ? (
                      <>
                        <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                          {avatar ? (
                            <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover brightness-80" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                          )}
                        </div>

                        <button
                          onClick={() => toggleVideo(id)}
                          className="absolute inset-0 flex items-center justify-center"
                          aria-label="Play demo"
                        >
                          <div className="bg-white/95 hover:bg-white p-3 rounded-full shadow-2xl flex items-center justify-center border border-white">
                            <Play className="h-6 w-6 text-[#9787F3]" />
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-44 bg-black">
                          {isYouTube(demoUrl) ? (
                            <iframe
                              title={`demo-${id}`}
                              src={`${toYouTubeEmbed(demoUrl)}?autoplay=0&rel=0`}
                              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              ref={el => { videoRefs.current[id] = el }}
                              src={demoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => setOpenVideoId(null)}
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1 shadow"
                          aria-label="Close video"
                        >
                          <X className="h-4 w-4 text-[#4A4470]" />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mb-4 w-full h-44 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                )}

                {/* Trainer details (price moved up) */}
                <div className="flex flex-wrap items-start justify-between gap-y-3 mb-3">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-12 h-12 bg-[#9787F3] rounded-lg flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                    {renderFlag(trainer.profile?.nationalityCode)}
                    <h3 className="text-lg font-semibold text-[#2D274B] truncate">
                      {trainer.name || 'Unnamed Trainer'}
                    </h3>
                  </div>

                      <div className="flex flex-wrap items-center text-sm text-[#6A6592] mt-1 gap-2">
                        <div className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-sm">
                          <Star className="h-4 w-4" />
                          <span className="font-medium">{rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">({reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 bg-[#9787F3] text-white rounded-full font-semibold text-sm sm:text-base">
                      ${parseNumber(trainer.profile?.hourlyRate, 25)}/hr
                    </div>
                  </div>
                </div>

                {/* languages */}
                {learningType === "language" && (
  <div className="mb-3">
    <p className="text-xs text-gray-500 mb-1 font-medium">🌐 Languages I Teach</p>
    <div className="flex flex-wrap gap-2">
      {languagesList.map((language, idx) => (
        <span
          key={idx}
          className="px-3 py-1 bg-gray-50 border rounded-xl text-sm text-gray-800 shadow-sm"
        >
          {language}
        </span>
      ))}
    </div>
  </div>
)}


                {/* Specializations when learning type is subjects */}
                {learningType === "subject" && (() => {
  const specs = trainer.profile?.specializations;
  if (!Array.isArray(specs) || specs.length === 0) return null;

  return (
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-1 font-medium">📚 Subjects I Teach</p>

      <div className="flex flex-wrap gap-2">
        {specs.slice(0, 4).map((spec, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-800 shadow-sm"
          >
            {spec}
          </span>
        ))}

        {specs.length > 4 && (
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-xl text-sm">
            +{specs.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
})()}



                {/* bio (moved below filters per request; kept short) */}
                <p className="text-[#6A6592] mb-4 line-clamp-3 flex-1">
                  {trainer.profile?.bio || 'Experienced language trainer helping students achieve fluency through personalized lessons.'}
                </p>

                {/* stats */}
                <div className="flex items-center gap-4 text-[#6A6592] mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#9787F3]" />
                    <span>{parseNumber(trainer.profile?.experience, 5)}+ years</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#9787F3]" />
                    <span>{trainer.profile?.location || 'Online'}</span>
                  </div>
                </div>

              {/* Bottom CTAs */}
              <div className="mt-auto flex flex-wrap gap-3 justify-between items-center">
                <button
                  onClick={() => toggleFavorite(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border ${favorites[id] ? 'bg-red-100 border-red-300 text-red-600' : 'border-gray-300 text-[#6A6592] hover:bg-gray-100'}`}
                >
                  <Heart className="h-5 w-5" />
                  {favorites[id] ? 'Liked' : 'Like'}
                </button>

                {!user ? (
                  <Link to="/login" className="w-full sm:w-auto text-center px-4 py-2 bg-[#CBE56A] text-[#2D274B] rounded-lg font-medium hover:bg-[#CBE56A]">
                    Sign In
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Link to={`/trainer-profile/${id}`} className="px-4 py-2 bg-gray-100 text-[#4A4470] rounded-lg font-medium hover:bg-[#CBE56A] text-center">
                      View Profile
                    </Link>
                    <button
                      onClick={() => navigate(`/book/${id}`)}
                      className="px-4 py-2 bg-[#CBE56A] text-[#4A4470] rounded-lg font-medium hover:bg-[#CBE56A] text-center"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>

              </article>
            )
          })}
        </div>

        {/* no results */}
        {filteredTrainers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#2D274B] mb-4">No trainers found</h3>
            <p className="text-[#6A6592] mb-8">Try adjusting your search criteria or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default MainPage
