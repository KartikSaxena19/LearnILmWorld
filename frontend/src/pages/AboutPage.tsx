import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  HelpCircle,
  FileText,
  BookOpen,
  Briefcase,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"
// import logo from "../assets/LearnilmworldLogo.jpg";
import about_us from '../assets/About_us1.png';
import our_story from '../assets/our_story.png';
import careers_img from '../assets/careers_img.png';
import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap"
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AboutPage() {
  const location = useLocation()
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });

  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [showFeedback, setShowFeedback] = React.useState(false);


  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [location])

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFeedbackStatus(null);

  try {
    const res = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send feedback');
    }

    setFeedbackStatus('success');
    setFeedbackData({ name: '', email: '', category: '', message: '' });
  } catch (err: any) {
    console.error(err);
    setFeedbackStatus('error');
  }
};
  

  return (
    <div className="min-h-screen font-inter bg-[#dc8d33] text-[#2D274B] scroll-smooth">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#2D274B]/95 backdrop-blur-sm border-b border-white/30 text-[#dc8d33]">
        <Container className="py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <div className="text-2xl md:text-3xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center">
                <span className="text-[#dc8d33]">
                  LearniLM</span>
                <motion.span 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="inline-block mx-1 text-3xl"
                >
                🌎
                </motion.span>
                <span className="text-[#dc8d33]">
                  World</span>
                  {/* <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-full blur-xl pointer-events-none"
                  animate={{ x: [-200, 200] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  /> */}
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link to="/main" className="text-base font-medium hover:text-[#CBE56A]">
                Browse Mentors
              </Link>
              <Link to="/login" className="text-base font-medium hover:text-[#CBE56A]">
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBE56A] text-[#2D274B] text-sm font-semibold shadow hover:scale-105 transition"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile Nav */}
            <div className="sm:hidden">
              <Button variant="light" onClick={() => setShowOffcanvas(true)} aria-label="Open menu">
                ☰
              </Button>
              <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="flex-column gap-3">
                    <Nav.Link as={Link} to="/main" onClick={() => setShowOffcanvas(false)}>
                      Trainers
                    </Nav.Link>
                    <Nav.Link as={Link} to="/login" onClick={() => setShowOffcanvas(false)}>
                      Sign In
                    </Nav.Link>
                    <Link
                      to="/register"
                      onClick={() => setShowOffcanvas(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9787F3] text-white text-sm font-semibold mt-2"
                    >
                      Get Started
                    </Link>
                  </Nav>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
          </div>
        </Container>
      </header>

      {/* ABOUT SECTION */}
      <section id="about" className="pt-24 pb-28 bg-[#dc8d33]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* MAIN HEADING (Centered above both sides) */}
          <h1 className="text-5xl md:text-5xl font-serif font-extrabold text-[#2D274B] text-center mb-14">
            About LearniLM🌎World
          </h1>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* LEFT TEXT SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-left flex flex-col justify-center h-full"
            >
              {/* SUBHEADING */}
              <h2 className="text-3xl md:text-4xl text-center font-serif font-bold text-[#2D274B] mb-6">
                Empowering Learners Everywhere
              </h2>


              <p className="text-2xl text-white font-bold leading-relaxed max-w-xl">
                We are on a mission to make quality education and skill-building accessible to everyone —
                through personalized, flexible, and affordable learning experiences.
              </p>

              {/* BADGE ROW */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-sm text-[#4B437C] shadow-sm">
                  🌍 Global Community
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-sm text-[#4B437C] shadow-sm">
                  🎓 Quality Education
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-sm text-[#4B437C] shadow-sm">
                  💡 Accessible Learning
                </div>
              </div>
            </motion.div>

            {/* RIGHT IMAGE SECTION */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              viewport={{ once: true }}
              className="relative w-full h-full flex justify-center items-center"
            >
              <img
                src={about_us}
                alt="Our Mission"
                className="w-full h-full max-h-[520px] object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* VISION & CORE VALUES */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#2D274B] to-[#1E1A3A] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-serif font-bold text-[#CBE56A] mb-10"
          >
            Our Vision & Core Values
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-lg max-w-3xl mx-auto text-gray-200 mb-8 leading-relaxed">
              <strong>Our Vision:</strong> To create a world where learning is limitless, empowering individuals to
              explore, innovate, and grow without barriers — transforming education into a lifelong adventure.
            </p>
          </motion.div>

          <div className="mt-16 grid md:grid-cols-4 gap-8">
            {[
              { title: "Empowerment", text: "We believe in unlocking every learner’s potential through opportunity and support." },
              { title: "Integrity", text: "We uphold transparency, fairness, and trust in everything we build and teach." },
              { title: "Innovation", text: "We constantly evolve through technology to make education smarter and more engaging." },
              { title: "Community", text: "We foster a global network where learners and mentors uplift one another." },
            ].map((v, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow hover:scale-105 transition"
              >
                <h3 className="text-xl font-bold text-[#CBE56A] mb-2">{v.title}</h3>
                <p className="text-gray-300">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* OUR STORY */}
      <section className="py-24 bg-gradient-to-b from-[#dc8d33] to-[#f3b765] text-[#2D274B] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* HEADING */}
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-serif font-bold text-center mb-16"
          >
            Our Story
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* LEFT: IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#2D274B]/20 rounded-full blur-xl"></div>
              <img
                src={our_story}
                alt="Our Story"
                className="w-full rounded-3xl shadow-2xl object-cover"
              />
            </motion.div>

            {/* RIGHT: TEXT */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h3 className="text-3xl font-serif font-extrabold mb-4">
                How LearniLM🌎World Began
              </h3>
              <p className="text-lg text-white font-semibold leading-relaxed mb-4">
                What started as a simple idea — to make learning truly personal — evolved into a global
                movement connecting passionate trainers and eager learners across the world.
              </p>
              <p className="text-lg text-white font-semibold leading-relaxed">
                Through dedication, creativity, and a belief that knowledge should have no limits,
                <span className="text-white font-bold"> LearniLM🌎World </span>
                continues to empower individuals to grow academically, professionally, and personally.
              </p>
            </motion.div>
          </div>

          {/* QUOTE / CLOSING LINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <p className="italic text-[#2D274B] text-3xl font-light max-w-3xl mx-auto">
              “Every learner has a story. Ours is about making each one count.”
            </p>
          </motion.div>
        </div>
      </section>


      {/* CAREERS */}
      <section id="careers" className="py-24 px-6 bg-[#2D274B] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Briefcase size={40} className="mx-auto mb-4 text-[#CBE56A]" />
          </motion.div>

          <h2 className="text-4xl font-serif font-bold text-[#CBE56A]">Careers at LearniLM🌎World</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-200">
            Join a mission-driven team transforming education. Your ideas matter, your growth is
            supported, and your work makes a real impact.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {[
              "Flexible Work Environment",
              "Learning & Development Support",
              "Inclusive Culture",
              "Competitive Compensation",
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 p-6 rounded-2xl shadow hover:scale-105 transition"
              >
                <h4 className="text-xl font-bold text-[#CBE56A]">{benefit}</h4>
              </motion.div>
            ))}
          </div>

          {/* IMAGE + OPEN ROLES SECTION */}
          <div className="mt-16 grid md:grid-cols-2 gap-10 items-center text-left">
            <motion.img
              src={careers_img} // 🔹 Replace with your careers image variable or URL
              alt="Team working together"
              className="rounded-3xl shadow-lg w-full object-cover h-[350px]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#CBE56A]">Open Roles</h3>
              <ul className="space-y-2 text-lg">
                <li>• Product Manager</li>
                <li>• Marketing Executive</li>
                <li>• Full Stack Developer</li>
                <li>• Community Manager (more roles updated regularly)</li>
              </ul>

              <Link
                to="/careers"
                className="mt-8 inline-block px-6 py-3 bg-[#CBE56A] text-[#2D274B] font-bold rounded-full hover:scale-105 transition"
              >
                Explore Careers →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOG / INSIGHTS */}
      <section id="blog" className="py-24 px-6 bg-[#dc8d33] text-[#2D274B]">
        <div className="max-w-7xl mx-auto text-center">
          <BookOpen size={40} className="mx-auto mb-4 text-[#2D274B]" />
          <h2 className="text-4xl font-serif font-bold">From the LearniLM🌎World Desk</h2>
          <p className="mt-5 text-lg text-white font-semibold max-w-3xl mx-auto">
            Explore stories, tips, and ideas that inspire learners and educators alike —
            where curiosity meets opportunity.
          </p>

          {/* Featured Blog Cards */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "How Personalized Learning is Shaping the Future",
                excerpt:
                  "Discover how tailored education approaches are redefining success for modern learners across the globe.",
                image:
                  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "The Power of Mentorship in Digital Learning",
                excerpt:
                  "Behind every great learner is a great mentor. Learn how human connection drives engagement and growth online.",
                image:
                  "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bridging Skills and Opportunities for All",
                excerpt:
                  "At LearniLM🌎World, we’re committed to creating accessible pathways that connect learners to real-world possibilities.",
                image:
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
              },
            ].map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md hover:scale-105 transition"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 text-[#2D274B]">{post.title}</h3>
                  <p className="text-white/90 mb-4">{post.excerpt}</p>
                  <p className="text-sm font-semibold text-[#2D274B]">#LearnWithPurpose</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing Line */}
          <p className="mt-12 text-white text-lg font-semibold">
            🌍 Stay tuned — new insights, success stories, and learning resources are added regularly!
          </p>
        </div>
      </section>


      {/* HELP CENTRE */}
      <section id="help" className="py-24 px-6 bg-[#2D274B] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <HelpCircle size={40} className="mx-auto mb-4 text-[#CBE56A]" />
          <h2 className="text-4xl font-serif font-bold text-[#CBE56A]">Help Centre</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-200">
            Need assistance? Find quick answers and guides to help both learners and mentors navigate LearniLM🌎World with ease.
          </p>

          {/* FAQs / Accordion */}
          <div className="mt-12 text-left space-y-4">
            {[
              {
                q: "How do I book a learning session?",
                a: "Go to your dashboard, choose a course or mentor, and click 'Book Session'. You’ll receive a confirmation email instantly after booking.",
              },
              {
                q: "How can I become a trainer on LearniLm World?",
                a: "Submit your profile through the ‘Join as Trainer’ form. Once verified by our team, you’ll be able to create and manage your own sessions.",
              },
              {
                q: "What are your payment and refund policies?",
                a: "Payments are securely processed through our trusted partners. Refunds are available within 7 days for eligible cases under our learner protection policy.",
              },
              {
                q: "How do I manage my schedule or classes?",
                a: "You can update your availability, reschedule classes, or cancel sessions anytime under ‘My Schedule’ in your profile settings.",
              },
              {
                q: "I’m facing technical issues — what should I do?",
                a: "Try refreshing the page or clearing your browser cache first. If the issue persists, contact our support team for quick assistance.",
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/20 transition"
              >
                <summary className="text-xl font-semibold text-[#CBE56A]">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-200 text-base leading-relaxed">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>

          {/* Contact Help Line + Feedback Form */}
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-300 font-medium">
              Still need help? Reach out to us anytime at{" "}
              <span className="text-[#CBE56A] font-semibold">support@learnilmworld.com</span>
            </p>

            {/* Feedback Button */}
            <button
              onClick={() => setShowFeedback(true)}
              className="mt-6 bg-[#CBE56A] text-[#2D274B] px-6 py-3 rounded-full font-semibold hover:bg-[#d5f56a] transition"
            >
              Give Feedback
            </button>

            {/* Feedback Modal */}
            {showFeedback && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-[#2D274B] text-white rounded-2xl p-8 w-[90%] max-w-lg relative">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>

                  <h3 className="text-2xl font-bold text-[#dc8d33] mb-4">We value your feedback 🌟</h3>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={feedbackData.name}
                      onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CBE56A] focus:border-[#CBE56A] transition-all duration-300"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Your Email"
                      value={feedbackData.email}
                      onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-[#CBE56A]"
                      required
                    />

                    <select
                      value={feedbackData.category}
                      onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#3a3460] border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CBE56A] focus:border-[#CBE56A] transition-all duration-300 appearance-none"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>

                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      value={feedbackData.message}
                      onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-[#CBE56A]"
                      required
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#CBE56A] text-[#2D274B] font-semibold py-3 rounded-xl hover:scale-105 transition"
                    >
                      Submit Feedback
                    </button>
                  </form>

                  {feedbackStatus === 'success' && (
                    <p className="text-[#CBE56A] font-semibold mt-4 text-center">
                      Thank you! Your feedback has been submitted.
                    </p>
                  )}
                  {feedbackStatus === 'error' && (
                    <p className="text-red-600 font-semibold mt-4 text-center">
                      ❌ FAILED to send feedback. Please try again.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* TERMS & CONDITIONS */}
      <section id="terms" className="py-24 px-6 bg-[#dc8d33] text-[#2D274B]">
        <div className="max-w-6xl mx-auto text-center">
          <FileText size={40} className="mx-auto mb-4 text-[#2D274B]" />
          <h2 className="text-4xl font-serif font-bold">Terms & Conditions</h2>
          <p className="mt-4 text-lg text-white font-semibold max-w-3xl mx-auto">
            By accessing or using LearniLM🌎World, you agree to our policies and terms. These ensure a safe,
            transparent, and fair learning environment for everyone.
          </p>

          {/* Terms Accordion */}
          <div className="mt-12 text-left space-y-4">
            {[
              {
                title: "User Eligibility & Responsibilities",
                content:
                  "Users must provide accurate information during registration and are responsible for maintaining account confidentiality. Accounts found engaging in fraudulent activity may be suspended.",
              },
              {
                title: "Booking, Payments & Cancellations",
                content:
                  "All bookings are subject to trainer availability. Payments are securely processed through our payment partners. Cancellations or reschedules must follow the platform’s stated policy to qualify for refunds.",
              },
              {
                title: "Code of Conduct",
                content:
                  "Learners and trainers are expected to maintain professionalism, respect, and integrity. Misuse of communication channels or inappropriate behavior will result in account review and possible suspension.",
              },
              {
                title: "Intellectual Property Rights",
                content:
                  "All content, materials, and trademarks on LearniLM World are the property of LearniLM🌍World World or its partners. Unauthorized use or redistribution of our materials is prohibited.",
              },
              {
                title: "Limitation of Liability",
                content:
                  "LearniLM World is not liable for indirect or consequential losses resulting from misuse of the platform. Our services are provided 'as is' without warranty beyond legal requirements.",
              },
              {
                title: "Privacy & Data Usage",
                content:
                  "We respect your privacy. User data is collected only to enhance learning experiences and improve platform functionality. We do not sell or misuse personal data.",
              },
              {
                title: "Dispute Resolution & Governing Law",
                content:
                  "Any disputes will be resolved amicably through discussion. If unresolved, they shall be governed by applicable Indian law and jurisdiction.",
              },
            ].map((term, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 rounded-2xl p-5 cursor-pointer hover:bg-white/100 transition"
              >
                <summary className="text-xl font-semibold text-[#2D274B]">
                  {term.title}
                </summary>
                <p className="mt-3 text-[#2D274B] leading-relaxed text-base">{term.content}</p>
              </motion.details>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="mt-12 text-white text-base font-medium max-w-3xl mx-auto">
            These terms are periodically updated to reflect new features or legal requirements.
            For queries, contact us at{" "}
            <span className="font-semibold text-[#2D274B]">legal@learnilmworld.com</span>.
          </p>
        </div>
      </section>


      {/* Footer - expanded */}
      <Footer />

    </div>
  )
}
