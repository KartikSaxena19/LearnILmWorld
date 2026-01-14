import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
//  Facebook,Twitter,Instagram,Linkedin,Mail, Globe,
import { Nav, Container, Offcanvas, Button } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, ArrowRight, Play, Mic, Headphones, Calendar, Users, Award, Clock, Star, MessageSquare, ChevronDown, ChevronRight, } from 'lucide-react';
// Navbar,from above
// import logo from "../assets/LearnilmworldLogo.jpg";
// import russian_student from '../assets/russian_student.png'
import 'bootstrap/dist/css/bootstrap.min.css'

// import bg_img from '../assets/purple_gradient.jpg'
import bg_main from '../assets/bg_main.jpeg'
import bg_img from '../assets/header_bg.jpg'

import french_st from '../assets/French_student1.jpeg';
import german_st from '../assets/German_student1.jpeg';
import british_st from '../assets/British_student1.jpeg';
import spanish_st from '../assets/Spanish_student1.jpeg';
import japanese_st from '../assets/Japanese_student1.jpeg';
import arab_student from '../assets/arabian_student1.jpeg'
import indian_st from '../assets/Indian_student1.jpeg';
// import chi_student from '../assets/chinese_student.png'

import spain_flag from '../assets/Spain_flag.jpeg';
import france_flag from '../assets/france_flag.jpeg';
import jap_flag from '../assets/Jap_flag.jpeg';
import ind_flag from '../assets/Indian_flag.jpeg';
import ger_flag from '../assets/German_flag.jpeg'
import brit_flag from '../assets/brit_flag.jpeg'
import arab_flag from '../assets/arab_flag.jpeg'

// import heroImage1 from '../assets/Hero_image1.png'
// import heroImage2 from '../assets/Hero_image2.jpg'
import heroImage3 from '../assets/Hero_image3.png'

import math from '../assets/Math.jpeg'
import hist from '../assets/history.png'
import geo from '../assets/Geography.jpeg'
import phy from '../assets/Physics.jpeg'
import chem from '../assets/chemistry.jpeg'
import bio from '../assets/Biology.jpeg'
import cs from '../assets/Computer Science.jpeg'
import Footer from '../components/Footer'
import TopTrainers from '../components/TopTrainers'
import { LanguageCard } from '../components/LanguageCard'
import Navbar from '../components/Navbar';
// import CurrencySelector from '../components/CurrencySelector'
// import MoreLanguages from '../components/MoreLanguages'

// LinguaNest — Enhanced Landing Page (single-file React component)
// Adjusted image positions: hero image lifted up slightly and the three overlapping
// cards have been moved upwards for a stronger visual overlap and nicer composition.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function LandingPageAlt() {
  const [mounted, setMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [showMore, setShowMore] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [showMoreHobbies, setShowMoreHobbies] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  // languages
  const handleLanguageClick = async (language: any) => {


    const trainerMap: Record<string, string> = {
      German: "trainer_id_for_german",
      French: "trainer_id_for_french",
      Japanese: "trainer_id_for_japanese",
      Spanish: "trainer_id_for_spanish",
      English: "68ef33d0cad95b62472f382a",
      Sanskrit: "trainer_id_for_sanskrit",
      Russian: "",
      Arabic: "68ef33d0cad95b62472f382a",
      Mandarin: "",
    };

    const trainerId = trainerMap[language];

    if (!trainerId) return alert("Trainer not found!");

    if (!user) {
      // Save the clicked language temporarily for redirect after login
      localStorage.setItem("redirectAfterLogin", `/main?language=${encodeURIComponent(language)}`);
      navigate("/login");
    } else {
      navigate(`/main?language=${encodeURIComponent(language)}`);
    }
  };

  const handleMoreLanguageClick = (languageName: any) => {

    const languageTrainerMap: Record<string, string> = {
      Sanskrit: "68f244c9e88b2371b4194d2c",
      Russian: "68f244c9e88b2371b4194d2c",
      Mandarin: "trainer_id_for_mandarin",
      Thai: "trainer_id_for_thai",
      Bengali: "trainer_id_for_bengali",
      Swahili: "trainer_id_for_swahili",
      Italian: "trainer_id_for_italian",
      Portuguese: "trainer_id_for_portuguese",
      Korean: "trainer_id_for_korean",
    };


    const trainerId = languageTrainerMap[languageName];

    if (!trainerId) {
      alert("Trainer for this language not found yet!");
      setShowMoreLanguages(false);
      return;
    }

    if (!user) {
      localStorage.setItem("redirectAfterLogin", `/main?language=${encodeURIComponent(languageName)}`);
      navigate("/login");
    } else {
      navigate(`/main?language=${encodeURIComponent(languageName)}`);
    }

    setShowMoreLanguages(false);
  };

  // Hobbies
  const handleHobbyClick = (hobby: any) => {
    if (hobby.isMore) {
      setShowMoreHobbies(true);
      return;
    }

    const hobbyTrainerMap: Record<string, string> = {
      Painting: "trainer_id_painting",
      Dancing: "trainer_id_dancing",
      Cooking: "trainer_id_cooking",
      Photography: "68ef33d0cad95b62472f382a",
      Singing: "68ef33d0cad95b62472f382a",
      Fitness: "",
    };

    const trainerId = hobbyTrainerMap[hobby.name];

    if (!trainerId) return alert("Trainer not found yet!");

    if (!user) {
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?hobby=${encodeURIComponent(hobby.name)}`
      );
      navigate("/login");
    } else {
      navigate(`/main?hobby=${encodeURIComponent(hobby.name)}`);
    }
  };

  const handleMoreHobbyClick = (hobbyName: string) => {
    const trainerMap: Record<string, string> = {
      Yoga: "68f244c9e88b2371b4194d2c",
      Calligraphy: "68f244c9e88b2371b4194d2c",
      Gardening: "",
      Knitting: "",
    };

    const trainerId = trainerMap[hobbyName];

    if (!trainerId) {
      alert("Trainer not available yet!");
      setShowMoreHobbies(false);
      return;
    }

    if (!user) {
      localStorage.setItem(
        "redirectAfterLogin",
        `/main?hobby=${encodeURIComponent(hobbyName)}`
      );
      navigate("/login");
    } else {
      navigate(`/main?hobby=${encodeURIComponent(hobbyName)}`);
    }

    setShowMoreHobbies(false);
  };
  // subjects
  const handleSubjectClick = (subject: any) => {
    if (subject.isMore) {
      setShowMore(true);
      return;
    }

    const subjectTrainerMap: Record<string, string> = {
      History: "trainer_id_for_history",
      Geography: "trainer_id_for_geography",
      Physics: "690dc8cb64cc3e1c19580f24",
      Chemistry: "690dc8cb64cc3e1c19580f24",
      Mathematics: "690dc8cb64cc3e1c19580f24",
      Biology: "trainer_id_for_biology",
      "Computer Science": "trainer_id_for_computer_science",
      Economics: "trainer_id_for_economics",
      Hindi: "trainer_id_for_hindi",
      Bengali: "trainer_id_for_bengali",
      Psychology: "trainer_id_for_psychology",
      Philosophy: "690dc8cb64cc3e1c19580f24",
      EVS: "trainer_id_for_evs",
      "Accounts & Finance": "trainer_id_for_accounts_finance",
    };

    const trainerId = subjectTrainerMap[subject.name];

    if (!trainerId) {
      alert("Trainer for this subject not found yet!");
      return;
    }

    if (!user) {
      // Store redirect path for after login
      localStorage.setItem("redirectAfterLogin", `/main?subject=${encodeURIComponent(subject.name)}`);
      navigate("/login");
    } else {
      navigate(`/main?subject=${encodeURIComponent(subject.name)}`);
    }
  };

  const handleMoreSubjectClick = (subjectName: string) => {
    const subjectTrainerMap: Record<string, string> = {
      Economics: "trainer_id_for_economics",
      Hindi: "690dc8cb64cc3e1c19580f24",
      Bengali: "690dc8cb64cc3e1c19580f24",
      Psychology: "trainer_id_for_psychology",
      Philosophy: "690dc8cb64cc3e1c19580f24",
      EVS: "trainer_id_for_evs",
      "Accounts & Finance": "trainer_id_for_accounts_finance",
    };

    const trainerId = subjectTrainerMap[subjectName];

    if (!trainerId) {
      alert("Trainer for this subject not found yet!");
      setShowMore(false);
      return;
    }

    if (!user) {
      localStorage.setItem("redirectAfterLogin", `/main?subject=${encodeURIComponent(subjectName)}`);
      navigate("/login");
    } else {
      navigate(`/main?subject=${encodeURIComponent(subjectName)}`);
    }

    setShowMore(false);
  };


  // const flagIcons: Record<string, string> = {
  //   German: "https://flagcdn.com/w40/de.png",
  //   French: "https://flagcdn.com/w40/fr.png",
  //   Japanese: "https://flagcdn.com/w40/jp.png",
  //   Spanish: "https://flagcdn.com/w40/es.png",
  //   English: "https://flagcdn.com/w40/gb.png",
  //   Sanskrit: "https://flagcdn.com/w40/in.png"
  // }


  useEffect(() => setMounted(true), [])

  const languages = [
    {
      lang: "English",
      flag: "gb",
      bg: brit_flag,
      hoverBg: british_st,
      pattern: "Cambridge English",
      headline: "Master English for Real-World Communication",
      subtitle: "Build confidence for global conversations",
      levels: [
        "A2 — Understand daily expressions & common conversations",
        "B1 — Participate in detailed discussions with confidence",
        "B2 — Communicate fluently in academic & professional settings",
      ],
      idealFor: "🌍 Ideal for work, travel, study & global opportunities",
    },
    {
      lang: "Spanish",
      flag: "es",
      bg: spain_flag,
      hoverBg: spanish_st,
      pattern: "DELE Pattern",
      headline: "Learn Spanish for Everyday Life & Global Communication",
      subtitle: "Speak confidently in real-world situations",
      levels: [
        "A1 — Everyday vocabulary & essential phrases",
        "A2 — Converse confidently about daily life",
        "B1 — Express opinions, travel & work conversations",
      ],
      idealFor: "🌍 Ideal for students, travelers & career growth",
    },
    {
      lang: "Japanese",
      flag: "jp",
      bg: jap_flag,
      hoverBg: japanese_st,
      pattern: "JLPT / Japan Foundation",
      headline: "Learn Japanese the Right Way",
      subtitle: "From basics to real Japanese understanding",
      levels: [
        "N5 — Basic greetings & essential phrases",
        "N4 — Daily conversation & reading practice",
        "N3 — Understand news, articles & real content",
      ],
      idealFor: "🎌 Ideal for exams, anime lovers & Japan aspirants",
    },
    {
      lang: "German",
      flag: "de",
      bg: ger_flag,
      hoverBg: german_st,
      pattern: "MMB Pattern",
      headline: "Learn German with Confidence — Step by Step",
      subtitle: "Structured learning for life, work & study",
      levels: [
        "A1 — Basic introductions & everyday phrases",
        "A2 — Travel, shopping & daily conversations",
        "B1 — Speak confidently for work, study & life",
      ],
      idealFor: "🌍 Perfect for students, professionals & study-abroad aspirants",
    },
    {
      lang: "French",
      flag: "fr",
      bg: france_flag,
      hoverBg: french_st,
      pattern: "DELF Pattern",
      headline: "Master French for Real Conversations",
      subtitle: "Learn French the natural, practical way",
      levels: [
        "A1 — Greetings & simple interactions",
        "A2 — Conversations on daily topics",
        "B1 — Fluent discussions, media & opinions",
      ],
      idealFor: "✨ Learn French for culture, travel & communication",
    },
    {
      lang: "Arabic",
      flag: "sa",
      bg: arab_flag,
      hoverBg: arab_student,
      pattern: "ALPT / Arabic Language Proficiency Test",
      headline: "Master Arabic from Basics to Fluent Understanding",
      subtitle: "Build strong foundations in Modern Arabic",
      levels: [
        "A1 — Learn alphabets, pronunciation & greetings",
        "A2 — Daily conversation & short texts",
        "B1 — Understand media, formal speech & writing",
      ],
      idealFor: "🌙 Ideal for work, travel, education & cultural learning",
    },
    {
      lang: "Sanskrit",
      flag: "in",
      bg: ind_flag,
      hoverBg: indian_st,
      pattern: "Yoga, Mantras & Ancient Texts",
      headline: "Unlock the Wisdom of Sanskrit",
      subtitle: "Connect with India’s ancient knowledge system",
      levels: [
        "A1 — Read & understand basic Sanskrit letters and words",
        "A2 — Chant and understand traditional mantras",
        "B1 — Comprehend ancient texts, shlokas & scriptures",
      ],
      idealFor: "🌿 Ideal for culture, spirituality, yoga & heritage learners",
    },
  ];



  const steps = [
    {
      icon: Users,
      title: 'Find your trainer',
      desc: 'Smart filters: language, accent, price, availability and student ratings.'
    },
    {
      icon: BookOpen,
      title: 'Book a session',
      desc: 'One-click booking, instant calendar sync and secure payments.'
    },
    {
      icon: Play,
      title: 'Practice & improve',
      desc: 'Live lessons, role-plays, recordings and tailored homework.'
    },
    {
      icon: Award,
      title: 'Track progress',
      desc: 'Personal dashboard, streaks, and certificates.'
    }
  ]

  const features = [
    { icon: Clock, title: 'Flexible Hours', text: 'Lessons at any time — morning, night or weekends.' },
    { icon: Star, title: 'Expert Trainers', text: 'Certified tutors with real teaching experience.' },
    { icon: MessageSquare, title: 'Immersive Tools', text: 'Live transcripts, quizzes and pronunciation scoring.' }
  ]

  const faqs = [
    { q: 'How do I choose a trainer?', a: 'Use filters (experience, rating, price) and send a short message to get a feel. Look for video intros and student reviews.' },
    { q: 'What languages are available?', a: '50+ languages including Spanish, French, German, Chinese, Japanese, Arabic and many dialects.' },
    // { q: 'Can I try before I pay?', a: 'Yes — we offer a free trial credit for first-time students. Trial availability depends on the trainer.' },
    { q: 'How do payments work?', a: 'We use Stripe for secure checkout. Cards and Apple/Google Pay are accepted where available.' },
    { q: 'Can I reschedule or cancel?', a: 'Reschedule up to 24 hours before a session. Some trainers may have different policies — check their profile.' },
    { q: 'Do trainers provide materials?', a: 'Many trainers include PDFs, flashcards or audio. You can also upload your own material before a lesson.' },
    { q: 'Is there a mobile app?', a: 'Coming soon — our PWA works great on mobile and can be installed to your home screen.' },
    {
      q: "What is the procedure to become a tutor at LearniLM🌍World?",
      a: "Becoming a tutor involves a few simple steps — from applying to onboarding. Here’s how you can start your journey with us:",
    },
    {
      q: "Step 1: How do I submit my application?",
      a: "Begin by submitting your application through our official LearnOsphere website. Make sure your details are accurate and complete.",
    },
    {
      q: "Step 2: What happens after I apply?",
      a: "Our recruitment team will carefully review your application within 7 working days. You’ll receive an update about your application status via email.",
    },
    {
      q: "Step 3: What is the interview and evaluation process?",
      a: "If your profile meets our criteria, you’ll be invited for an interview and assessment. This step evaluates your communication and conversational teaching skills.",
    },
    {
      q: "Step 4: What happens after the evaluation?",
      a: "After successfully completing the evaluation, our team provides personalized feedback and necessary training to align your teaching with our methods.",
    },
    {
      q: "Step 5: How does onboarding work?",
      a: "Once you complete the required steps and training, you officially join EnglishYaari as a tutor — ready to empower learners with improved spoken English skills.",
    },
  ]

  const reviews = [
    {
      name: 'Sarath',

      text: 'The trainers are excellent — practical and patient. After a month I was comfortable conducting client calls in Spanish. The homework and recorded sessions were invaluable.',
      rating: 5
    },
    {
      name: 'Murali',
      text: 'Lessons are structured but flexible. My speaking confidence improved rapidly. The trainer recommended focused listening tasks that really helped.',
      rating: 4
    },
    {
      name: 'Akhil',
      text: 'The cultural mini-lessons helped me with real conversations while traveling. The trainer prepared a short phrase sheet for my trip — super useful!',
      rating: 5
    },
    {
      name: 'Neha',
      text: 'Easy scheduling and consistent progress checks. I love the micro-lessons between full sessions.',
      rating: 4
    }
  ]


  return (
    <div className="min-h-screen font-inter text-[#2D274B] transition-colors duration-500 bg-[#FFFAF1] bg-fixed"
      style={{
        backgroundImage:
          `url(${bg_main})`,
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >

      {/* 2D274B  text- #dc8d33*/}
      {/* bg-[#6B48AF]/95 backdrop-blur-sm border-b border-white/30 text-white */}
      <Navbar />

      <main className="pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-left"
            >
              <h1 className="text-5xl md:text-5xl font-serif leading-tight font-extrabold text-[#2D274B]">
                Helping learners grow,
                <br />
                {/* e0fa84 */}
                <span className="text-[#F64EBB]"> emotionally </span>
                <span className="text-[#2D274B]">and</span>
                <br />
                <span className="text-[#F64EBB]">intellenctually</span>
              </h1>

              <p className="mt-6 text-2xl md:text-3xl text-[#2D274B] font-bold max-w-xl">
                Clarity comes with the <span className="text-[#F64EBB]">Right Mentors</span>
              </p>
              <p className='mt-2 text-xl font-bold md:text-2xl text-[#F64EBB]'>Learn from natives. Speak like natives</p>

              <div className="mt-10">
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    to="/student/courses"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#F53886] to-[#A644FF] text-white text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Browse Courses</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                  <Link
                    to="/demo"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-900 text-lg font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Play className="w-5 h-5 text-[#F64EBB] fill-current" />
                    <span>Book a FREE Demo</span>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:gap-x-8">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-50 rounded-full text-[#F64EBB] shrink-0">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-bold text-gray-900 text-base leading-none">Native</span>
                      <span className="text-gray-500 text-xs mt-1">mentors + real accent</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-50 rounded-full text-[#F64EBB] shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-bold text-gray-900 text-base leading-none">Speaking</span>
                      <span className="text-gray-500 text-xs mt-1">focused practice</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-50 rounded-full text-[#F64EBB] shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-bold text-gray-900 text-base leading-none">Flexible</span>
                      <span className="text-gray-500 text-xs mt-1">weekday/weekend batches</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* chaned color to wite from [#7fe808],[#ef4444] and [#9787F3] */}
              {/* <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                <motion.div initial={{ scale: 0.95 }} animate={mounted ? { scale: 1 } : {}} className="text-center">
                  <div className="text-2xl font-bold text-white">400+</div>
                  <div className="text-sm text-[#2D274B]">Trainers</div>
                </motion.div>
                <motion.div initial={{ scale: 0.95 }} animate={mounted ? { scale: 1.03 } : {}} className="text-center">
                 
                  <div className="text-2xl font-bold text-white">60+</div>
                  <div className="text-sm text-[#2D274B]">Languages</div>
                </motion.div>
                <motion.div initial={{ scale: 0.95 }} animate={mounted ? { scale: 1.06 } : {}} className="text-center">
                  <div className="text-2xl font-bold text-white">12K+</div>
                  <div className="text-sm text-[#2D274B]">Students</div>
                </motion.div>
              </div> */}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden  -translate-y-6 md:-translate-y-12">
              <img loading="lazy" src={heroImage3} alt="students practicing a language together" className="w-full h-[420px] md:h-96 lg:h-[520px] object-contain" />

              {/* Left card - moved up */}
              {/* <div className="absolute left-6 bottom-24 w-52 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                <img loading="lazy" src={cardImage1} alt="culture and conversation" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="text-sm font-semibold">Cultural conversations</div>
                  <div className="text-xs text-slate-500">Contextual lessons you’ll actually use</div>
                </div>
              </div> */}

              {/* Right top card - nudged slightly higher */}
              {/* <div className="absolute right-6 top-2 w-44 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                <img loading="lazy" src={cardImage2} alt="tutor profile" className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-sm font-semibold">Meet tutors</div>
                  <div className="text-xs text-slate-500">See video intros & ratings</div>
                </div>
              </div> */}

              {/* Lower-right card - lifted up and pulled inwards */}
              {/* <div className="absolute -right-6 bottom-36 w-64 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                <div className="p-4">
                  <div className="text-lg font-bold">Practice </div>
                  <div className="text-xs text-slate-500 mt-2">Short tasks to try between lessons</div>
                </div>
                <img loading="lazy" src={cardImage3} alt="mini lesson" className="w-full h-20 object-cover" />
              </div> */}

            </motion.div>
          </div>
        </div>
      </main>
      {/* Why learners love us section */}
      {/* bg-[#2D274B] */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="gap-8 items-start">
            {/* LEFT – Heading only */}
            <div className='flex justify-center items-center text-center'>
              <h3 className="text-4xl font-semibold font-serif text-[#F64EBB]">
                Why learners love <br /> LearniLM🌍World
              </h3>
            </div>

            {/* EMPTY right cell for row balance */}
            <div />

            {/* PARAGRAPH – spans both columns */}
            <div className="lg:col-span-2 flex justify-center items-center text-center">
              <p className="mt-4 text-lg font-bold max-w-4xl text-[#2D274B]">
                Short lessons, lots of speaking time and tutors focused on practical
                outcomes. Learn phrases you’ll use the very next day.
              </p>
            </div>

            {/* LEFT – Feature cards */}
            <div>
              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {features.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-blue-50 rounded-xl shadow hover:bg-[#F64EBB] hover:text-gray-200 hover:scale-[1.02] transition"
                    role="group"
                  >
                    <f.icon className="w-9 h-9 text-[#9787F3]" aria-hidden />
                    <div className="font-bold mt-3">{f.title}</div>
                    <div className="text-base font-semibold text-[#4B437C] hover:text-gray-50 mt-1">
                      {f.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT – Shifted down */}
            <div className="space-y-4 mt-10">
              <div className="bg-blue-50 p-6 rounded-2xl shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#fde68a] flex items-center justify-center">
                    ⭐
                  </div>
                  <div>
                    <div className="font-extrabold text-xl">Real outcomes</div>
                    <div className="text-base font-semibold text-[#4B437C]">
                      Progress reports every 4 lessons
                    </div>
                  </div>
                </div>
                <p className="text-[#4B437C] font-semibold text-lg">
                  From small talk to business calls — our curriculum is outcome-focused
                  so you can see measurable improvement.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl shadow font-extrabold hover:bg-[#F64EBB] hover:text-white">
                  Quick lessons
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow font-extrabold hover:text-white hover:bg-[#F64EBB]">
                  Excellent Material
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      <TopTrainers />

      {/* Language Levels Explanation */}
      {/*  bg-[#2D274B] */}
      <section
        className="relative py-12 text-[#dc8d33]"
        aria-labelledby="sdil-courses"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          {/* Heading */}
          <motion.h2
            id="sdil-courses"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-5xl font-extrabold font-serif text-[#F64EBB] tracking-tight"
          >
            Languages That Open Doors
            <span className="block text-[#F64EBB] mt-1">
              Speak to the World with Confidence
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-xl text-[#2D274B] font-bold max-w-3xl mx-auto"
          >
            Explore world languages guided by international certification standards.
            Learn from certified trainers across every level.
          </motion.p>

          {/* Tag */}
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border text-sm font-medium text-[#4B437C] shadow-sm">
              🌍 Languages & Levels
            </div>
          </div>

          {/* Responsive Grid with Flags */}
          <div className="mt-16 grid gap-6  justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {languages.map((lang, idx) => (
              <LanguageCard
                key={idx}
                data={lang}
                onConfirm={handleLanguageClick}
              />
            ))}

            {/* More card separate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}

              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.96 }}

              className="
              group relative h-[230px] flex items-center justify-center cursor-pointer transition-all duration-500 ease-out "
              onClick={() => setShowMoreLanguages(true)}
            >
              <div
                className=" 
                w-40 h-40 rounded-full bg-[#F64EBB] text-white font-bold flex flex-col items-center justify-center shadow-[0_20px_30px_5px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out group-hover:shadow-[0_40px_50px_10px_rgba(0,0,0,0.4)]"
              >
                <span className="text-3xl leading-none">+</span>
                <span className="text-sm mt-1">More</span>
              </div>
            </motion.div>

          </div>
        </div>
        {/* Modal for More Languages */}
        {showMoreLanguages && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            onClick={() => setShowMoreLanguages(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="
        rounded-3xl p-10 max-w-3xl w-[90%] relative 
        shadow-2xl
        bg-gradient-to-br from-[#ffffff] via-[#f0f6ff] to-[#dceaff]
        border border-white/40
      "
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMoreLanguages(false)}
                className="absolute top-4 right-4 text-[#2D274B] hover:text-black text-2xl"
              >
                ✕
              </button>

              {/* Title */}
              <h3 className="text-3xl font-bold text-[#2D274B] mb-6">
                Explore More Languages
              </h3>

              {/* Languages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6">
                {[
                  { name: "Thai", flag: "th" },
                  { name: "Bengali", flag: "in" },
                  { name: "Russian", flag: "ru" },
                  { name: "Mandarin", flag: "cn" },
                  { name: "Swahili", flag: "ke" },
                  { name: "Italian", flag: "it" },
                  { name: "Portuguese", flag: "pt" },
                  { name: "Korean", flag: "kr" },
                ].map((lang, i) => (
                  <div
                    key={i}
                    onClick={() => handleMoreLanguageClick(lang.name)}
                    className="
              group cursor-pointer 
              h-32 rounded-2xl 
              bg-white 
              shadow-md hover:shadow-xl 
              border border-slate-200
              transition-all duration-300 
              flex flex-col items-center justify-center
              hover:-translate-y-1 hover:scale-[1.05]
            "
                  >
                    <img
                      src={`https://flagcdn.com/${lang.flag}.svg`}
                      alt={lang.name}
                      className="w-12 h-12 mb-2 rounded-md shadow-sm"
                    />
                    <div className="text-[#2D274B] text-lg font-semibold text-center">
                      {lang.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Explore subjects section */}
      {/* bg-[#dc8d33] */}
      <section
        className="relative py-24 "
        aria-labelledby="sdil-subjects"
      >
        <div className="max-w-6xl  mx-auto px-6 lg:px-8 text-center">
          {/* Heading */}
          <motion.h2
            id="sdil-subjects"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl md:text-5xl font-serif tracking-tight font-extrabold text-[#F64EBB]"
          >
            Subjects You Can Explore
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-xl text-[#2D274B] font-bold max-w-2xl mx-auto"
          >
            Comprehensive courses across academic and professional subjects for holistic learning.
          </motion.p>

          {/* Grid Subjects */}
          <div className='flex justify-center'>


            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3,
                    delayChildren: 0.3,   // slight initial delay for smoother entrance
                  },
                },
              }}
              className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 box "
            >
              {[
                {
                  name: "Maths",
                  img: math,
                },
                {
                  name: "Physics",
                  img: phy,
                },
                {
                  name: "Chemistry",
                  img: chem,
                },
                {
                  name: "Biology",
                  img: bio,
                },
                {
                  name: "History",
                  img: hist,
                },
                {
                  name: "Geography",
                  img: geo,
                },
                {
                  name: "Computer Science",
                  img: cs,
                },
                {
                  name: "More",
                  img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=100",
                  isMore: true,
                },
              ].map((subject, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative h-60 w-60 rounded-[24px] bg-white shadow-[0_20px_30px_5px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out hover:-translate-y-4 hover:shadow-[0_40px_50px_10px_rgba(0,0,0,0.4)] cursor-pointer"
                  style={{
                    backgroundImage: `url(${subject.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",

                  }}
                  onClick={() => handleSubjectClick(subject)}
                >
                  {/* Overlay */}
                  <div className=" rounded-[24px] absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>

                  {/* Subject Name */}
                  <div
                    className={`absolute top-3 left-3 ${subject.isMore
                      ? "bg-[#F64EBB] text-[white]"
                      : "bg-white/90 text-[#2D274B]"
                      } px-3 py-1 rounded-md font-bold text-lg shadow`}
                  >
                    {subject.name}
                  </div>

                  {/* “More” Hover Text */}
                  {/* {subject.isMore && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    Explore More →
                  </div>
                )} */}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Modal for More Subjects */}
        {showMore && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => setShowMore(false)}>

            <div className="
              rounded-3xl p-10 max-w-4xl w-[90%] relative 
              shadow-2xl
              bg-gradient-to-br from-[#ffffff] via-[#f8f1ff] to-[#e9d8ff]
              border border-white/40
            ">

              {/* Close Button */}
              <button
                onClick={() => setShowMore(false)}
                className="absolute top-4 right-4 text-[#2D274B] hover:text-black text-2xl"
              >
                ✕
              </button>

              {/* Title */}
              <h3 className="text-3xl font-bold text-[#2D274B] mb-6">
                Explore More Subjects
              </h3>

              {/* Subjects Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {[
                  { name: "Economics", icon: "📊" },
                  { name: "Hindi", icon: "📝" },
                  { name: "Bengali", icon: "📚" },
                  { name: "Psychology", icon: "🧠" },
                  { name: "Philosophy", icon: "⚖️" },
                  { name: "Environmental Science", icon: "🌿" },
                  { name: "Accounts & Finance", icon: "💰" },
                ].map((subj, i) => (
                  <div
                    key={i}
                    onClick={() => handleMoreSubjectClick(subj.name)}
                    className="
                      group cursor-pointer 
                      h-36 rounded-2xl 
                      bg-white 
                      shadow-md hover:shadow-xl 
                      border border-slate-200
                      transition-all duration-300 
                      flex flex-col items-center justify-center
                      hover:-translate-y-1 hover:scale-[1.05]
                    "
                  >
                    {/* Icon */}
                    <div
                      className="
                        text-4xl mb-2 
                        group-hover:scale-125 
                        transition-transform duration-300
                      "
                    >
                      {subj.icon}
                    </div>

                    {/* Label */}
                    <div
                      className="
                        text-[#593C9F] text-lg font-semibold 
                        text-center group-hover:text-[#2D1B69]
                        transition-colors
                      "
                    >
                      {subj.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Explore Hobbies Section */}
      {/* bg-[#2D274B] */}
      <section
        className="relative py-12 "
        aria-labelledby="sdil-hobbies"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          {/* Heading */}
          <motion.h2
            id="sdil-hobbies"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl md:text-5xl font-serif tracking-tight font-extrabold text-[#F64EBB]"
          >
            Beyond Academics, Your Passion Awaits
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-2xl text-[#2D274B] font-semibold max-w-2xl mx-auto"
          >
            Build creativity and skills with professional <br />Hobby / Passion trainers.
          </motion.p>

          {/* Grid Hobbies */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3, delayChildren: 0.3 },
              },
            }}
            className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {[
              {
                name: "Dancing",
                img: "https://images.unsplash.com/photo-1500336624523-d727130c3328?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Fitness",
                img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Cooking",
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Singing",
                img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=100",
              },
              {
                name: "Painting",
                img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXJ0fGVufDB8fDB8fHww",
              },
              {
                name: "Photography",
                img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "Calligraphy",
                img: "https://plus.unsplash.com/premium_photo-1661887864467-ae3ca94f7ffa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                name: "More",
                img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=100",
                isMore: true,
              },
            ].map((hobby, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative h-56 rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{
                  backgroundImage: `url(${hobby.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handleHobbyClick(hobby)}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300"></div>

                {/* Hobby Name */}
                <div
                  className={`absolute top-3 left-3 ${hobby.isMore
                    ? "bg-[#CBE56A] text-[#2D274B]"
                    : "bg-white/90 text-[#2D274B]"
                    } px-3 py-1 rounded-md font-bold text-lg shadow`}
                >
                  {hobby.name}
                </div>

                {/* More Overlay */}
                {hobby.isMore && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    Explore More →
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Modal for More Hobbies */}
        {showMoreHobbies && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => setShowMoreHobbies(false)}>

            <div
              className="
                rounded-3xl p-10 max-w-4xl w-[90%] relative 
                shadow-2xl
                bg-gradient-to-br from-[#ffffff] via-[#f1fff8] to-[#d8ffe7]
                border border-white/40
              " onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMoreHobbies(false)}
                className="absolute top-4 right-4 text-[#2D274B] hover:text-black text-2xl"
              >
                ✕
              </button>

              {/* Title */}
              <h3 className="text-3xl font-bold text-[#2D274B] mb-6">
                Explore More Hobbies
              </h3>

              {/* Hobbies Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">

                {[
                  { name: "Yoga", icon: "🧘‍♀️" },
                  { name: "Knitting", icon: "🧶" },

                  { name: "Guitar", icon: "🎸" },
                  { name: "Piano (Theory)", icon: "🎹" },
                  { name: "Chess", icon: "♟️" },
                  { name: "Public Speaking", icon: "🎙️" },

                  { name: "Meditation", icon: "🕉️" },
                  { name: "Creative Writing", icon: "📖" },
                ].map((hb, i) => (
                  <div
                    key={i}
                    onClick={() => handleMoreHobbyClick(hb.name)}
                    className="
                      group cursor-pointer 
                      h-36 rounded-2xl 
                      bg-white 
                      shadow-md hover:shadow-xl 
                      border border-slate-200
                      transition-all duration-300 
                      flex flex-col items-center justify-center
                      hover:-translate-y-1 hover:scale-[1.05]
                    "
                  >
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                      {hb.icon}
                    </div>

                    <div
                      className="
                        text-[#1C6B4A] text-lg font-semibold 
                        text-center 
                        group-hover:text-[#0d4a32]
                        transition-colors
                      "
                    >
                      {hb.name}
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}
      </section>

      {/* Highlights Section */}
      <section
        className="relative py-24  text-white"
        aria-labelledby="sdil-highlights"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <motion.h2
            id="sdil-highlights"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-[#F64EBB] tracking-tight text-center"
          >
            Highlights of LearniLM 🌎 World
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-xl font-bold text-[#2D274B] max-w-2xl mx-auto text-center"
          >
            Our approach ensures effective learning, flexibility, and comprehensive support.
          </motion.p>

          {/* Image + Icon Highlights */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.wDczP_2HXmI-762eR-rEoQHaHa?w=612&h=612&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Learning Highlights"
                className="rounded-2xl shadow-md max-w-sm w-full object-cover"
              />
            </motion.div>

            {/* Right Icons Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-8 text-center "
            >
              {[
                {
                  icon: "🎯",
                  title: "Flexible Timings",
                  desc: "Learn at your own pace with live and recorded sessions.",
                },
                {
                  icon: "💻",
                  title: "Online Batches",
                  desc: "Join collaborative learning groups from anywhere in the world.",
                },
                {
                  icon: "📜",
                  title: "Certified Courses",
                  desc: "Earn certificates that enhance your professional credibility.",
                },
                {
                  icon: "👨‍🏫",
                  title: "Expert Faculty",
                  desc: "Gain insights from top mentors and experienced trainers.",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-[#6B48AF] rounded-2xl border border-white/20 hover:border-[#dc8d33] transition"
                >
                  <div className="text-5xl mb-3">{feature.icon}</div>
                  <h4 className="text-lg font-semibold text-[#e0fa84]">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-white text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Closing Line */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-lg text-center text-[#2D274B] font-bold max-w-3xl mx-auto"
          >
            Personalized support and guidance ensure every learner’s success at <br /> LearniLM 🌎 World.
          </motion.p>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16" aria-labelledby="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="how-it-works" className="text-4xl font-bold md:text-4xl font-serif text-[#F64EBB]">How it works — in 4 simple steps</h2>
            <p className="mt-3 text-[#2D274B] text-lg font-bold max-w-2xl mx-auto">Designed to get you speaking fast: pick, book, practice and track.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-gradient-to-b from-[#f0fdf4] to-white rounded-2xl p-6 shadow hover:shadow-xl transition" role="article">
                <div className="w-14 h-14 rounded-lg bg-white shadow flex items-center justify-center mb-4">
                  <s.icon className="text-[#9787F3]" aria-hidden />
                </div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-[#4B437C] mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Reviews */}
      {/* <section className="py-16" aria-labelledby="reviews">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 id="reviews" className="text-4xl font-serif font-bold text-[#F64EBB]">What learners say</h3>
            <p className="mt-2 text-[#2D274B] font-bold text-lg">Real reviews from students and professionals who used LearniLM🌍World.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <article key={i} className="bg-white rounded-xl shadow p-6 hover:shadow-2xl transition " aria-label={`Review by ${r.name}`}>
                <div className="flex items-center gap-3 mb-3 ">
                  <div className="w-12 h-12 rounded-full bg-[#fde68a] flex items-center justify-center font-semibold">{r.name.split(' ')[0][0]}</div>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    
                  </div>
                </div>
                <p className="text-[#4B437C]">“{r.text}”</p>
                
                <div className="mt-4 text-sm text-[#4B437C]">{Array.from({ length: r.rating }).map((_) => '★').join('')}</div>
              </article>
            ))}
          </div>
        </div>
      </section> */}


      {/* FAQ */}
      <section className="py-16" aria-labelledby="faq-heading">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h3 id="faq-heading" className="text-4xl font-serif text-center font-extrabold">Frequently Asked Questions</h3>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between" aria-expanded={openFaq === i} aria-controls={`faq-${i}`}>
                  <div className="text-left">
                    <div className="font-bold text-lg">{f.q}</div>
                    {openFaq === i && <div id={`faq-${i}`} className="text-base font-bold text-[#4B437C] mt-2">{f.a}</div>}
                  </div>
                  <div className="ml-4">
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown />
                    </motion.div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* text-[#e0fa84] text-[#2D274B] */}

      {/* CTA  bg-gradient-to-r from-[#9787F3]/10 to-[#f97316]/8*/}
      <section className="py-12 ">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h4 className="text-4xl font-extrabold text-[#F64EBB] ">Master Your Skills, Confidently</h4>
          {/* <p className="text-[#2D274B] text-xl font-bold mt-2">Sign up to Claim Your Free Trial Session. Get a Personalized 7-Day Learning Path After Your First Session.</p>
          2D274B */}
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/main" className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-[#F64EBB] text-[white] hover:bg-[#fe1fb0]">Browse trainers <ChevronRight /></Link>
            <Link to="/become-trainer" className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border bg-[#F64EBB] border-[#CBE56A] text-[white] hover:bg-[#fe1fb0]">Become a trainer</Link>
          </div>
        </div>
      </section>

      {/* Footer - expanded */}
      <Footer />
    </div>
  )
}


// {[
//               {
//                 name: "Maths",
//                 img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUfVuI-52gMsBUjICo8U71bZzPh_Sl60a0rw&s",
//               },
//               {
//                 name: "Geography",
//                 img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStimZbjbIU3wmA6leFoxxaiMHEV44X5zg6Eg&s",
//               },
//               {
//                 name: "Physics",
//                 img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaokOEDxUXqruUqK6jfotlGNnh_cqkv_7YKQ&s",
//               },
//               {
//                 name: "Chemistry",
//                 img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYYeicpqHLfxEoRF1mR5aUn8bda5xZKp_50w&s",
//               },
//               {
//                 name: "Mathematics",
//                 img: {math},
//               },
//               {
//                 name: "Biology",
//                 img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwCZsh8ORVYuaRBk5UVIjupZH-uJdpqSrNNA&s",
//               },
//               {
//                 name: "Computer Science",
//                 img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGt5xq-25cqfQWyM8Z0Yu706O8s_aCraXM9A&s",
//               },
//               {
//                 name: "More",
//                 img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=100",
//                 isMore: true,
//               },
//             ]