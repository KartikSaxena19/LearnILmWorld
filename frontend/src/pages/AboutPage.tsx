import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  HelpCircle, FileText, BookOpen, Briefcase
} from "lucide-react"
// Facebook, Twitter, Instagram, Linkedin, removed ffrom above
// import logo from "../assets/LearnilmworldLogo.jpg";
import bg_img from '../assets/purple_gradient.jpg'
import about_us from '../assets/About_us1.png';
import our_story from '../assets/our_story.png';
import careers_img from '../assets/careers_img.png';
import { Nav, Container, Offcanvas, Button } from "react-bootstrap"
//  Navbar,  removed from above react-bootstrap
import Footer from "../components/Footer";
import CareerApplicationForm from "../components/CareerApplicationForm"

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

  const [feedbackStatus, setFeedbackStatus] = useState<String | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [showCareerForm, setShowCareerForm] = useState(false)



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
    <div className="min-h-screen font-inter bg-fixed text-[#e0fa84] scroll-smooth"
      style={{
        backgroundImage:
          `url(${bg_img})`,
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}>
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#6b48af]/95 backdrop-blur-sm border-b border-white/30 text-[#e0fa84]">
        <Container className="py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <div className="text-2xl md:text-3xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center">
                <span className="text-[#e0fa84]">
                  LearniLM</span>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="inline-block mx-1 text-3xl"
                >
                  🌎
                </motion.span>
                <span className="text-[#e0fa84]">
                  World</span>
                {/* <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-full blur-xl pointer-events-none"
                  animate={{ x: [-200, 200] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  /> */}
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex text-gray-50 items-center gap-6">
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
      {/* bg-[#dc8d33] */}
      <section id="about" className="pt-24 pb-28 ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* MAIN HEADING (Centered above both sides) */}
          <h1 className="text-5xl md:text-5xl font-serif font-extrabold text-[#e0fa84] text-center mb-14">
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
              <h2 className="text-3xl md:text-4xl text-center font-serif font-bold text-[#e0fa84] mb-6">
                Empowering Learners Everywhere
              </h2>


              <p className="text-2xl text-[#2D274B] font-bold leading-relaxed max-w-xl">
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
      {/* e0fa84 bg-gradient-to-b from-[#2D274B] to-[#1E1A3A] */}
      <section className="py-24 px-6  ">
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
            <p className="text-lg max-w-3xl mx-auto text-[#2D274B] mb-8 leading-relaxed">
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
                <p className="text-[#2D274B]">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* OUR STORY */}
      {/*e0fa84  bg-gradient-to-b from-[#dc8d33] to-[#f3b765] text-[#2D274B]  */}
      <section className="py-24overflow-hidden">
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
              <p className="text-lg text-[#2D274B] font-semibold leading-relaxed mb-4">
                What started as a simple idea — to make learning truly personal — evolved into a global
                movement connecting passionate trainers and eager learners across the world.
              </p>
              <p className="text-lg text-[#2D274B] font-semibold leading-relaxed">
                Through dedication, creativity, and a belief that knowledge should have no limits,
                <span className="text-[#e0fa84] font-bold"> LearniLM🌎World </span>
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
            <p className="italic text-white text-3xl font-bold max-w-3xl mx-auto">
              “Every learner has a story. Ours is about making each one count.”
            </p>
          </motion.div>
        </div>
      </section>


      {/* CAREERS */}
      {/* e0fa84 CBE56A*/}
      <section id="careers" className="py-24 px-6 text-[2D274B]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Briefcase size={40} className="mx-auto mb-4 text-[#CBE56A]" />
          </motion.div>

          <h2 className="text-4xl font-serif font-bold text-[#e0fa84]">Careers at LearniLM🌎World</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-[#2D274B]">
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
                <h4 className="text-xl font-bold text-[#2D274B]">{benefit}</h4>
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
              <h3 className="text-3xl font-semibold mb-6 text-[#CBE56A]">
                Open Roles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#2D274B]">

                {/* India */}
                <div>
                  <h4 className="font-bold mb-3 text-2xl">India</h4>
                  <ul className="space-y-2 text-xl font-semibold">
                    <li>• Sales Intern</li>
                    <li>• Digital Marketing Intern</li>
                    <li>• UX / UI Designer Intern</li>
                    <li>• HR Intern</li>
                  </ul>
                </div>

                {/* International */}
                <div>
                  <h4 className="font-bold mb-3 text-2xl">🌍 International</h4>
                  <ul className="space-y-2 text-xl font-semibold">
                    <li>• Sales Intern – Bahrain</li>
                    <li>• Sales Intern – Kuwait</li>
                    <li>• Sales Intern – Oman</li>
                    <li>• Sales Intern – Jordan</li>
                    <li>• Sales Intern – Azerbaijan</li>
                    <li>• Sales Intern – Belarus</li>
                  </ul>
                </div>

              </div>

              <button
                onClick={() => setShowCareerForm(true)}
                className="mt-8 inline-block px-6 py-3 bg-[#CBE56A] text-[#2D274B] font-bold rounded-full hover:scale-105 transition"
              >
                Apply Now →
              </button>
            </motion.div>

          </div>
        </div>
        {showCareerForm && (
          <CareerApplicationForm onClose={() => setShowCareerForm(false)} />
        )}


      </section>

      {/* POLICY & REFUND */}
      {/* e0fa84 CBE56A 2D274B */}
      <section id="policy-refund" className="py-24 px-6 text-[#e0fa84]">
        <div className="max-w-6xl mx-auto text-center">
          <FileText size={40} className="mx-auto mb-4 text-[#CBE56A]" />

          <h2 className="text-4xl font-serif font-bold">
            Policy & Refund
          </h2>

          <p className="mt-4 text-lg text-[#2D274B] font-semibold max-w-3xl mx-auto">
            We believe in transparency and fairness. Our policies are designed to protect learners,
            trainers, and ensure a smooth learning experience for everyone on LearniLM🌎World.
          </p>

          {/* POLICY CARDS */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 text-left">
            {[
              {
                title: "Payment Policy",
                content:
                  "All payments on LearniLM🌎World are processed securely through trusted payment partners. Once a session is successfully booked, you will receive a confirmation via email or dashboard notification.",
              },
              {
                title: "Refund Eligibility",
                content:
                  "Refunds are applicable if a session is cancelled within the allowed time window or if a trainer fails to attend a scheduled session. Eligible refunds are processed back to the original payment method.",
              },
              {
                title: "Cancellations & Rescheduling",
                content:
                  "Learners can cancel or reschedule sessions from their dashboard as per the platform’s cancellation policy. Late cancellations may not qualify for a refund.",
              },
              {
                title: "Trainer No-Show Policy",
                content:
                  "If a trainer does not join a confirmed session without prior notice, learners are entitled to a full refund or a free reschedule, based on preference.",
              },
              {
                title: "Non-Refundable Cases",
                content:
                  "Refunds are not applicable for completed sessions, partial attendance, or misuse of the platform. Any suspicious activity may lead to account review.",
              },
              {
                title: "Support & Resolution",
                content:
                  "If you face any issues related to payments or refunds, our support team is here to help. We aim to resolve all refund-related queries within a reasonable timeframe.",
              },
            ].map((policy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 rounded-2xl p-6 shadow hover:scale-105 transition backdrop-blur-md"
              >
                <h3 className="text-xl font-bold text-[#CBE56A] mb-2">
                  {policy.title}
                </h3>
                <p className="text-[#2D274B] leading-relaxed">
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CLOSING NOTE */}
          <p className="mt-16 text-[#2D274B] text-base font-medium max-w-3xl mx-auto">
            For detailed refund requests or payment-related concerns, please contact us at{" "}
            <span className="font-semibold text-[#CBE56A]">
              support@learnilmworld.com
            </span>.
            We’re committed to making your learning experience safe, fair, and reliable.
          </p>
        </div>
      </section>


      {/* BLOG / INSIGHTS */}
      {/* 2D274B CBE56A e0fa84 */}
      <section id="blog" className="py-24 px-6  text-[#e0fa84]">
        <div className="max-w-7xl mx-auto text-center">
          <BookOpen size={40} className="mx-auto mb-4 text-[#CBE56A]" />
          <h2 className="text-4xl font-serif font-bold">From the LearniLM🌎World Desk</h2>
          <p className="mt-5 text-lg text-[#2D274B] font-semibold max-w-3xl mx-auto">
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
                  <h3 className="text-2xl font-semibold mb-3 text-[#e0fa84]">{post.title}</h3>
                  <p className="text-[#2D274B]/90 mb-4">{post.excerpt}</p>
                  <p className="text-sm font-semibold text-[#e0fa84]">#LearnWithPurpose</p>
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
      {/* bg-[#2D274B] e0fa84 */}
      <section id="help" className="py-24 px-6  text-[#2D274B]">
        <div className="max-w-5xl mx-auto text-center">
          <HelpCircle size={40} className="mx-auto mb-4 text-[#CBE56A]" />
          <h2 className="text-4xl font-serif font-bold text-[#e0fa84]">Help Centre</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-[#2D274B]">
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
                <summary className="text-xl font-semibold text-[#2D274B]">
                  {faq.q}
                </summary>
                <p className="mt-3 text-[#2D274B] text-base leading-relaxed">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>

          {/* Contact Help Line + Feedback Form */}
          <div className="mt-12 text-center">
            <p className="text-lg text-[#2D274B] font-medium">
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

            {/* Feedback Form */}
            {showFeedback && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gray-100 text-[#2D274B] rounded-3xl p-8 w-[90%] max-w-lg relative"
                >
                  {/* Close */}
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="absolute top-4 right-4 text-3xl font-bold text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>

                  <h3 className="text-3xl font-bold mb-6 text-center">
                    We Value Your Feedback 🌟
                  </h3>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={feedbackData.name}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Your Email"
                      value={feedbackData.email}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
                      required
                    />

                    <select
                      value={feedbackData.category}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
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
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
                      required
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#CBE56A] text-[#2D274B] font-bold py-3 rounded-xl hover:scale-105 transition"
                    >
                      Submit Feedback
                    </button>
                  </form>

                  {feedbackStatus === "success" && (
                    <p className="text-green-600 mt-4 text-center font-semibold">
                      ✅ Thank you! Your feedback has been submitted.
                    </p>
                  )}

                  {feedbackStatus === "error" && (
                    <p className="text-red-500 mt-4 text-center font-semibold">
                      ❌ Failed to send feedback. Please try again.
                    </p>
                  )}
                </motion.div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* TERMS & CONDITIONS */}
      {/* CBE56A 2D274B e0fa84*/}
      <section id="terms" className="py-24 px-6  text-[#e0fa84]">
        <div className="max-w-6xl mx-auto text-center">
          <FileText size={40} className="mx-auto mb-4 text-[#CBE56A]" />
          <h2 className="text-4xl font-serif font-bold">Terms & Conditions</h2>
          <p className="mt-4 text-lg text-[#2D274B] font-semibold max-w-3xl mx-auto">
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
          <p className="mt-12 text-[#2D274B] text-base font-medium max-w-3xl mx-auto">
            These terms are periodically updated to reflect new features or legal requirements.
            For queries, contact us at{" "}
            <span className="font-semibold text-[#e0fa84]">legal@learnilmworld.com</span>.
          </p>
        </div>
      </section>

      {/* Footer - expanded */}
      <Footer />
    </div>
  )
}
