// Speaking Hub and AI Dialogue Partner conversation trees

export const AI_SPEAKING_TOPICS = [
  {
    id: 'ai-tech',
    title: 'The Future of AI & Smart Cities',
    titleUz: 'Sun‘iy Intellekt va Kelajak Shaharlari',
    icon: 'Bot',
    badge: 'Technology',
    steps: [
      {
        aiMessage: 'Hello! I am CyberLex, your AI conversation coach. In your opinion, how will artificial intelligence change our daily routine by the year 2030?',
        aiMessageUz: 'Salom! Men KiberLeks, sizning AI nutq murabbiyingizman. Sizningcha, 2030-yilga borib sun‘iy intellekt kundalik hayotimizni qanday o‘zgartiradi?',
        suggestedKeywords: ['automation', 'robots', 'smart home', 'education', 'future', 'convenience', 'healthcare'],
        tipUz: 'Masalan, "I believe AI will automate routine tasks and improve healthcare..." deb boshlashingiz mumkin.'
      },
      {
        aiMessage: 'Fascinating perspective! Do you think AI will create more new career opportunities, or will it replace traditional professions?',
        aiMessageUz: 'Qiziqarli qarash! Sizningcha AI ko‘proq yangi ish o‘rinlari yaratadimi yoki an‘anaviy kasblarni almashtiradimi?',
        suggestedKeywords: ['create', 'opportunities', 'replace', 'skills', 'adapt', 'engineers', 'creativity'],
        tipUz: '"While some jobs will change, new fields like prompt engineering and robotics will flourish..." kabi javob bering.'
      },
      {
        aiMessage: 'Brilliant insight! What is one tech skill you personally want to master this year?',
        aiMessageUz: 'Ajoyib fikr! Siz shaxsan bu yil qaysi texnologik ko‘nikmani o‘rganishni xohlaysiz?',
        suggestedKeywords: ['programming', 'design', 'speaking', 'data', 'english', 'machine learning'],
        tipUz: '"I am striving to master advanced programming and fluent English communication..."'
      }
    ]
  },
  {
    id: 'ai-travel',
    title: 'Dream Travel Destinations',
    titleUz: 'Orzudagi Sayohatlar va Mamlakatlar',
    icon: 'Compass',
    badge: 'Lifestyle',
    steps: [
      {
        aiMessage: 'Greetings, explorer! If you could book a flight to any city in the world right now, where would you go and why?',
        aiMessageUz: 'Salom, sayohatchi! Agar hozir dunyoning istalgan shahriga chipta ololsangiz, qayerga borardingiz va nega?',
        suggestedKeywords: ['tokyo', 'london', 'new york', 'nature', 'architecture', 'culture', 'food'],
        tipUz: '"If I had the chance, I would fly to London to explore historical museums and practice English with locals..."'
      },
      {
        aiMessage: 'That sounds breathtaking! What kind of experiences do you prefer when traveling: exploring vibrant cities or relaxing in serene nature?',
        aiMessageUz: 'Bu juda ajoyib! Sayohatda nimani afzal ko‘rasiz: jo‘shqin shaharlarni kezishmi yoki sokin tabiatda dam olishmi?',
        suggestedKeywords: ['vibrant', 'mountains', 'beaches', 'museums', 'nature', 'prefer', 'relaxing'],
        tipUz: '"I definitely prefer vibrant urban exploration because I love architecture and diverse street food..."'
      }
    ]
  }
];

export const PRONUNCIATION_CHALLENGES = [
  {
    id: 'pc-1',
    word: 'Extraordinary',
    ipa: '/ɪkˈstrɔːr.dən.er.i/',
    uz: 'Favqulodda, g‘ayritabiiy',
    difficulty: 'Hard',
    tips: 'Blend "extra" into "ordinary", accent on the third syllable: ex-TRAWR-di-ne-ree.'
  },
  {
    id: 'pc-2',
    word: 'Specifically',
    ipa: '/spəˈsɪf.ɪ.kəl.i/',
    uz: 'Xususan, aniq qilib aytganda',
    difficulty: 'Medium',
    tips: 'Crisp initial /sp/, stress on /sɪf/: spuh-SIF-ik-lee.'
  },
  {
    id: 'pc-3',
    word: 'Simultaneously',
    ipa: '/ˌsaɪ.məlˈteɪ.ni.əs.li/',
    uz: 'Bir vaqtning o‘zida, parallel ravishda',
    difficulty: 'Hard',
    tips: 'Six syllables: sy-mul-TAY-nee-uhs-lee.'
  },
  {
    id: 'pc-4',
    word: 'Comfortable',
    ipa: '/ˈkʌm.fɚ.t̬ə.bəl/',
    uz: 'Qulay, shinam',
    difficulty: 'Medium',
    tips: 'Pronounced as 3 syllables in modern English: KUMF-tuh-buhl (not com-for-ta-ble).'
  }
];
