import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { chatTranslations } from './chatTranslations';


interface Message {
  role: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

interface UserData {
  name: string;
  phone: string;
  email: string;
  role: 'Student' | 'Trainer';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'sa', name: 'Sanskrit', flag: '🇮🇳' }
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasProvidedData, setHasProvidedData] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const t = chatTranslations[selectedLanguage] || chatTranslations.en;
  const [formData, setFormData] = useState<UserData>({
    name: '',
    phone: '',
    email: '',
    role: 'Student'
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start chat automatically when modal opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      // Don't start chat immediately - show form first
      setShowForm(true);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    // 1. START CHAT SESSION (NO USER DATA YET)
    const startRes = await axios.post(
      `${API_BASE_URL}/api/chatbot/start`,
      { language: selectedLanguage },
      { timeout: 60000 }
    );

    const newSessionId = startRes.data.sessionId;
    setSessionId(newSessionId);

    // 2. SAVE USER DATA INTO MONGO USING SESSION ID
    await axios.post(
      `${API_BASE_URL}/api/chatbot/save-user`,
      {
        sessionId: newSessionId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: formData.role.toLowerCase()
      },
      { timeout: 60000 }
    );

    //  3. LOAD CONVERSATION FROM DB
    setMessages(startRes.data.conversation);
    setHasProvidedData(true);
    setShowForm(false);

  } catch (error) {
    const welcomeMessage = `🎉 ${t.welcome}\n\n${t.intro}\n\n• ${t.points.join('\n• ')}\n\n💡 ${t.question}`;

    setMessages([{
      role: 'assistant',
      message: welcomeMessage,
      timestamp: new Date()
      }]);
  } finally {
    setIsLoading(false);
  }
};


  const handleFormChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Add user message immediately
    const newUserMessage: Message = {
      role: 'user',
      message: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, 
        {
          sessionId,
          message: userMessage,
          language: selectedLanguage
        },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 60000 
        }
      );

      setMessages(response.data.conversation);
      setHasProvidedData(!response.data.needsData);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error message if backend fails
      const errorMessage: Message = {
        role: 'assistant',
        message: "I apologize, but I'm having trouble connecting to the service. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = t.quickReplies;

  const resetChat = () => {
    setSessionId(null);
    setMessages([]);
    setHasProvidedData(false);
    setShowForm(true);
    setFormData({
      name: '',
      phone: '',
      email: '',
      role: 'Student'
    });
    setFormErrors({});
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset chat when closing
    setTimeout(resetChat, 300);
  };

  

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 Ask LEARNilM
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-header">
            <h3>Ask LEARNilM</h3>
            <div className="chatbot-controls">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-select"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <button onClick={handleClose}>✕</button>
            </div>
          </div>

          <div className="chatbot-body">
            {/* User Information Form */}
            {showForm && (
              <div className="user-form-container">
                <div className="form-header">
                  <h4>Get Started with LearnILmWorld</h4>
                  <p>Please provide your details to begin</p>
                </div>

                <form onSubmit={handleFormSubmit} className="user-form">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className={formErrors.name ? 'error' : ''}
                    />
                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className={formErrors.phone ? 'error' : ''}
                    />
                    {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>You are joining as *</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="role"
                          value="Student"
                          checked={formData.role === 'Student'}
                          onChange={(e) => handleFormChange('role', e.target.value)}
                        />
                        <span className="radio-label">Student</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="role"
                          value="Trainer"
                          checked={formData.role === 'Trainer'}
                          onChange={(e) => handleFormChange('role', e.target.value)}
                        />
                        <span className="radio-label">Trainer</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Starting Chat...' : 'Start Chatting →'}
                  </button>
                </form>
              </div>
            )}

            {/* Chat Interface */}
            {!showForm && sessionId && (
              <>
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${message.role}`}
                    >
                      <div className="message-content">
                        {message.message.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < message.message.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="message assistant">
                      <div className="message-content typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                <div className="suggested-questions">
                  {suggestedQuestions.map((question: string, index: number) => (
                      <button
                      key={index}
                      className="suggestion-chip"
                      onClick={() => setInputMessage(question)}
                        >
                    {question}
                      </button>
                    ))
                  }
                </div>

                {/* Input Area */}
                <div className="input-section">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.placeholder}
                    disabled={isLoading}
                    rows={2}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    {isLoading ? '...' : 'Send'}
                  </button>
                </div>
              </>
            )}

            {/* Loading state when starting chat */}
            {!sessionId && isLoading && (
              <div className="loading-state">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Starting chat...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;