// Comprehensive Data for 8+ Cyber Arcade Mini-Games

export const METEOR_WORDS = [
  { word: 'FOCUS', uz: 'DIQQATNI JAMLANMOQ', speed: 1.0 },
  { word: 'ENERGY', uz: 'ENERGIYA, G‘AYRAT', speed: 1.1 },
  { word: 'FUTURE', uz: 'KELAJAK', speed: 1.2 },
  { word: 'SYSTEM', uz: 'TIZIM', speed: 1.2 },
  { word: 'GALAXY', uz: 'GALAKTIKA', speed: 1.3 },
  { word: 'WISDOM', uz: 'DONOLIK', speed: 1.3 },
  { word: 'BRAVERY', uz: 'JASORAT', speed: 1.4 },
  { word: 'NETWORK', uz: 'TARMOQ', speed: 1.5 },
  { word: 'QUANTUM', uz: 'KVANT', speed: 1.6 },
  { word: 'HORIZON', uz: 'UFUQ', speed: 1.7 }
];

export const MEMORY_CARDS = [
  { id: 1, pairId: 'pair-1', text: 'Breakthrough', uz: 'Burilish nuqtasi', type: 'en', icon: '🚀' },
  { id: 2, pairId: 'pair-1', text: 'Burilish nuqtasi', uz: 'Breakthrough', type: 'uz', icon: '🚀' },
  { id: 3, pairId: 'pair-2', text: 'Resilience', uz: 'Matonat', type: 'en', icon: '🛡️' },
  { id: 4, pairId: 'pair-2', text: 'Matonat', uz: 'Resilience', type: 'uz', icon: '🛡️' },
  { id: 5, pairId: 'pair-3', text: 'Fluency', uz: 'Ravonlik', type: 'en', icon: '🌊' },
  { id: 6, pairId: 'pair-3', text: 'Ravonlik', uz: 'Fluency', type: 'uz', icon: '🌊' },
  { id: 7, pairId: 'pair-4', text: 'Synergy', uz: 'Sinergiya', type: 'en', icon: '⚡' },
  { id: 8, pairId: 'pair-4', text: 'Sinergiya', uz: 'Synergy', type: 'uz', icon: '⚡' },
  { id: 9, pairId: 'pair-5', text: 'Innovation', uz: 'Yangilik', type: 'en', icon: '💡' },
  { id: 10, pairId: 'pair-5', text: 'Yangilik', uz: 'Innovation', type: 'uz', icon: '💡' },
  { id: 11, pairId: 'pair-6', text: 'Algorithm', uz: 'Algoritm', type: 'en', icon: '🧠' },
  { id: 12, pairId: 'pair-6', text: 'Algoritm', uz: 'Algorithm', type: 'uz', icon: '🧠' }
];

export const SCRAMBLE_WORDS = [
  {
    target: 'CYBERSPACE',
    scrambled: ['P', 'A', 'C', 'E', 'C', 'Y', 'B', 'E', 'R', 'S'],
    hintUz: 'Virtual raqamli koinot yoki internet maydoni',
    ipa: '/ˈsaɪ.bɚ.speɪs/'
  },
  {
    target: 'KNOWLEDGE',
    scrambled: ['W', 'L', 'E', 'D', 'G', 'K', 'N', 'O', 'E'],
    hintUz: 'Bilim, ma‘rifat',
    ipa: '/ˈnɑː.lɪdʒ/'
  },
  {
    target: 'CHALLENGE',
    scrambled: ['L', 'L', 'E', 'N', 'G', 'C', 'H', 'A', 'E'],
    hintUz: 'Sinov, qiyinchilik, chaqiruv',
    ipa: '/ˈtʃæl.ɪndʒ/'
  },
  {
    target: 'DEDICATION',
    scrambled: ['C', 'A', 'T', 'I', 'O', 'N', 'D', 'E', 'D', 'I'],
    hintUz: 'Fidoyilik, sidqidildan berilish',
    ipa: '/ˌded.əˈkeɪ.ʃən/'
  }
];

export const SENTENCE_ARCHITECT_DATA = [
  {
    id: 'sa-1',
    uz: 'Ular yangi sun‘iy intellekt texnologiyasini ishlab chiqmoqdalar.',
    correctSentence: 'They are developing new artificial intelligence technology.',
    tokens: ['They', 'developing', 'are', 'technology.', 'new', 'artificial', 'intelligence']
  },
  {
    id: 'sa-2',
    uz: 'Har kuni gapirish ravonlikni oshirishning eng samarali usulidir.',
    correctSentence: 'Speaking daily is the most effective way to improve fluency.',
    tokens: ['daily', 'Speaking', 'is', 'most', 'the', 'way', 'effective', 'fluency.', 'to', 'improve']
  },
  {
    id: 'sa-3',
    uz: 'O‘z maqsadlaringizga erishish uchun hech qachon taslim bo‘lmang.',
    correctSentence: 'Never give up on achieving your personal goals.',
    tokens: ['up', 'Never', 'give', 'personal', 'on', 'achieving', 'goals.', 'your']
  }
];

export const LIGHTNING_QUIZ_QUESTIONS = [
  {
    q: 'What is the synonym of "Vibrant"?',
    qUz: '"Vibrant" (jonli/jo‘shqin) so‘zining sinonimi qaysi?',
    options: ['Lively and Energetic', 'Dull and Boring', 'Cold and Dark', 'Very Slow'],
    correct: 0
  },
  {
    q: 'Choose the correct preposition: "Interested ___ AI technology"',
    qUz: 'To‘g‘ri predlogni tanlang: "Interested ___ AI technology"',
    options: ['in', 'at', 'on', 'with'],
    correct: 0
  },
  {
    q: 'Which word means "Chidamlilik va matonat"?',
    qUz: 'Qaysi so‘z "Chidamlilik va matonat" degani?',
    options: ['Resilience', 'Hesitation', 'Confusion', 'Reluctance'],
    correct: 0
  },
  {
    q: 'Select the past form of the irregular verb "Fly":',
    qUz: '"Fly" (uchmoq) noto‘g‘ri fe‘lining o‘tgan zamon shakli:',
    options: ['Flew', 'Flown', 'Flyed', 'Flying'],
    correct: 0
  },
  {
    q: 'What does the idiom "Break a leg" mean?',
    qUz: '"Break a leg" iborasi qanday ma‘noni bildiradi?',
    options: ['Good luck! (Omad yor bo‘lsin!)', 'Get injured (Jarohatlan)', 'Run away (Qochmoq)', 'Stop playing (To‘xtatmoq)'],
    correct: 0
  }
];

export const HANGMAN_WORDS = [
  {
    word: 'UNIVERSE',
    uz: 'Koinot, olam',
    hint: 'Everything that exists throughout space and time'
  },
  {
    word: 'CHAMPION',
    uz: 'Chempion, g‘olib',
    hint: 'A person who has defeated all rivals in a contest'
  },
  {
    word: 'ADVENTURE',
    uz: 'Sarguzasht',
    hint: 'An unusual and exciting, typically hazardous, experience'
  },
  {
    word: 'DISCOVERY',
    uz: 'Kashfiyot',
    hint: 'The act of finding something unexpected or previously unknown'
  },
  {
    word: 'PERSISTENCE',
    uz: 'Qat‘iyat, sabot',
    hint: 'Firm continuance in a course of action in spite of difficulty'
  }
];

export const ODD_ONE_OUT_QUESTIONS = [
  {
    id: 'odd-1',
    category: 'Technology & Hardware',
    categoryUz: 'Texnologiya va Qurilmalar',
    options: ['Laptop', 'Smartphone', 'Pineapple', 'Tablet'],
    optionsUz: ['Noutbuk', 'Smartfon', 'Ananas', 'Planshet'],
    oddIndex: 2,
    reasonUz: 'Ananas (Pineapple) bu meva, qolgan barchasi raqamli elektron qurilmalardir.'
  },
  {
    id: 'odd-2',
    category: 'Emotions & Feelings',
    categoryUz: 'Hissiyotlar',
    options: ['Delighted', 'Ecstatic', 'Thrilled', 'Furious'],
    optionsUz: ['Xursand', 'Bexad quvongan', 'Hayajonlangan', 'G‘azablangan'],
    oddIndex: 3,
    reasonUz: 'Furious (g‘azablangan) bu salbiy hissiyot, qolgan uchtasi esa quvonch ma‘nosini bildiradi.'
  },
  {
    id: 'odd-3',
    category: 'Transportation',
    categoryUz: 'Transport turlari',
    options: ['Airplane', 'Helicopter', 'Submarine', 'Spaceship'],
    optionsUz: ['Samolyot', 'Vertolyot', 'Suvosti kemasi', 'Kosmik kema'],
    oddIndex: 2,
    reasonUz: 'Submarine suv ostida suzadi, qolgan barchasi osmon va fazoda uchadi.'
  }
];

export const TRUE_FALSE_QUESTIONS = [
  {
    id: 'tf-1',
    statement: 'The word "Unprecedented" means something that has never occurred before.',
    statementUz: '"Unprecedented" so‘zi "muqaddas/misli ko‘rilmagan, oldin bo‘lmagan" degan ma‘noni bildiradi.',
    isTrue: true,
    explanationUz: 'To‘g‘ri! "Unprecedented" misli ko‘rilmagan hodisalar uchun ishlatiladi.'
  },
  {
    id: 'tf-2',
    statement: 'In English, adjectives usually come AFTER the noun they describe.',
    statementUz: 'Ingliz tilida sifatlar odatda o‘zlari ta‘riflayotgan otdan KEYIN keladi.',
    isTrue: false,
    explanationUz: 'Yolg‘on! Ingliz tilida sifatlar deyarli har doim otdan OLDIN keladi (masalan: "red car", "smart boy").'
  },
  {
    id: 'tf-3',
    statement: 'The past tense of "Teach" is "Teached".',
    statementUz: '"Teach" fe‘lining o‘tgan zamon shakli "Teached" bo‘ladi.',
    isTrue: false,
    explanationUz: 'Yolg‘on! "Teach" noto‘g‘ri fe‘l bo‘lib, o‘tgan zamoni "Taught" bo‘ladi.'
  },
  {
    id: 'tf-4',
    statement: '"Piece of cake" is an idiom that means an extremely easy task.',
    statementUz: '"Piece of cake" iborasi juda oson vazifa ma‘nosini anglatadi.',
    isTrue: true,
    explanationUz: 'To‘g‘ri! Bu ibora xalqimizdagi "xamir uchidan patir" ma‘nosiga teng.'
  }
];
