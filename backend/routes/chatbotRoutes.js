import express from 'express';
import Chatbot from '../models/Chatbot.js';
import fetch from 'node-fetch';

const router = express.Router();

// ================================
// LANGUAGE DETECTION
// ================================
const LanguageDetector = {
  detect: (text) => {
    const hindiRegex = /[\u0900-\u097F]/;
    const sanskritRegex = /[\u0900-\u097F]|[अ-ह]/;
    const japaneseRegex = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF]/;
    const spanishRegex = /[áéíóúñ¿¡]/i;
    const frenchRegex = /[àâçéèêëîïôûùüÿæœ]/i;
    const germanRegex = /[äöüß]/i;
    
    if (hindiRegex.test(text)) return 'hi';
    if (sanskritRegex.test(text) && text.includes('अस्मि') || text.includes('विद्यार्थी')) return 'sa';
    if (japaneseRegex.test(text)) return 'ja';
    if (spanishRegex.test(text)) return 'es';
    if (frenchRegex.test(text)) return 'fr';
    if (germanRegex.test(text)) return 'de';
    return 'en';
  }
};

// ================================
// TIME-BASED GREETING
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
      morning: {
        en: 'Good morning',
        hi: 'शुभ प्रभात',
        fr: 'Bonjour',
        es: 'Buenos días',
        de: 'Guten Morgen',
        ja: 'おはようございます',
        sa: 'सुप्रभातम्'
      },
      afternoon: {
        en: 'Good afternoon',
        hi: 'शुभ दोपहर',
        fr: 'Bon après-midi',
        es: 'Buenas tardes',
        de: 'Guten Tag',
        ja: 'こんにちは',
        sa: 'सुभमध्याह्नम्'
      },
      evening: {
        en: 'Good evening',
        hi: 'शुभ संध्या',
        fr: 'Bonsoir',
        es: 'Buenas noches',
        de: 'Guten Abend',
        ja: 'こんばんは',
        sa: 'सुभसन्ध्याकालम्'
      },
      night: {
        en: 'Good night',
        hi: 'शुभ रात्रि',
        fr: 'Bonne nuit',
        es: 'Buenas noches',
        de: 'Gute Nacht',
        ja: 'おやすみなさい',
        sa: 'शुभरात्रिः'
      }
    };

    return greetings[timeOfDay][language] || greetings[timeOfDay].en;
  }
};

// =====================================
// GEMINI SERVICE — SMART CONTEXT + POINTWISE FORMAT
// =====================================
const GeminiService = {
  generateResponse: async (message, conversationHistory = [], language = 'en') => {
    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
      console.log('❌ Gemini API key not configured');
      return { success: false, error: 'API key not configured' };
    }

    try {
      console.log(`🚀 Gemini LLM Mode Active [Lang: ${language}]`);

      // Detect user role based on messages in conversation
      const allText = [...conversationHistory.map(c => c.message), message].join(' ').toLowerCase();
      let role = 'general';
      if (allText.includes('student')) role = 'student';
      else if (allText.includes('trainer') || allText.includes('teacher')) role = 'trainer';
      else if (allText.includes('mentor')) role = 'mentor';

      // Build a dynamic system prompt
      const systemPrompt = {
        role: "model",
        parts: [{
          text: `
You are LearnILmWorld's intelligent AI assistant. 
You support learners, mentors, and trainers conversationally.

User role detected: ${role}

Guidelines:
- Respond in the same language as the user (${language}).
- If the user is a student: guide, teach, and explain concepts clearly.
- If the user is a mentor/trainer: assist with mentoring resources or platform features.
- Always understand context from conversation history before replying.
- Keep tone warm, natural, and concise.
- When listing steps or instructions, format like:
  1. First point
  2. Second point
  3. Third point
  (Each on a new line with real breaks.)
- Never merge multiple numbered points into one paragraph.
- Keep answers helpful, human-like, and never robotic.
          `
        }]
      };

      // Convert conversation to Gemini format
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }]
      }));

      // Add current user message
      const userTurn = {
        role: 'user',
        parts: [{ text: message }]
      };

      const contents = [systemPrompt, ...formattedHistory, userTurn];

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.8,
              topP: 0.9,
              maxOutputTokens: 700
            }
          })
        }
      );

      console.log('📡 Gemini API status:', response.status);

      if (!response.ok) {
        const errText = await response.text();
        console.log('❌ Gemini API error:', errText);
        return { success: false, error: `API error: ${response.status}` };
      }

      const data = await response.json();

      // Extract response text safely
      let generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Post-process text:
      // ✅ Replace numbers like "1." without line breaks into proper lines
      generatedText = generatedText
        .replace(/(\d+)\.\s*/g, '\n$1. ')   // force each number on new line
        .replace(/\*/g, '')                 // remove asterisks
        .trim();

      console.log('✅ Gemini LLM Response Ready (role:', role, ')');
      console.log('🤖', generatedText);

      return {
        success: true,
        response: generatedText,
        role,
        source: 'gemini_llm_smart'
      };

    } catch (err) {
      console.error('💥 Gemini LLM error:', err.message);
      return { success: false, error: err.message, source: 'gemini_llm_smart' };
    }
  }
};

// ================================
// TRAINING DATA (MULTILINGUAL) - FALLBACK
// ================================
const TRAINING_DATA = {
  greetings_help: {
    en: "👋 Hello! I'm your LearnILmWorld AI assistant — I can help with subjects, mentors, and language learning. What would you like to know?",
    fr: "👋 Bonjour ! Je suis votre assistant IA LearnILmWorld — je peux vous aider avec les matières, les mentors et l'apprentissage des langues. Que souhaitez-vous savoir ?",
    es: "👋 ¡Hola! Soy tu asistente de IA LearnILmWorld — puedo ayudarte con las materias, mentores y aprendizaje de idiomas. ¿Qué te gustaría saber?",
    de: "👋 Hallo! Ich bin dein LearnILmWorld KI-Assistent — ich kann dir bei Fächern, Mentoren und Sprachenlernen helfen. Was möchtest du wissen?",
    ja: "👋 こんにちは！私はLearnILmWorldのAIアシスタントです — 科目、メンター、言語学習についてお手伝いします。何を知りたいですか？",
    sa: "👋 नमस्ते! अहं LearnILmWorld कृत्रिमबुद्ध्युपकृतसहायकः अस्मि — विषयेषु, अध्यापकेषु, भाषाशिक्षणे च साहाय्यं करोमि। किं ज्ञातुमिच्छसि?",
    hi: "👋 नमस्ते! मैं आपका LearnILmWorld AI सहायक हूं — मैं विषयों, मेंटर्स और भाषा सीखने में मदद कर सकता हूं। आप क्या जानना चाहेंगे?"
  },

  mentor_questions: {
    en: "Certified experts in Languages, Sciences, Math, History, Geography, Economics & CS. View profiles & reviews.",
    de: "Zertifizierte Experten in Sprachen, Naturwissenschaften, Mathe, Geschichte, Geographie, Wirtschaft & Informatik.",
    fr: "Experts certifiés en Langues, Sciences, Maths, Histoire, Géographie, Économie & Informatique.",
    ja: "言語、科学、数学、歴史、地理、経済、CSの認定エキスパート。プロフィールとレビューを閲覧。",
    es: "Expertos certificados en Idiomas, Ciencias, Matemáticas, Historia, Geografía, Economía e Informática.",
    sa: "भाषा, विज्ञान, गणित, इतिहास, भूगोल, अर्थशास्त्र, कम्प्यूटरविज्ञान क्षेत्रेषु प्रमाणितविशेषज्ञाः। प्रोफाइल् समीक्षाः च।",
    hi: "भाषाएं, विज्ञान, गणित, इतिहास, भूगोल, अर्थशास्त्र और कंप्यूटर विज्ञान में प्रमाणित विशेषज्ञ। प्रोफाइल और समीक्षाएं देखें।"
  },

  subjects_available: {
    en: "We teach: Languages (English, German, French, Japanese, Spanish, Sanskrit), Sciences (Physics, Chemistry, Biology), Mathematics, History, Geography, Economics, Computer Science. All levels.",
    de: "Wir unterrichten: Sprachen (Englisch, Deutsch, Französisch, Japanisch, Spanisch, Sanskrit), Naturwissenschaften (Physik, Chemie, Biologie), Mathematik, Geschichte, Geographie, Wirtschaft, Informatik.",
    fr: "Nous enseignons: Langues (Anglais, Allemand, Français, Japonais, Espagnol, Sanskrit), Sciences (Physique, Chimie, Biologie), Mathématiques, Histoire, Géographie, Économie, Informatique.",
    ja: "指導科目： 言語（英語、ドイツ語、フランス語、日本語、スペイン語、サンスクリット）、科学（物理、化学、生物学）、数学、歴史、地理、経済、コンピューターサイエンス。全レベル対応。",
    es: "Enseñamos: Idiomas (Inglés, Alemán, Francés, Japonés, Español, Sánscrito), Ciencias (Física, Química, Biología), Matemáticas, Historia, Geografía, Economía, Informática.",
    sa: "वयं शिक्षयामः: भाषा (आङ्ग्ल, जर्मन, फ्रेंच, जापानी, स्पेनिश, संस्कृत), विज्ञान (भौतिकी, रसायन, जीवविज्ञान), गणित, इतिहास, भूगोल, अर्थशास्त्र, कम्प्यूटरविज्ञान। सर्वस्तराणि।",
    hi: "हम पढ़ाते हैं: भाषाएं (अंग्रेजी, जर्मन, फ्रेंच, जापानी, स्पेनिश, संस्कृत), विज्ञान (भौतिकी, रसायन, जीवविज्ञान), गणित, इतिहास, भूगोल, अर्थशास्त्र, कंप्यूटर विज्ञान। सभी स्तर।"
  }
};

// ================================
// SMART ROLE-BASED AI LOGIC - FALLBACK (WITH SEQUENTIAL INFO COLLECTION)
// ================================
const SMART_AI = {
  isFirstInteraction: (conversation = []) =>
    conversation.length === 0 || (conversation.length === 1 && conversation[0].role === 'assistant'),

  getTimeBasedRoleQuestion: (name = '', language = 'en') => {
    const greeting = TimeBasedGreeting.getGreeting(language);
    
    const questions = {
      en: `${greeting}${name ? `, ${name}` : ''}! 👋 Are you a student, mentor, or trainer?`,
      fr: `${greeting}${name ? `, ${name}` : ''}! 👋 Êtes-vous étudiant, mentor ou formateur ?`,
      es: `${greeting}${name ? `, ${name}` : ''}! 👋 ¿Eres estudiante, mentor o entrenador?`,
      de: `${greeting}${name ? `, ${name}` : ''}! 👋 Sind Sie Student, Mentor oder Trainer?`,
      ja: `${greeting}${name ? `、${name}さん` : ''}! 👋 学生、メンター、トレーナーのどちらですか？`,
      sa: `${greeting}${name ? `, ${name}` : ''}! 👋 भवान् छात्रः, मार्गदर्शकः उत प्रशिक्षकः?`,
      hi: `${greeting}${name ? `, ${name}` : ''}! 👋 क्या आप छात्र, मेंटर या प्रशिक्षक हैं?`
    };
    return questions[language] || questions.en;
  },

  // Sequential info collection messages
  getNameMessage: (language = 'en') => {
    const greeting = TimeBasedGreeting.getGreeting(language);
    
    const messages = {
      en: `${greeting}! 👋 Welcome to LearnILmWorld! To personalize your experience, could you please tell me your name?`,
      hi: `${greeting}! 👋 LearnILmWorld में आपका स्वागत है! आपके अनुभव को व्यक्तिगत बनाने के लिए, कृपया मुझे अपना नाम बताएं?`,
      fr: `${greeting}! 👋 Bienvenue sur LearnILmWorld ! Pour personnaliser votre expérience, pourriez-vous me dire votre nom ?`,
      es: `${greeting}! 👋 ¡Bienvenido a LearnILmWorld! Para personalizar su experiencia, ¿podría decirme su nombre?`,
      de: `${greeting}! 👋 Willkommen bei LearnILmWorld! Um Ihr Erlebnis zu personalisieren, könnten Sie mir bitte Ihren Namen mitteilen?`,
      ja: `${greeting}! 👋 LearnILmWorldへようこそ！あなたの体験をパーソナライズするために、お名前を教えていただけますか？`,
      sa: `${greeting}! 👋 LearnILmWorld प्रति स्वागतम्! भवतः अनुभवं वैयक्तिकीकर्तुं, कृपया भवतः नाम सूचयतु?`
    };
    return messages[language] || messages.en;
  },

  getPhoneMessage: (name = '', language = 'en') => {
    const messages = {
      en: `Nice to meet you${name ? `, ${name}` : ''}! 📱 What's your phone number?`,
      hi: `आपसे मिलकर अच्छा लगा${name ? `, ${name}` : ''}! 📱 आपका फोन नंबर क्या है?`,
      fr: `Ravi de vous rencontrer${name ? `, ${name}` : ''}! 📱 Quel est votre numéro de téléphone ?`,
      es: `¡Encantado de conocerte${name ? `, ${name}` : ''}! 📱 ¿Cuál es tu número de teléfono?`,
      de: `Schön, Sie kennenzulernen${name ? `, ${name}` : ''}! 📱 Wie lautet Ihre Telefonnummer?`,
      ja: `はじめまして${name ? `、${name}さん` : ''}! 📱 電話番号を教えてください？`,
      sa: `भवता सह मेलनं सुखदम् अस्ति${name ? `, ${name}` : ''}! 📱 भवतः दूरभाषसंख्या का?`
    };
    return messages[language] || messages.en;
  },

  getEmailMessage: (name = '', language = 'en') => {
    const messages = {
      en: `Thank you${name ? `, ${name}` : ''}! 📧 Now, what's your email address?`,
      hi: `धन्यवाद${name ? `, ${name}` : ''}! 📧 अब, आपका ईमेल पता क्या है?`,
      fr: `Merci${name ? `, ${name}` : ''}! 📧 Maintenant, quelle est votre adresse e-mail ?`,
      es: `Gracias${name ? `, ${name}` : ''}! 📧 Ahora, ¿cuál es tu dirección de correo electrónico?`,
      de: `Danke${name ? `, ${name}` : ''}! 📧 Nun, wie lautet Ihre E-Mail-Adresse?`,
      ja: `ありがとうございます${name ? `、${name}さん` : ''}! 📧 では、メールアドレスを教えてください？`,
      sa: `धन्यवादाः${name ? `, ${name}` : ''}! 📧 अधुना, भवतः ईमेलपताः का?`
    };
    return messages[language] || messages.en;
  },

  getCompletionMessage: (userInfo, language = 'en') => {
    const { name = '' } = userInfo;
    const messages = {
      en: `Perfect! Thank you${name ? `, ${name}` : ''}! ✅ Now, are you a student, mentor, or trainer?`,
      hi: `बढ़िया! धन्यवाद${name ? `, ${name}` : ''}! ✅ अब, क्या आप छात्र, मेंटर या प्रशिक्षक हैं?`,
      fr: `Parfait ! Merci${name ? `, ${name}` : ''}! ✅ Maintenant, êtes-vous étudiant, mentor ou formateur ?`,
      es: `¡Perfecto! Gracias${name ? `, ${name}` : ''}! ✅ Ahora, ¿eres estudiante, mentor o entrenador?`,
      de: `Perfekt! Danke${name ? `, ${name}` : ''}! ✅ Nun, sind Sie Student, Mentor oder Trainer?`,
      ja: `完璧です！ありがとうございます${name ? `、${name}さん` : ''}! ✅ では、学生、メンター、トレーナーのどちらですか？`,
      sa: `उत्तमम्! धन्यवादाः${name ? `, ${name}` : ''}! ✅ अधुना, भवान् छात्रः, मार्गदर्शकः उत प्रशिक्षकः?`
    };
    return messages[language] || messages.en;
  },

  detectRole: (message) => {
    const msg = message.toLowerCase();
    
    // English keywords
    if (msg.includes('student') || msg.includes('learner') || msg.includes('study')) return 'student';
    if (msg.includes('trainer') || msg.includes('teacher') || msg.includes('instructor')) return 'trainer';
    if (msg.includes('mentor')) return 'mentor';
    
    // Hindi keywords
    if (msg.includes('छात्र') || msg.includes('विद्यार्थी') || msg.includes('स्टूडेंट')) return 'student';
    if (msg.includes('प्रशिक्षक') || msg.includes('शिक्षक') || msg.includes('टीचर') || msg.includes('ट्रेनर')) return 'trainer';
    if (msg.includes('मेंटर') || msg.includes('मार्गदर्शक')) return 'mentor';
    
    // Sanskrit keywords
    if (msg.includes('छात्रः') || msg.includes('विद्यार्थी') || msg.includes('अस्मि')) return 'student';
    if (msg.includes('मार्गदर्शकः')) return 'mentor';
    
    return null;
  },

  getRoleWelcome: (role, name = '', language = 'en') => {
    const welcomes = {
      student: {
        en: `Welcome${name ? `, ${name}` : ''}, student! How can I help with your learning journey?`,
        fr: `Bienvenue${name ? `, ${name}` : ''}, étudiant! Comment puis-je aider votre parcours d'apprentissage?`,
        es: `¡Bienvenido${name ? `, ${name}` : ''}, estudiante! ¿Cómo puedo ayudar en tu viaje de aprendizaje?`,
        de: `Willkommen${name ? `, ${name}` : ''}, Student! Wie kann ich Ihnen beim Lernen helfen?`,
        ja: `${name ? `${name}さん` : ''}、学生さん、ようこそ！ 学習の旅をどのようにお手伝いしましょうか？`,
        sa: `स्वागतम्${name ? `, ${name}` : ''}, छात्र! अहं भवतः अध्ययनयात्रायां कथं साहाय्यं कर्तुं शक्नोमि?`,
        hi: `स्वागत है${name ? `, ${name}` : ''}, छात्र! मैं आपकी सीखने की यात्रा में कैसे मदद कर सकता हूं?`
      },
      trainer: {
        en: `Welcome${name ? `, ${name}` : ''}, trainer! How can I assist with your teaching?`,
        fr: `Bienvenue${name ? `, ${name}` : ''}, formateur! Comment puis-je assister votre enseignement?`,
        es: `¡Bienvenido${name ? `, ${name}` : ''}, entrenador! ¿Cómo puedo asistir con tu enseñanza?`,
        de: `Willkommen${name ? `, ${name}` : ''}, Trainer! Wie kann ich Ihnen beim Unterrichten helfen?`,
        ja: `${name ? `${name}さん` : ''}、トレーナーさん、ようこそ！ 指導をどのようにお手伝いしましょうか？`,
        sa: `स्वागतम्${name ? `, ${name}` : ''}, प्रशिक्षक! अहं भवतः शिक्षणे कथं साहाय्यं कर्तुं शक्नोमि?`,
        hi: `स्वागत है${name ? `, ${name}` : ''}, प्रशिक्षक! मैं आपकी शिक्षण में कैसे सहायता कर सकता हूं?`
      },
      mentor: {
        en: `Welcome${name ? `, ${name}` : ''}, mentor! How can I support your mentoring journey?`,
        fr: `Bienvenue${name ? `, ${name}` : ''}, mentor! Comment puis-je soutenir votre parcours de mentorat?`,
        es: `¡Bienvenido${name ? `, ${name}` : ''}, mentor! ¿Cómo puedo apoyar tu viaje de mentoría?`,
        de: `Willkommen${name ? `, ${name}` : ''}, Mentor! Wie kann ich Sie auf Ihrer Mentoring-Reise unterstützen?`,
        ja: `${name ? `${name}さん` : ''}、メンターさん、ようこそ！ メンタリングの旅をどのようにサポートしましょうか？`,
        sa: `स्वागतम्${name ? `, ${name}` : ''}, मार्गदर्शक! अहं भवतः मार्गदर्शनयात्रायां कथं साहाय्यं कर्तुं शक्नोमि?`,
        hi: `स्वागत है${name ? `, ${name}` : ''}, मेंटर! मैं आपकी मेंटरिंग यात्रा में कैसे सहायता कर सकता हूं?`
      }
    };
    return welcomes[role]?.[language] || welcomes[role]?.en || "Welcome!";
  },

  // Extract individual pieces of information
  extractName: (message) => {
    // Simple name extraction - take first meaningful words
    const words = message.split(' ').filter(word => {
      // Filter out common non-name words and very short words
      const lowerWord = word.toLowerCase();
      const nonNameWords = ['hi', 'hello', 'hey', 'my', 'name', 'is', 'i', 'am', 'call', 'called', 'मेरा', 'नाम', 'है', 'je', 'm\'appelle', 'me', 'llamo', 'ich', 'heisse', '私の名前は'];
      return word.length > 1 && !nonNameWords.includes(lowerWord);
    });

    if (words.length > 0) {
      // Take first 2-3 words as name
      return words.slice(0, 3).join(' ').replace(/[^\w\s]/g, '');
    }
    return null;
  },

  extractPhone: (message) => {
    // Extract phone number (various formats)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatch = message.match(phoneRegex);
    return phoneMatch ? phoneMatch[0] : null;
  },

  extractEmail: (message) => {
    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = message.match(emailRegex);
    return emailMatch ? emailMatch[0] : null;
  },

  generateResponse: async (question, language = 'en', userContext = {}, conversation = []) => {
    const q = question.toLowerCase();

    // Step 1: If first interaction, ask for name
    if (!userContext.userInfo && SMART_AI.isFirstInteraction(conversation)) {
      return { 
        response: SMART_AI.getNameMessage(language), 
        needsInfo: true,
        infoType: 'name',
        context: { ...userContext, collectingInfo: true, currentStep: 'name' }
      };
    }

    // Step 2: Sequential info collection
    if (userContext.collectingInfo) {
      const currentStep = userContext.currentStep;
      const userInfo = userContext.userInfo || {};
      let extractedValue = null;

      switch (currentStep) {
        case 'name':
          extractedValue = SMART_AI.extractName(question);
          if (extractedValue) {
            userInfo.name = extractedValue;
            return {
              response: SMART_AI.getPhoneMessage(extractedValue, language),
              needsInfo: true,
              infoType: 'phone',
              context: {
                ...userContext,
                userInfo,
                currentStep: 'phone'
              }
            };
          } else {
            // If no name detected, ask again
            return {
              response: SMART_AI.getNameMessage(language),
              needsInfo: true,
              infoType: 'name',
              context: userContext
            };
          }

        case 'phone':
          extractedValue = SMART_AI.extractPhone(question);
          if (extractedValue) {
            userInfo.phone = extractedValue;
            return {
              response: SMART_AI.getEmailMessage(userInfo.name, language),
              needsInfo: true,
              infoType: 'email',
              context: {
                ...userContext,
                userInfo,
                currentStep: 'email'
              }
            };
          } else {
            // If no phone detected, ask again
            return {
              response: SMART_AI.getPhoneMessage(userInfo.name, language),
              needsInfo: true,
              infoType: 'phone',
              context: userContext
            };
          }

        case 'email':
          extractedValue = SMART_AI.extractEmail(question);
          if (extractedValue) {
            userInfo.email = extractedValue;
            // Info collection complete, now ask for role
            return {
              response: SMART_AI.getCompletionMessage(userInfo, language),
              needsRole: true,
              context: {
                ...userContext,
                userInfo,
                collectingInfo: false,
                currentStep: null,
                needsRole: true
              }
            };
          } else {
            // If no email detected, ask again
            return {
              response: SMART_AI.getEmailMessage(userInfo.name, language),
              needsInfo: true,
              infoType: 'email',
              context: userContext
            };
          }
      }
    }

    // Step 3: Ask for role if needed (AFTER info collection is complete)
    if (!userContext.userRole && userContext.needsRole) {
      const name = userContext.userInfo?.name || '';
      return { 
        response: SMART_AI.getTimeBasedRoleQuestion(name, language), 
        needsRole: true 
      };
    }

    // Step 4: Capture role (AFTER info collection is complete)
    if (userContext.needsRole) {
      const role = SMART_AI.detectRole(q);
      if (role) {
        userContext.userRole = role;
        userContext.needsRole = false;
        const name = userContext.userInfo?.name || '';
        return { 
          response: SMART_AI.getRoleWelcome(role, name, language), 
          context: userContext 
        };
      } else {
        const name = userContext.userInfo?.name || '';
        return { 
          response: SMART_AI.getTimeBasedRoleQuestion(name, language), 
          needsRole: true 
        };
      }
    }

    // Step 5: Keyword-based response (normal conversation - AFTER info and role collection)
    const normalizedQ = q.replace(/[^\w\s]/g, '').toLowerCase();
    const keywords = {
      greetings_help: ['hi', 'hello', 'hey', 'help', 'salut', 'hola', 'hallo', 'namaste', 'नमस्ते', 'こんにちは'],
      mentor_questions: ['mentor', 'teacher', 'tutor', 'trainer', 'instructor', 'formateur', 'enseignant', 'profesor', 'शिक्षक', 'प्रशिक्षक', 'メンター'],
      subjects_available: ['subject', 'teach', 'learn', 'course', 'language', 'science', 'math', 'विषय', 'पढ़ाते', 'सिखाते', 'コース', '科目'],
      books_recommendations: ['book', 'material', 'resource', 'notes', 'textbook', 'किताब', 'पुस्तक', 'सामग्री', '本'],
      certification_info: ['certificate', 'certif', 'verified', 'proof', 'प्रमाणपत्र', 'सर्टिफिकेट', '証明書'],
      class_structure: ['class', 'lesson', 'schedule', 'structure', 'कक्षा', 'पाठ', 'संरचना', 'クラス'],
      equipment_requirements: ['equipment', 'laptop', 'require', 'device', 'उपकरण', 'लैपटॉप', 'आवश्यक', '機器'],
      attendance_policy: ['late', 'absence', 'miss', 'attendance', 'policy', 'अनुपस्थिति', 'उपस्थिति', 'नीति', '欠席'],
      feedback_frequency: ['feedback', 'progress', 'assignment', 'report', 'प्रतिक्रिया', 'प्रगति', 'असाइनमेंट', 'フィードバック'],
      payment_info: ['payment', 'pay', 'money', 'fee', 'refund', 'भुगतान', 'पैसा', 'शुल्क', '支払い'],
      website_about: ['website', 'about', 'learnilmworld', 'who are you', 'वेबसाइट', 'के बारे में', 'ウェブサイト'],
      subject_specific: ['detail', 'specific', 'approach', 'method', 'topic', 'विवरण', 'विशिष्ट', 'विषय', '詳細']
    };

    for (const [key, words] of Object.entries(keywords)) {
      if (words.some(w => normalizedQ.includes(w))) {
        return { response: TRAINING_DATA[key][language] || TRAINING_DATA[key].en };
      }
    }

    // Default responses in different languages
    const defaults = {
      en: "I can help with subjects, mentors, booking, payments, and learning questions!",
      fr: "Je peux aider avec matières, mentors, réservation, paiements et questions d'apprentissage!",
      es: "¡Puedo ayudar con asignaturas, mentores, reservas, pagos y preguntas de aprendizaje!",
      de: "Ich helfe bei Fächern, Mentoren, Buchung, Zahlungen und Lernfragen!",
      ja: "科目、メンター、予約、支払い、学習質問をお手伝い！",
      sa: "अहं विषय, मार्गदर्शक, आरक्षण, भुगतान, अध्ययनप्रश्न च सहायता कर्तुं शक्नोमि!",
      hi: "मैं विषयों, मेंटर्स, बुकिंग, भुगतान और सीखने के सवालों में मदद कर सकता हूं!"
    };

    return { response: defaults[language] || defaults.en };
  }
};

// ================================
// UNIFIED RESPONSE GENERATOR (WITH LANGUAGE DETECTION)
// ================================
const UnifiedResponseGenerator = {
  generate: async (message, language = 'en', userContext = {}, conversation = []) => {
    console.log(`💬 Processing: "${message}" in language: ${language}`);
    
    // Auto-detect language from message if not specified
    const detectedLanguage = LanguageDetector.detect(message);
    const useLanguage = detectedLanguage !== 'en' ? detectedLanguage : language;
    
    console.log(`🌐 Using language: ${useLanguage}`);
    
    // Skip Gemini for info collection steps to maintain sequential flow
    if (userContext.collectingInfo || userContext.needsRole) {
      console.log('🔤 Using SMART_AI for info/role collection');
      const smartResponse = await SMART_AI.generateResponse(message, useLanguage, userContext, conversation);
      return {
        response: smartResponse.response,
        source: 'smart_ai_info_collection',
        needsRole: smartResponse.needsRole,
        needsInfo: smartResponse.needsInfo,
        infoType: smartResponse.infoType,
        context: smartResponse.context || userContext
      };
    }

    // For very short greetings, use SMART_AI directly
    const shortQueries = ['hi', 'hello', 'hey', 'hola', 'bonjour', 'hallo', 'namaste', 'नमस्ते', 'こんにちは'];
    if (shortQueries.includes(message.toLowerCase().trim()) || message.length < 3) {
      console.log('🔤 Using SMART_AI for short query');
      const smartResponse = await SMART_AI.generateResponse(message, useLanguage, userContext, conversation);
      return {
        response: smartResponse.response,
        source: 'smart_ai_shortcut',
        needsRole: smartResponse.needsRole,
        needsInfo: smartResponse.needsInfo,
        infoType: smartResponse.infoType,
        context: smartResponse.context || userContext
      };
    }

    try {
      // Step 1: Try Gemini with detected language (only after info and role collection)
      console.log('🚀 Attempting Gemini with language:', useLanguage);
      const geminiResult = await GeminiService.generateResponse(message, conversation, useLanguage);
      
      if (geminiResult.success) {
        console.log('✅ Using Gemini response');
        return {
          response: geminiResult.response,
          source: 'gemini',
          context: userContext
        };
      }

      // Step 2: Fallback to SMART_AI if Gemini fails
      console.log('🔄 Gemini failed, using SMART_AI...');
      const fallbackResponse = await SMART_AI.generateResponse(
        message, 
        useLanguage, 
        userContext, 
        conversation
      );

      return {
        response: fallbackResponse.response,
        source: 'smart_ai',
        needsRole: fallbackResponse.needsRole,
        needsInfo: fallbackResponse.needsInfo,
        infoType: fallbackResponse.infoType,
        context: fallbackResponse.context || userContext
      };

    } catch (error) {
      console.error('Unified response generator error:', error);
      
      // Final fallback to SMART_AI
      const fallbackResponse = await SMART_AI.generateResponse(message, useLanguage, userContext, conversation);
      
      return {
        response: fallbackResponse.response,
        source: 'smart_ai_fallback',
        needsRole: fallbackResponse.needsRole,
        needsInfo: fallbackResponse.needsInfo,
        infoType: fallbackResponse.infoType,
        context: fallbackResponse.context || userContext
      };
    }
  }
};

// ================================
// ROUTES (UPDATED WITH SEQUENTIAL INFO COLLECTION)
// ================================

// Start Chat Session
router.post('/start', async (req, res) => {
  try {
    const { language = 'en', message } = req.body;
    
    // Auto-detect language from initial message if provided
    let detectedLanguage = language;
    if (message) {
      detectedLanguage = LanguageDetector.detect(message);
    }
    
    const userId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    const session = new Chatbot({
      sessionId: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userType: 'guest',
      language: detectedLanguage,
      conversation: [],
      userContext: { 
        collectingInfo: true,
        currentStep: 'name'  // Start with name collection
      }
    });

    // Ask for name immediately
    const welcomeMessage = SMART_AI.getNameMessage(detectedLanguage);
    session.conversation.push({ role: 'assistant', message: welcomeMessage });

    await session.save();

    res.json({
      sessionId: session.sessionId,
      conversation: session.conversation,
      needsInfo: true,
      infoType: 'name',
      detectedLanguage: detectedLanguage
    });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({ error: 'Failed to start chat' });
  }
});

// Send Message
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message, language = 'en' } = req.body;
    const session = await Chatbot.findOne({ sessionId });

    if (!session) return res.status(404).json({ error: 'Chat session not found' });

    // Add user message to conversation
    session.conversation.push({ role: 'user', message });
    session.userContext = session.userContext || {};

    // Generate response using unified generator
    const unifiedResponse = await UnifiedResponseGenerator.generate(
      message,
      language,
      session.userContext,
      session.conversation
    );

    // Add assistant response to conversation
    session.conversation.push({ 
      role: 'assistant', 
      message: unifiedResponse.response,
      source: unifiedResponse.source
    });

    // Update user context if provided
    if (unifiedResponse.context) {
      session.userContext = unifiedResponse.context;
      
      // Save user info to database if collected
      if (unifiedResponse.context.userInfo) {
        session.userInfo = unifiedResponse.context.userInfo;
      }
    }

    await session.save();

    res.json({
      response: unifiedResponse.response,
      conversation: session.conversation,
      needsRole: unifiedResponse.needsRole || false,
      needsInfo: unifiedResponse.needsInfo || false,
      infoType: unifiedResponse.infoType || null,
      source: unifiedResponse.source
    });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get Chat History
router.get('/history/:sessionId', async (req, res) => {
  try {
    const session = await Chatbot.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json(session.conversation);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get All Guest Sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Chatbot.find()
      .select('sessionId language createdAt userInfo')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

export default router;