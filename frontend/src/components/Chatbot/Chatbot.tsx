import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

interface Message {
  role: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'sa', name: 'Sanskrit', flag: '🇮🇳' }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [needsRole, setNeedsRole] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start chat automatically when modal opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      startNewChat();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChat = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/start`, 
        { language: selectedLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSessionId(response.data.sessionId);
      setMessages(response.data.conversation);
      setNeedsRole(response.data.needsRole || false);
    } catch (error) {
      console.error('Failed to start chat:', error);
      // If backend not working, show demo mode
      setSessionId('demo_session');
      setMessages([{
        role: 'assistant',
        message: 'Welcome! Are you a student or trainer?',
        timestamp: new Date()
      }]);
      setNeedsRole(true);
    } finally {
      setIsLoading(false);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // const aiMessage: Message = {
      //   role: 'assistant',
      //   message: response.data.response,
      //   timestamp: new Date()
      // };
      setMessages(response.data.conversation);
      setNeedsRole(response.data.needsRole || false);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Demo responses if backend fails
      const demoResponses: {[key: string]: string} = {
        'student': 'Great! I can help with subjects, mentors, and learning.',
        'trainer': 'Awesome! I can help with students and teaching.',
        'language': 'We teach: English, German, French, Japanese, Spanish, Sanskrit.',
        'subject': 'We offer: Languages, Sciences, Math, History, Geography, Economics, CS.',
        'mentor': 'Certified experts in all subjects. View profiles on our platform.',
        'certif': 'Yes! Get certificates after course completion.',
      };
      
      let response = "I can help with subjects, mentors, and learning questions!";
      for (const [key, value] of Object.entries(demoResponses)) {
        if (userMessage.toLowerCase().includes(key)) {
          response = value;
          break;
        }
      }
      
      const aiMessage: Message = {
        role: 'assistant',
        message: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
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

  const suggestedQuestions = [
    "What subjects do you teach?",
    "Tell me about mentors",
    "Do you provide certificates?",
    "What equipment do I need?",
    "How are classes structured?"
  ];

  // Reset chat when closing
  const handleClose = () => {
    setIsOpen(false);
    // Optionally reset the chat state when closing
    // setSessionId(null);
    // setMessages([]);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 Ask iLM
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-header">
            <h3>Ask iLM</h3>
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
            {/* Messages */}
            {sessionId && (
              <>
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${message.role}`}
                    >
                      <div className="message-content">
                        {message.message}
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
                {!needsRole && (
                  <div className="suggested-questions">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="suggestion-chip"
                        onClick={() => setInputMessage(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="input-section">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={needsRole ? "Type 'student' or 'trainer'..." : "Ask me anything..."}
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