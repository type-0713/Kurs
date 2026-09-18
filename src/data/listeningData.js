// Listening Arena dialogues, dictations, and minimal pairs

export const LISTENING_DIALOGUES = [
  {
    id: 'dlg-1',
    title: 'Silicon Valley Pitch & Coffee Bar',
    titleUz: 'Kremniy Vodiysi Startap Taqdimoti va Qahvaxonada Muloqot',
    location: 'Cyber Café, San Francisco',
    level: 'Intermediate (B1/B2)',
    lines: [
      {
        speaker: 'Alex (Barista)',
        uzSpeaker: 'Aleks (Qahvachi)',
        text: 'Good morning! Welcome to Cyber Roast. What can I brew for your brainstorm session today?',
        uzText: 'Xayrli tong! Kiber Qahvaga xush kelibsiz. Bugungi rejalaringiz uchun qanday qahva damlab beray?',
        avatar: '☕'
      },
      {
        speaker: 'Elena (Founder)',
        uzSpeaker: 'Yelena (Asoschi)',
        text: 'Hey Alex! I need a double espresso with oat milk. I am pitching our 3D education platform to investors in twenty minutes.',
        uzText: 'Salom Aleks! Menga suli sutli qo‘shaloq espresso kerak. Yigirma daqiqadan so‘ng investorlarga 3D ta‘lim platformamizni taqdim etaman.',
        avatar: '👩‍💻'
      },
      {
        speaker: 'Alex (Barista)',
        uzSpeaker: 'Aleks (Qahvachi)',
        text: 'That sounds thrilling! Remember to emphasize your user retention metrics. You will crush it!',
        uzText: 'Bu juda hayajonli eshitilyapti! Foydalanuvchilarning qaytish ko‘rsatkichlarini ta‘kidlashni unutmang. Hammasi zo‘r bo‘ladi!',
        avatar: '☕'
      },
      {
        speaker: 'Elena (Founder)',
        uzSpeaker: 'Yelena (Asoschi)',
        text: 'Thanks for the encouragement! Your espresso is practically fuel for innovation.',
        uzText: 'Dalda berganingiz uchun rahmat! Qahvangiz innovatsiya uchun ayni yoqilg‘idir.',
        avatar: '👩‍💻'
      }
    ]
  },
  {
    id: 'dlg-2',
    title: 'Airport Customs & Boarding Gate',
    titleUz: 'Aeroport Bojxona Nazorati va Uchish Darvozasi',
    location: 'Heathrow Airport, London',
    level: 'Beginner / Intermediate (A2/B1)',
    lines: [
      {
        speaker: 'Officer Miller',
        uzSpeaker: 'Ofitser Miller',
        text: 'Good afternoon. Passport and customs declaration form, please.',
        uzText: 'Xayrli kun. Pasportingiz va bojxona deklaratsiyasi varaqasini bering, iltimos.',
        avatar: '👮‍♂️'
      },
      {
        speaker: 'Traveler David',
        uzSpeaker: 'Sayohatchi Devid',
        text: 'Here you go, officer. I am visiting London to attend the Global Tech Summit.',
        uzText: 'Mana oling, ofitser. Men Londonga Global Texnologiya Sammitida qatnashish uchun keldim.',
        avatar: '🧳'
      },
      {
        speaker: 'Officer Miller',
        uzSpeaker: 'Ofitser Miller',
        text: 'How long do you intend to stay in the United Kingdom?',
        uzText: 'Buyuk Britaniyada qancha muddat qolish niyatidasiz?',
        avatar: '👮‍♂️'
      },
      {
        speaker: 'Traveler David',
        uzSpeaker: 'Sayohatchi Devid',
        text: 'Just five days. I have my return ticket booked for Sunday evening.',
        uzText: 'Faqat besh kun. Qaytish chiptam yakshanba oqshomiga band qilingan.',
        avatar: '🧳'
      },
      {
        speaker: 'Officer Miller',
        uzSpeaker: 'Ofitser Miller',
        text: 'Everything is in order. Enjoy your stay in London!',
        uzText: 'Hammasi joyida. Londondagi safari maroqli o‘tsin!',
        avatar: '👮‍♂️'
      }
    ]
  }
];

export const DICTATION_EXERCISES = [
  {
    id: 'dic-1',
    sentence: 'Consistency in daily practice is the secret key to true fluency.',
    uz: 'Har kungi amaliyotdagi doimiylik haqiqiy ravonlikning sirli kalitidir.',
    difficulty: 'Medium',
    hint: 'Listen for: Consistency, practice, secret, fluency'
  },
  {
    id: 'dic-2',
    sentence: 'Interactive technology makes learning English exciting and unforgettable.',
    uz: 'Interaktiv texnologiya ingliz tilini o‘rganishni qiziqarli va unutilmas qiladi.',
    difficulty: 'Easy',
    hint: 'Listen for: Interactive, learning, exciting'
  },
  {
    id: 'dic-3',
    sentence: 'Artificial intelligence provides immediate feedback on your phonetic pronunciation.',
    uz: 'Sun‘iy intellekt sizning fonetik talaffuzingiz bo‘yicha bir zumda fikr-mulohaza beradi.',
    difficulty: 'Hard',
    hint: 'Listen for: Artificial, immediate, phonetic'
  },
  {
    id: 'dic-4',
    sentence: 'Clear communication opens doors to international career opportunities.',
    uz: 'Tiniq va aniq muloqot xalqaro martaba imkoniyatlariga yo‘l ochadi.',
    difficulty: 'Medium',
    hint: 'Listen for: communication, international, opportunities'
  }
];

export const MINIMAL_PAIRS = [
  {
    id: 'mp-1',
    wordA: 'Ship',
    wordAUz: 'Kema',
    wordB: 'Sheep',
    wordBUz: 'Qo‘y',
    target: 'Sheep',
    phoneme: 'Short /ɪ/ vs Long /iː/',
    audioPrompt: 'Sheep'
  },
  {
    id: 'mp-2',
    wordA: 'Bad',
    wordAUz: 'Yomon',
    wordB: 'Bed',
    wordBUz: 'Karovot / Yotoq',
    target: 'Bad',
    phoneme: 'Short /æ/ vs Short /e/',
    audioPrompt: 'Bad'
  },
  {
    id: 'mp-3',
    wordA: 'Think',
    wordAUz: 'O‘ylamoq',
    wordB: 'Sink',
    wordBUz: 'Cho‘kmoq / Chanoq',
    target: 'Think',
    phoneme: 'Dental /θ/ vs Alveolar /s/',
    audioPrompt: 'Think'
  },
  {
    id: 'mp-4',
    wordA: 'Leave',
    wordAUz: 'Ketmoq, tark etmoq',
    wordB: 'Live',
    wordBUz: 'Yashamoq',
    target: 'Live',
    phoneme: 'Long /iː/ vs Short /ɪ/',
    audioPrompt: 'Live'
  }
];
