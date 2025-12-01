import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import Chatbot from '../models/Chatbot.js';


const router = express.Router();

// ================================
// KNOWLEDGE BASE LOADING
// ================================
let scrapedData = [];

try {
  scrapedData = JSON.parse(fs.readFileSync('full_site_data.json', 'utf8'));
} catch (error) {
  scrapedData = [];
}

// ================================
// RANDOM TEXT DETECTION (FIXED - MORE STRICT)
// ================================
const RandomTextDetector = {
  // Check if text is random/nonsense - STRICTER VERSION
  //  removed arrrow function cause we are using "this" keyword
  isRandomText(text) {
    if (!text || text.trim().length === 0) return false;

    const cleanedText = text.trim().toLowerCase();

    // Too short to be meaningful
    if (cleanedText.length < 3) return false;

    // FIRST: Check if it's clearly a legitimate query (QUICK CHECK)
    const quickLegitimatePatterns = [
      // Contains spaces (usually indicates real text)
      /\s/,
      // Contains common punctuation
      /[.,!?]/,
      // Contains numbers in context (not just numbers)
      /\d+[a-z]/i,
      /[a-z]+\d+/i,
      // Common educational words
      /(son|daughter|child|student|learn|study|teach|tutor|teacher|class|course|subject|history|math|science|english)/i,
      // Question words
      /(what|who|when|where|why|how|can|could|would|will)/i
    ];

    // If it matches any quick legitimate pattern, it's NOT random
    if (quickLegitimatePatterns.some(pattern => pattern.test(cleanedText))) {
      return false;
    }

    // NOW: Check for CLEAR nonsense patterns (STRICTER)
    const clearNonsensePatterns = [
      // Repeated characters (aaaa, bbbb, etc.)
      /^(.)\1{3,}$/,
      // Keyboard mashing patterns
      /^[asdfghjkl]{4,}$/i,
      /^[qwertyuiop]{4,}$/i,
      /^[zxcvbnm]{4,}$/i,
      // Mixed keyboard rows (qwerty, asdfgh, etc.)
      /^[qwertasdfgzxcv]{5,}$/i,
      // Only consonants with no meaning
      /^[bcdfghjklmnpqrstvwxyz]{6,}$/i,
      // Only vowels with no meaning
      /^[aeiou]{5,}$/i,
      // No vowels at all (except y)
      /^[bcdfghjklmnpqrstvwxz]{6,}$/i,
      // Laughter patterns
      /^(ha|he|ah|oh|ho|hi|hu){4,}/i,
      /^a+h+a+h+a+/i,
      /^h+a+h+a+h+/i,
      // Very specific nonsense patterns we've seen
      /fyxgnaxsgykids/i,
      /htyckigh/i,
      /aeihpfnc/i,
      /svdgcfrvs/i,
      // Excessive repetition of patterns
      /^([a-z]{2,3})\1{3,}$/i,
      // Mixed random capitals and lowercase with no spaces
      /^[a-zA-Z]{8,}$/,
      // Contains too many consonants in a row
      /[bcdfghjklmnpqrstvwxyz]{5,}/i
    ];

    // Check if it matches CLEAR nonsense patterns
    if (clearNonsensePatterns.some(pattern => pattern.test(cleanedText))) {
      console.log('🔴 Detected random text:', cleanedText);
      return true;
    }

    // Check for excessive repetition
    if (this.hasExcessiveRepetition(cleanedText)) {
      console.log('🔴 Detected excessive repetition:', cleanedText);
      return true;
    }

    // Check if it has real words
    const hasRealWords = this.hasRealWords(cleanedText);
    if (!hasRealWords && cleanedText.length > 6) {
      console.log('🔴 No real words detected:', cleanedText);
      return true;
    }

    // If it passed all checks, it's probably not random
    console.log('✅ Allowing text as legitimate:', cleanedText);
    return false;
  },

  // Check for excessive character repetition
  hasExcessiveRepetition: (text) => {
    if (text.length < 6) return false;

    // Check if more than 60% of characters are the same
    const charCount = {};
    for (let char of text) {
      charCount[char] = (charCount[char] || 0) + 1;
    }

    const maxCount = Math.max(...Object.values(charCount));
    const repetitionRatio = maxCount / text.length;

    return repetitionRatio > 0.6;
  },

  // Check if text contains real English words (MORE STRICT)
  hasRealWords: (text) => {
    const commonWords = [
      // Very common words
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
      'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
      'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
      'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',

      // Common conversational words
      'hello', 'hi', 'thanks', 'thank', 'please', 'help', 'need', 'want', 'find', 'book',
      'yes', 'no', 'ok', 'okay', 'maybe', 'probably', 'actually', 'really', 'very',

      // LearnILmWorld specific
      'trainer', 'mentor', 'teacher', 'class', 'lesson', 'course', 'certificate',
      'schedule', 'price', 'cost', 'equipment', 'laptop', 'computer', 'learn',

      // Educational terms
      'son', 'daughter', 'child', 'kid', 'student', 'study', 'learn', 'teach',
      'history', 'math', 'science', 'english', 'language', 'programming', 'coding',
      'grade', 'subject', 'homework', 'assignment', 'project', 'exam', 'test',
      'age', 'year', 'old', 'years', 'children', 'tutor'
    ];

    const words = text.toLowerCase().split(/\s+/);

    // If there are multiple words, check if any are real
    if (words.length > 1) {
      return words.some(word => commonWords.includes(word));
    }

    // For single "words", be more strict
    const singleWord = words[0];

    // Check if it's a common word
    if (commonWords.includes(singleWord)) {
      return true;
    }

    // Check if it looks like a real word (has vowels and consonants mixed)
    const hasVowels = /[aeiou]/i.test(singleWord);
    const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/i.test(singleWord);
    const reasonableLength = singleWord.length <= 12;

    return hasVowels && hasConsonants && reasonableLength;
  },

  getConfusedResponse: (language = 'en') => {
    const responses = {
      en: "I'm sorry, I didn't quite understand that. Could you please rephrase your question or ask about LearnILmWorld services? I can help you with finding trainers, certificates, class schedules, and more!",
      hi: "मुझे खेद है, मैं इसे पूरी तरह से नहीं समझ पाया। क्या आप कृपया अपना प्रश्न दोबारा बता सकते हैं या LearnILmWorld सेवाओं के बारे में पूछ सकते हैं? मैं आपकी प्रशिक्षकों को ढूंढने, प्रमाणपत्रों, कक्षा अनुसूची और बहुत कुछ में मदद कर सकता हूं!",
      fr: "Je suis désolé, je n'ai pas bien compris cela. Pourriez-vous reformuler votre question ou poser des questions sur les services LearnILmWorld ? Je peux vous aider à trouver des formateurs, des certificats, des horaires de cours et bien plus encore !",
      es: "Lo siento, no entendí eso completamente. ¿Podría reformular su pregunta o preguntar sobre los servicios de LearnILmWorld? ¡Puedo ayudarle a encontrar entrenadores, certificados, horarios de clases y mucho más!",
      de: "Es tut mir leid, das habe ich nicht ganz verstanden. Könnten Sie Ihre Frage bitte umformulieren oder nach LearnILmWorld-Diensten fragen? Ich kann Ihnen bei der Suche nach Trainern, Zertifikaten, Stundenplänen und mehr helfen!",
      ja: "申し訳ありませんが、よく理解できませんでした。質問を言い換えていただくか、LearnILmWorldのサービスについてお聞きいただけますか？トレーナーの検索、証明書、クラススケジュールなどについてお手伝いできます！",
      sa: "क्षम्यताम्, अहं तत् सम्यक् न अवगच्छम्। कृपया भवतः प्रश्नं पुनः कथयतु वा LearnILmWorld सेवासु पृच्छतु? अहं भवते प्रशिक्षकान् अन्वेष्टुं, प्रमाणपत्राणि, कक्षासूचीं च साहाय्यं करितुं शक्नोमि!"
    };
    return responses[language] || responses.en;
  }
};

// ================================
// CONVERSATION MEMORY SYSTEM
// ================================
class ConversationMemory {
  constructor() {
    this.sessions = new Map();
    this.maxHistoryLength = 10;
  }

  getSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        conversationHistory: [],
        context: {},
        createdAt: new Date(),
        lastActivity: new Date()
      });
    }
    return this.sessions.get(sessionId);
  }

  addMessage(sessionId, role, message) {
    const session = this.getSession(sessionId);
    const messageObj = {
      role,
      message,
      timestamp: new Date()
    };

    session.conversationHistory.push(messageObj);
    session.lastActivity = new Date();

    if (session.conversationHistory.length > this.maxHistoryLength) {
      session.conversationHistory = session.conversationHistory.slice(-this.maxHistoryLength);
    }

    this.updateContext(sessionId);

    return session;
  }

  updateContext(sessionId) {
    const session = this.getSession(sessionId);
    const history = session.conversationHistory;

    const context = {
      mentionedTopics: this.extractTopics(history),
      userInterests: this.extractInterests(history),
      previousQuestions: this.extractQuestions(history),
      userPreferences: this.extractPreferences(history)
    };

    session.context = context;
  }

  extractTopics(history) {
    const topics = new Set();
    const topicKeywords = {
      'trainers': ['trainer', 'mentor', 'teacher', 'instructor', 'expert'],
      'certificates': ['certificate', 'certification', 'completion'],
      'equipment': ['equipment', 'laptop', 'computer', 'webcam', 'microphone'],
      'classes': ['class', 'lesson', 'session', 'schedule'],
      'booking': ['book', 'reserve', 'schedule', 'appointment'],
      'pricing': ['price', 'cost', 'fee', 'payment'],
      'subjects': ['subject', 'course', 'language', 'math', 'science', 'programming']
    };

    history.forEach(msg => {
      const message = msg.message.toLowerCase();
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => message.includes(keyword))) {
          topics.add(topic);
        }
      }
    });

    return Array.from(topics);
  }

  extractInterests(history) {
    const interests = new Set();
    const userMessages = history.filter(msg => msg.role === 'user');

    userMessages.forEach(msg => {
      const message = msg.message.toLowerCase();
      if (message.includes('learn') || message.includes('study') || message.includes('interested')) {
        if (message.includes('language')) interests.add('languages');
        if (message.includes('math')) interests.add('math');
        if (message.includes('science')) interests.add('science');
        if (message.includes('programming') || message.includes('coding')) interests.add('programming');
      }
    });

    return Array.from(interests);
  }

  extractQuestions(history) {
    return history
      .filter(msg => msg.role === 'user' && (msg.message.includes('?') || msg.message.includes('how') || msg.message.includes('what')))
      .map(msg => msg.message)
      .slice(-3);
  }

  extractPreferences(history) {
    const preferences = {};
    const userMessages = history.filter(msg => msg.role === 'user');

    userMessages.forEach(msg => {
      const message = msg.message.toLowerCase();
      if (message.includes('student') || message.includes('learn')) {
        preferences.role = 'student';
      }
      if (message.includes('trainer') || message.includes('teach')) {
        preferences.role = 'trainer';
      }
    });

    return preferences;
  }

  getConversationSummary(sessionId) {
    const session = this.getSession(sessionId);
    const context = session.context;

    let summary = "Previous conversation context:\n";

    if (context.mentionedTopics.length > 0) {
      summary += `- Discussed topics: ${context.mentionedTopics.join(', ')}\n`;
    }

    if (context.userInterests.length > 0) {
      summary += `- User interests: ${context.userInterests.join(', ')}\n`;
    }

    if (context.previousQuestions.length > 0) {
      summary += `- Recent questions: ${context.previousQuestions.join('; ')}\n`;
    }

    if (context.userPreferences.role) {
      summary += `- User is a: ${context.userPreferences.role}\n`;
    }

    return summary === "Previous conversation context:\n" ? "" : summary;
  }

  getRecentHistory(sessionId, maxMessages = 5) {
    const session = this.getSession(sessionId);
    return session.conversationHistory.slice(-maxMessages);
  }

  cleanupOldSessions(maxAgeHours = 24) {
    const now = new Date();
    const maxAge = maxAgeHours * 60 * 60 * 1000;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

const conversationMemory = new ConversationMemory();

// ================================
// FOLLOW-UP QUESTION GENERATOR
// ================================
const FollowUpQuestions = {
  generateFollowUp: (userQuestion, context, language = 'en') => {
    const question = userQuestion.toLowerCase();

    const followUpMap = {
      'en': {
        'trainer': [
          "Would you like me to help you find trainers for a specific subject?",
          "Are you interested in seeing trainer availability and pricing?",
          "Would you like to know more about the booking process?",
          "Do you want to learn about our trainer verification process?"
        ],
        'certificate': [
          "Would you like to know which courses offer certificates?",
          "Are you interested in the assessment process for certificates?",
          "Would you like information about certificate verification?",
          "Do you want to know how to access your certificates after completion?"
        ],
        'equipment': [
          "Would you like specific recommendations for webcams or microphones?",
          "Are you having technical issues with your current setup?",
          "Would you like to test your equipment before sessions?",
          "Do you need help with our mobile app installation?"
        ],
        'class': [
          "Would you like to see sample class schedules?",
          "Are you interested in our rescheduling policy?",
          "Would you like to know about learning materials provided?",
          "Do you want information about class duration and frequency?"
        ],
        'book': [
          "Would you like me to walk you through the booking process step by step?",
          "Are you looking to book a trial session first?",
          "Would you like information about our cancellation policy?",
          "Do you need help with payment methods?"
        ],
        'default': [
          "Is there anything specific you'd like to know more about?",
          "Would you like me to help you with anything else?",
          "Do you have any other questions about our services?",
          "Is there a particular area you'd like me to explain further?"
        ]
      },
      'hi': {
        'trainer': [
          "क्या आप किसी विशेष विषय के लिए प्रशिक्षक खोजने में मदद चाहते हैं?",
          "क्या आप प्रशिक्षक की उपलब्धता और मूल्य निर्धारण देखने में रुचि रखते हैं?",
          "क्या आप बुकिंग प्रक्रिया के बारे में और जानना चाहेंगे?",
          "क्या आप हमारी प्रशिक्षक सत्यापन प्रक्रिया के बारे में जानना चाहते हैं?"
        ],
        'default': [
          "क्या आप किसी विशेष चीज के बारे में और जानना चाहेंगे?",
          "क्या आप मुझे किसी और चीज में मदद चाहेंगे?",
          "क्या आपके पास हमारी सेवाओं के बारे में कोई अन्य प्रश्न हैं?",
          "क्या कोई विशेष क्षेत्र है जिसके बारे में आप मुझे और समझाना चाहेंगे?"
        ]
      }
    };

    const langQuestions = followUpMap[language] || followUpMap['en'];

    let mainTopic = 'default';

    if (question.includes('trainer') || question.includes('mentor') || question.includes('teacher')) {
      mainTopic = 'trainer';
    } else if (question.includes('certificate') || question.includes('certification')) {
      mainTopic = 'certificate';
    } else if (question.includes('equipment') || question.includes('laptop') || question.includes('webcam')) {
      mainTopic = 'equipment';
    } else if (question.includes('class') || question.includes('lesson') || question.includes('schedule')) {
      mainTopic = 'class';
    } else if (question.includes('book') || question.includes('reserve') || question.includes('get started')) {
      mainTopic = 'book';
    }

    const topicQuestions = langQuestions[mainTopic] || langQuestions['default'];
    const randomIndex = Math.floor(Math.random() * topicQuestions.length);
    return topicQuestions[randomIndex];
  },

  addFollowUpToResponse: (response, followUpQuestion) => {
    return `${response}\n\n💡 ${followUpQuestion}`;
  }
};

// ================================
// SMART SEARCH FUNCTION
// ================================
function searchScrapedData(query) {
  if (!scrapedData || scrapedData.length === 0) {
    return null;
  }

  query = query.toLowerCase();

  const keywordMap = {
    'mentor': ['mentor', 'trainer', 'teacher', 'instructor', 'expert', 'educator', 'tutor'],
    'certificate': ['certificate', 'certification', 'completion', 'assessment', 'credential'],
    'equipment': ['equipment', 'laptop', 'requirements', 'device', 'tools', 'need', 'require'],
    'class': ['class', 'lesson', 'session', 'schedule', 'structure', '1-on-1', 'virtual'],
    'book': ['book', 'schedule', 'reserve', 'how to', 'get started', 'choose', 'search', 'find']
  };

  let matches = [];

  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      const categoryMatches = scrapedData.filter(item => {
        const content = (item.content || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        const section = (item.section || '').toLowerCase();

        return keywords.some(keyword =>
          content.includes(keyword) ||
          title.includes(keyword) ||
          section.includes(keyword)
        );
      });
      matches.push(...categoryMatches);
    }
  }

  matches = matches.filter((item, index, self) =>
    index === self.findIndex(i => i.content === item.content)
  );

  return matches.slice(0, 5);
}

// ================================
// CLEAN ANSWER GENERATOR (IMPROVED)
// ================================
function generateStrictAnswer(question, websiteData, language) {
  if (!websiteData || websiteData.length === 0) {
    return null;
  }

  const q = question.toLowerCase();

  // PRIORITY 1: TUTOR/SUBJECT SPECIFIC QUERIES (highest priority)
  if ((q.includes('son') || q.includes('daughter') || q.includes('child') || q.includes('student') || q.includes('kid')) &&
    (q.includes('learn') || q.includes('study') || q.includes('teach') || q.includes('tutor') || q.includes('need') || q.includes('want'))) {

    // Extract subject from query
    const subjects = {
      'history': ['history', 'historical', 'past'],
      'math': ['math', 'mathematics', 'algebra', 'calculus'],
      'science': ['science', 'physics', 'chemistry', 'biology'],
      'english': ['english', 'language', 'grammar', 'writing'],
      'programming': ['programming', 'coding', 'computer', 'python', 'java']
    };

    let foundSubject = 'subject';
    for (const [subject, keywords] of Object.entries(subjects)) {
      if (keywords.some(keyword => q.includes(keyword))) {
        foundSubject = subject;
        break;
      }
    }

    // Extract grade if mentioned
    let grade = '';
    const gradeMatch = q.match(/(\d+)(st|nd|rd|th|)/);
    if (gradeMatch) {
      grade = `Grade ${gradeMatch[1]}`;
    } else if (q.includes('grade')) {
      grade = 'the specified grade';
    }

    return `🎯 Perfect! I can help you find a ${foundSubject} tutor for your ${grade || 'child'}!

🤝 Finding the Right ${foundSubject.charAt(0).toUpperCase() + foundSubject.slice(1)} Tutor:

• We have certified ${foundSubject} experts specializing in different grade levels
• Tutors can make ${foundSubject} engaging with interactive sessions
• Personalized lesson plans based on your child's learning style
• Flexible scheduling to fit school routines

🔍 How to Find ${foundSubject.charAt(0).toUpperCase() + foundSubject.slice(1)} Tutors:
1. Visit our "Browse Mentors" section
2. Filter by "Subject: ${foundSubject.charAt(0).toUpperCase() + foundSubject.slice(1)}" 
3. Select appropriate grade level
4. Review tutor profiles, videos, and student ratings
5. Book a trial session to find the perfect match

Would you like me to help you search for ${foundSubject} tutors specifically?`;
  }

  // PRIORITY 2: SUBJECT-SPECIFIC TUTOR SEARCH
  if ((q.includes('learn') || q.includes('study') || q.includes('need') || q.includes('want') || q.includes('looking')) &&
    (q.includes('history') || q.includes('math') || q.includes('science') || q.includes('english') || q.includes('programming'))) {

    let subject = 'the subject';
    if (q.includes('history')) subject = 'history';
    else if (q.includes('math')) subject = 'mathematics';
    else if (q.includes('science')) subject = 'science';
    else if (q.includes('english')) subject = 'English';
    else if (q.includes('programming')) subject = 'programming';

    return `🔍 Great! Looking for ${subject} tutors?

We have expert ${subject} tutors available for all grade levels:

• Certified ${subject} educators
• Interactive learning sessions
• Customized lesson plans
• Flexible scheduling

To find ${subject} tutors:
1. Browse our mentor database
2. Filter by "${subject}" subject
3. Check qualifications and reviews
4. Schedule a trial session

Would you like to see available ${subject} tutors?`;
  }

  // PRIORITY 3: GENERAL TUTOR SEARCH
  if (q.includes('search') || q.includes('find') || q.includes('where') || q.includes('look for') || q.includes('trainer') || q.includes('mentor') || q.includes('tutor')) {
    const searchData = websiteData.filter(item =>
      (item.content || '').toLowerCase().includes('search') ||
      (item.content || '').toLowerCase().includes('find') ||
      (item.content || '').toLowerCase().includes('filter') ||
      (item.content || '').toLowerCase().includes('browse') ||
      (item.section || '').toLowerCase().includes('faq')
    );

    if (searchData.length > 0) {
      return `To search for trainers on LearnILmWorld:

🔍 How to Find Trainers:
• Use the "Browse our Mentors" section on the website
• Apply filters like experience, ratings, and pricing
• Watch trainer video introductions
• Read student reviews and ratings

You can find and filter through our expert trainers to find the perfect match for your learning needs!`;
    }
  }

  // PRIORITY 4: MENTORS/TRAINERS GENERAL INFO
  if (q.includes('mentor') || q.includes('trainer') || q.includes('teacher') || q.includes('tutor')) {
    return `🤝 Our Mentors & Trainers:

At LearnILmWorld, we connect you with certified expert trainers from around the world for personalized 1-on-1 sessions.

Features:
• Certified experts in languages, sciences, math, and computer science
• Global community of passionate educators  
• Flexible scheduling with trainers worldwide
• Video introductions and student reviews
• Filter by subject, experience, and availability

Browse our mentor profiles to find your perfect learning partner!`;
  }

  // PRIORITY 5: CERTIFICATES
  if (q.includes('certificate') || q.includes('certification')) {
    return `🏆 Certificates:

Yes! LearnILmWorld provides completion certificates for our courses.

Certificate Details:
• Issued after completing courses and passing required assessments
• Downloadable digital certificates
• Shareable to showcase your new skills
• Proof of course completion and skill acquisition

Complete your course to receive your certificate!`;
  }

  // PRIORITY 8: EQUIPMENT (only if specifically asked and no tutor context)
  if ((q.includes('equipment') || q.includes('laptop') || q.includes('computer') || q.includes('webcam') || q.includes('microphone')) &&
    !q.includes('tutor') && !q.includes('teacher') && !q.includes('mentor') && !q.includes('learn') && !q.includes('study')) {
    return `💻 Equipment Needed:

For LearnILmWorld sessions, you'll need basic equipment:

• Laptop or computer with internet connection
• Webcam and microphone for interactive sessions
• Our platform works great on mobile devices too
• Progressive Web App (PWA) available

No special equipment required!`;
  }

  // PRIORITY 7: CLASS STRUCTURE
  if (q.includes('class') || q.includes('lesson') || q.includes('structure') || q.includes('schedule')) {
    return `📚 Class Structure:

LearnILmWorld offers personalized learning experiences:

• 1-on-1 sessions with expert trainers
• Flexible scheduling to fit your availability
• Interactive virtual classrooms
• Reschedule up to 24 hours before sessions
• Learning materials provided by trainers

Schedule sessions at your convenience!`;
  }

  // PRIORITY 8: BOOKING
  if (q.includes('book') || q.includes('how to') || q.includes('get started')) {
    return `🎯 How to Get Started:

Booking sessions on LearnILmWorld is easy:

1. Browse - Look through our trainer profiles
2. Filter - Use experience, rating, and price filters
3. Review - Watch videos and read student reviews
4. Message - Send a short message to potential trainers
5. Schedule - Book sessions based on mutual availability
6. Learn - Join interactive 1-on-1 sessions

Start by browsing our mentor community today!`;
  }

  return null;
}

// =====================================
// GEMINI SERVICE WITH RANDOM TEXT DETECTION
// =====================================
const GeminiService = {
  generateResponse: async (message, sessionId, language = 'en', history) => {
    const API_KEY = process.env.GOOGLE_API_KEY;

    // console.log("Gemini called with:", message, sessionId, history);


    // First check if it's random text
    if (RandomTextDetector.isRandomText(message)) {
      const confusedResponse = RandomTextDetector.getConfusedResponse(language);
      return {
        success: true,
        response: confusedResponse,
        source: 'random_text_detection'
      };
    }

    if (!API_KEY) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const websiteData = searchScrapedData(message);
      const manualAnswer = generateStrictAnswer(message, websiteData, language);

      if (manualAnswer) {
        const session = conversationMemory.getSession(sessionId);
        const followUpQuestion = FollowUpQuestions.generateFollowUp(message, session.context, language);
        const responseWithFollowUp = FollowUpQuestions.addFollowUpToResponse(manualAnswer, followUpQuestion);

        return {
          success: true,
          response: responseWithFollowUp,
          source: 'website_data_direct'
        };
      }

      const websiteContext = websiteData && websiteData.length > 0
        ? websiteData.map(item => {
          let cleanContent = item.content || '';
          cleanContent = cleanContent.replace(/LEARNILM WORLD 🌎 Browse our Mentors Sign In Get started/g, '');
          cleanContent = cleanContent.replace(/💬 Ask LEARNilM/g, '');
          cleanContent = cleanContent.replace(/© 2025 Learnilm World — All rights reserved\.?/g, '');
          return `[${item.section || 'Info'}] ${cleanContent}`;
        }).join('\n\n')
        : "LearnILmWorld connects students with expert trainers for personalized 1-on-1 sessions.";

      const conversationSummary = conversationMemory.getConversationSummary(sessionId);
      const recentHistory = conversationMemory.getRecentHistory(sessionId, 3);

      let conversationContext = "";
      if (recentHistory.length > 0) {
        conversationContext = "Recent conversation:\n";
        recentHistory.forEach(msg => {
          conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.message}\n`;
        });
      }

      const ENHANCED_PROMPT = `
You are LearnILmWorld's helpful assistant. Always end your response with a relevant follow-up question to keep the conversation engaging.

Conversation so far:
${history}

WEBSITE INFORMATION:
${websiteContext}

${conversationSummary}

${conversationContext}

CURRENT USER QUESTION: "${message}"

INSTRUCTIONS:
1. Give a clear, direct answer to the question
2. Use previous conversation context to make responses more relevant
3. Always end with a relevant follow-up question to engage the user
4. Make the follow-up question specific to what was discussed
5. Use bullet points or numbered lists for steps/features
6. Keep it conversational and helpful
7. Language: ${language}

IMPORTANT: Always end your response with a follow-up question starting with "💡"

ANSWER:
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: ENHANCED_PROMPT }] }],
            generationConfig: {
              temperature: 0.3,
              topP: 0.8,
              maxOutputTokens: 600
            }
          })
        }
      );
      // console.log(response);

      // added by me, to check token limit error
      if (response.status === 429) {
        console.log("⚠️ Gemini API rate limit hit!");
        return {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
          source: 'gemini_rate_limit'
        };
      }

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      // console.log(response.status, data);
      let answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Ensure there's a follow-up question
      if (!answer.includes('💡')) {
        const session = conversationMemory.getSession(sessionId);
        const followUpQuestion = FollowUpQuestions.generateFollowUp(message, session.context, language);
        answer = FollowUpQuestions.addFollowUpToResponse(answer, followUpQuestion);
      }

      const weakPhrases = [
        "I'm sorry", "I cannot", "unable to", "I don't have",
        "I couldn't find", "no information", "contact support"
      ];

      if (weakPhrases.some(phrase => answer.toLowerCase().includes(phrase.toLowerCase()))) {
        const fallbackAnswer = generateStrictAnswer(message, websiteData, language) ||
          "I'd be happy to help you with that!";
        const session = conversationMemory.getSession(sessionId);
        const followUpQuestion = FollowUpQuestions.generateFollowUp(message, session.context, language);
        const responseWithFollowUp = FollowUpQuestions.addFollowUpToResponse(fallbackAnswer, followUpQuestion);

        return {
          success: true,
          response: responseWithFollowUp,
          source: 'clean_fallback'
        };
      }

      return {
        success: true,
        response: answer,
        source: 'gemini_with_followup'
      };

    } catch (error) {
      const websiteData = searchScrapedData(message);
      const manualAnswer = generateStrictAnswer(message, websiteData, language) ||
        "Welcome to LearnILmWorld! I can help you find expert trainers, learn about our courses, or answer any questions about our services.";

      const session = conversationMemory.getSession(sessionId);
      const followUpQuestion = FollowUpQuestions.generateFollowUp(message, session.context, language);
      const responseWithFollowUp = FollowUpQuestions.addFollowUpToResponse(manualAnswer, followUpQuestion);

      return {
        success: true,
        response: responseWithFollowUp,
        source: 'error_fallback'
      };
    }
  }
};

// ================================
// SIMPLE WELCOME MESSAGES
// ================================
const TimeBasedGreeting = {
  getGreeting: (language = 'en') => {
    const hour = new Date().getHours();
    let timeOfDay = '';

    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const greetings = {
      morning: { en: 'Good morning', hi: 'शुभ प्रभात', fr: 'Bonjour', es: 'Buenos días', de: 'Guten Morgen', ja: 'おはようございます', sa: 'सुप्रभातम्' },
      afternoon: { en: 'Good afternoon', hi: 'शुभ दोपहर', fr: 'Bon après-midi', es: 'Buenas tardes', de: 'Guten Tag', ja: 'こんにちは', sa: 'सुभमध्याह्नम्' },
      evening: { en: 'Good evening', hi: 'शुभ संध्या', fr: 'Bonsoir', es: 'Buenas noches', de: 'Guten Abend', ja: 'こんばんは', sa: 'सुभसन्ध्याकालम्' },
      night: { en: 'Good night', hi: 'शुभ रात्रि', fr: 'Bonne nuit', es: 'Buenas noches', de: 'Gute Nacht', ja: 'おやすみなさい', sa: 'शुभरात्रिः' }
    };

    return greetings[timeOfDay][language] || greetings[timeOfDay].en;
  }
};

const WelcomeMessages = {
  getWelcomeMessage: (language = 'en') => {
    const greeting = TimeBasedGreeting.getGreeting(language);
    const messages = {
      en: `${greeting}! 👋 Welcome to LearnILmWorld!\n\nI'm here to help you with:\n\n• Finding expert trainers and mentors\n• Information about courses and certificates\n• Booking sessions and class structure\n• Equipment requirements\n• And much more!\n\n💡 What would you like to know about our services today?`,
      hi: `${greeting}! 👋 LearnILmWorld में आपका स्वागत है!\n\nमैं यहां आपकी सहायता के लिए हूं:\n\n• विशेषज्ञ प्रशिक्षकों और मेंटर्स को ढूंढने में\n• पाठ्यक्रम और प्रमाणपत्रों की जानकारी\n• सत्र बुक करने और कक्षा संरचना\n• उपकरण आवश्यकताएं\n• और बहुत कुछ!\n\n💡 आज आप हमारी सेवाओं के बारे में क्या जानना चाहेंगे?`
    };
    return messages[language] || messages.en;
  }
};

const SmartResponseGenerator = {
  generate: async (message, sessionId, language = 'en', isFirstMessage = false) => {
    if (isFirstMessage) {
      conversationMemory.addMessage(sessionId, 'assistant', WelcomeMessages.getWelcomeMessage(language));
      return {
        response: WelcomeMessages.getWelcomeMessage(language),
        source: 'welcome'
      };
    }

    conversationMemory.addMessage(sessionId, 'user', message);
    // fetch history from memory
    const history = conversationMemory.getRecentHistory(sessionId);

    try {
      //changed by me send message + history to Gemini
      const geminiResult = await GeminiService.generateResponse(message, sessionId, language, history);

      if (geminiResult.success && geminiResult.response) {
        conversationMemory.addMessage(sessionId, 'assistant', geminiResult.response);

        return {
          response: geminiResult.response,
          source: geminiResult.source
        };
      } else {
        throw new Error('Gemini service failed');
      }

    } catch (error) {
      // added by me
      console.log("Error in SmartResponseGenerator:", error);
      const fallbackResponse = "I'd be happy to help you with LearnILmWorld! What would you like to know?";
      conversationMemory.addMessage(sessionId, 'assistant', fallbackResponse);

      return {
        response: fallbackResponse,
        source: 'fallback'
      };
    }
  }
};

// ================================
// ROUTES
// ================================
const sessions = new Map();

router.post('/start', async (req, res) => {
  try {
    const { language = "en", userType = "guest" } = req.body;

    const sessionId = `chat_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const welcomeResponse = await SmartResponseGenerator.generate(
      "",
      sessionId,
      language,
      true
    );

    // CREATE DB SESSION USING Chatbot MODEL
    const newSession = await Chatbot.create({
      sessionId,
      userType,
      language,
      conversation: [
        { role: "assistant", message: welcomeResponse.response }
      ],
      userContext: {}
    });

    res.json({
      sessionId: newSession.sessionId,
      conversation: newSession.conversation
    });
    // console.log("Chat session created:", newSession);

  } catch (error) {
    console.error("Error in /start:", error);
    res.status(500).json({ error: "Failed to start chat" });
  }
});

router.post('/message', async (req, res) => {
  try {
    const { sessionId, message, language = "en" } = req.body;

    // console.log("Chat request received:", req.body);

    // FIND SESSION USING Chatbot
    const session = await Chatbot.findOne({ sessionId });

    // Added by me
    const history = session.conversation.map(msg => {
      return `${msg.role === "user" ? "User" : "Assistant"}: ${msg.message}`;
    }).join("\n");

    if (!session) {
      return res.status(404).json({ error: "Chat session not found" });
    }

    //  STORE USER MESSAGE
    session.conversation.push({
      role: "user",
      message
    });

    const response = await SmartResponseGenerator.generate(
      message,
      sessionId,
      language,
      false,
      history, // added by me
    );

    // STORE BOT MESSAGE
    session.conversation.push({
      role: "assistant",
      message: response.response
    });

    await session.save(); //  THIS COMMITS TO MONGO

    res.json({
      response: response.response,
      conversation: session.conversation,
      source: response.source
    });

  } catch (error) {
    console.error("Error in /message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

router.get('/history/:sessionId', async (req, res) => {
  try {
    const session = await Chatbot.findOne({
      sessionId: req.params.sessionId
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      conversation: session.conversation,
      userContext: session.userContext
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.post("/save-user", async (req, res) => {
  try {
    const { sessionId, name, phone, email, role } = req.body;

    if (!sessionId || !name || !phone || !email || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const session = await Chatbot.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    //  SAVE USER INFO INTO SAME CHAT SESSION
    session.userContext = {
      userRole: role,
      name,
      phone,
      email
    };

    session.conversation.push({
      role: "assistant",
      message: `Thank you ${name}, your details are saved successfully.`
    });

    await session.save();

    res.json({
      success: true,
      message: "User data saved successfully"
    });

  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data" });
  }
});

// Get memory info for debugging
router.get('/memory/:sessionId', async (req, res) => {
  try {
    const session = conversationMemory.getSession(req.params.sessionId);
    res.json({
      conversationHistory: session.conversationHistory,
      context: session.context,
      sessionAge: new Date() - session.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

// Clear session endpoint
router.delete('/session/:sessionId', async (req, res) => {
  try {
    sessions.delete(req.params.sessionId);
    conversationMemory.sessions.delete(req.params.sessionId);
    res.json({ message: 'Session and memory cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear session' });
  }
});

// Clean up old sessions periodically (optional)
setInterval(() => {
  conversationMemory.cleanupOldSessions(24); // Clean sessions older than 24 hours
}, 60 * 60 * 1000); // Run every hour

export default router;