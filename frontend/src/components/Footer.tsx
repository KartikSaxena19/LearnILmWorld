// src/components/Footer.jsx
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import logo from '../assets/LearnilmworldLogo.jpg'

const Footer = () => (
  //   {/* Footer - expanded */}
  <footer className="bg-[#6b48af] text-white py-12">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
      <div>
        <div className="font-semibold text-lg">LearniLM🌎World</div>
        {/* {new Date().getFullYear()} */}
        <div className="text-sm text-slate-300 mt-2">© 2025 LearniLM🌎World — All rights reserved</div>
        <div className="mt-4 text-sm text-slate-300">Email: support@learnilmworld.com</div>
        <div className="text-sm text-slate-300">Phone: +91 81002 61773</div>
      </div>

      <div>
        <div className="font-semibold">Company</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li><Link to="/about#about" className="hover:underline">About</Link></li>
          <li><Link to="/about#careers" className="hover:underline">Careers</Link></li>
          <li><Link to="/about#blog" className="hover:underline">Blog</Link></li>
        </ul>
      </div>

      <div>
        <div className="font-semibold">Resources</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li><Link to="/about#help" className="hover:underline">Help Center</Link></li>
          <li><Link to="/about#terms" className="hover:underline">Terms</Link></li>
          <li><Link to="/about#privacy" className="hover:underline">Policy & Refund</Link></li>
        </ul>
      </div>

      <div>
        <div className="font-semibold">Stay in touch</div>
        <div className="mt-4 flex items-center gap-3 text-slate-300">
          <a href="#" aria-label="Facebook"><Facebook /></a>
          <a href="https://x.com/bishnuffw?s=21" aria-label="Twitter"><Twitter /></a>
          <a href="https://www.instagram.com/learnilmworld?igsh=MXczNnFrdHJ5Nm1vZg%3D%3D&utm_source=qr" aria-label="Instagram"><Instagram /></a>
          <a href="https://www.linkedin.com/company/learn-ilm-world/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
        </div>
        <div className='Logo'>
          <img src={logo} width={'150px'} />
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 mt-8 border-t border-white/10 pt-6 text-lg flex flex-col sm:flex-row justify-between font-semibold">
      <div>Helping learners grow, emotionally and intellectually.</div>
      <div className="mt-3 sm:mt-0">Version 2.0 • Privacy policy</div>
    </div>
  </footer>
)

export default Footer
