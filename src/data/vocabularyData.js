// Curated thematic vocabulary database with IPA, Uzbek translations, and sound presets

export const VOCABULARY_CATEGORIES = [
  { id: 'all', name: 'All Words', uz: 'Barcha So‘zlar', icon: 'Sparkles' },
  { id: 'custom', name: 'My Vocab (User)', uz: 'Mening Lug‘atim (Shaxsiy)', icon: 'Bookmark' },
  { id: 'tech', name: 'AI & High-Tech', uz: 'IT va Zamonaviy Texnologiyalar', icon: 'Cpu' },
  { id: 'travel', name: 'Travel & Airport', uz: 'Sayohat va Aeroport', icon: 'Plane' },
  { id: 'business', name: 'Career & Business', uz: 'Karyera va Biznes', icon: 'Briefcase' },
  { id: 'slang', name: 'Slang & Idioms', uz: 'Zamonaviy Slang va Iboralar', icon: 'Flame' },
  { id: 'difficult', name: 'Tricky Pronunciation', uz: 'Qiyin Talaffuzli So‘zlar', icon: 'Mic' }
];

export const INITIAL_VOCABULARY = [
  // Tech & AI
  {
    id: 't-1',
    word: 'Artificial Intelligence',
    ipa: '/ˌɑːr.t̬ə.fɪʃ.əl ɪnˈtel.ə.dʒəns/',
    uz: 'Sun‘iy intellekt',
    partOfSpeech: 'noun',
    example: 'Artificial Intelligence is revolutionizing modern education.',
    exampleUz: 'Sun‘iy intellekt zamonaviy ta‘limni tubdan o‘zgartirmoqda.',
    category: 'tech',
    difficulty: 'B2'
  },
  {
    id: 't-2',
    word: 'Algorithm',
    ipa: '/ˈæl.ɡə.rɪ.ðəm/',
    uz: 'Algoritm, qadam-baqadam ko‘rsatma',
    partOfSpeech: 'noun',
    example: 'The recommendation algorithm adapts to your learning pace.',
    exampleUz: 'Tavsiya algoritmi sizning o‘rganish sur‘atingizga moslashadi.',
    category: 'tech',
    difficulty: 'B1'
  },
  {
    id: 't-3',
    word: 'Automation',
    ipa: '/ˌɑː.t̬əˈmeɪ.ʃən/',
    uz: 'Avtomatlashtirish',
    partOfSpeech: 'noun',
    example: 'Automation allows repetitive tasks to be solved instantly.',
    exampleUz: 'Avtomatlashtirish takrorlanuvchi vazifalarni bir zumda bajarishga imkon beradi.',
    category: 'tech',
    difficulty: 'B2'
  },
  {
    id: 't-4',
    word: 'Interface',
    ipa: '/ˈɪn.t̬ɚ.feɪs/',
    uz: 'Foydalanuvchi interfeysi',
    partOfSpeech: 'noun',
    example: 'The 3D interactive interface makes learning addictively fun.',
    exampleUz: '3D interaktiv interfeys o‘rganishni nihoyatda qiziqarli qiladi.',
    category: 'tech',
    difficulty: 'B1'
  },
  {
    id: 't-5',
    word: 'Cybersecurity',
    ipa: '/ˌsaɪ.bɚ.səˈkjʊr.ə.t̬i/',
    uz: 'Kiberxavfsizlik',
    partOfSpeech: 'noun',
    example: 'Every digital platform requires strong cybersecurity protocols.',
    exampleUz: 'Har bir raqamli platforma mustahkam kiberxavfsizlik qoidalarini talab qiladi.',
    category: 'tech',
    difficulty: 'B2'
  },

  // Travel & Airport
  {
    id: 'tr-1',
    word: 'Boarding Pass',
    ipa: '/ˈbɔːr.dɪŋ ˌpæs/',
    uz: 'Samolyotga chiqish taloni',
    partOfSpeech: 'noun',
    example: 'Please have your passport and boarding pass ready at the gate.',
    exampleUz: 'Iltimos, darvoza oldida pasport va chiqish taloningizni tayyor tuting.',
    category: 'travel',
    difficulty: 'A2'
  },
  {
    id: 'tr-2',
    word: 'Departure Lounge',
    ipa: '/dɪˈpɑːr.tʃɚ ˌlaʊndʒ/',
    uz: 'Uchib ketish zali (kutish xonasi)',
    partOfSpeech: 'noun',
    example: 'Passengers are waiting in the departure lounge for flight updates.',
    exampleUz: 'Yo‘lovchilar reys yangiliklarini uchib ketish zalida kutishmoqda.',
    category: 'travel',
    difficulty: 'B1'
  },
  {
    id: 'tr-3',
    word: 'Baggage Claim',
    ipa: '/ˈbæɡ.ɪdʒ ˌkleɪm/',
    uz: 'Yuk qabul qilish joyi',
    partOfSpeech: 'noun',
    example: 'You can collect your suitcases at baggage claim area number four.',
    exampleUz: 'Chamadonlaringizni to‘rtinchi raqamli yuk olish joyidan olishingiz mumkin.',
    category: 'travel',
    difficulty: 'A2'
  },
  {
    id: 'tr-4',
    word: 'Itinerary',
    ipa: '/aɪˈtɪn.ə.rer.i/',
    uz: 'Sayohat marshruti va rejasi',
    partOfSpeech: 'noun',
    example: 'Our travel itinerary includes visiting historic monuments in London.',
    exampleUz: 'Bizning sayohat rejamiz Londondagi tarixiy obidalarni ziyorat qilishni o‘z ichiga oladi.',
    category: 'travel',
    difficulty: 'B2'
  },

  // Business & Career
  {
    id: 'b-1',
    word: 'Negotiate',
    ipa: '/nəˈɡoʊ.ʃi.eɪt/',
    uz: 'Muzokara olib bormoq, kelishmoq',
    partOfSpeech: 'verb',
    example: 'Good leaders know how to negotiate mutually beneficial deals.',
    exampleUz: 'Yaxshi rahbarlar har ikki tomonga manfaatli bitimlar tuzish bo‘yicha muzokara qila oladilar.',
    category: 'business',
    difficulty: 'B2'
  },
  {
    id: 'b-2',
    word: 'Synergy',
    ipa: '/ˈsɪn.ɚ.dʒi/',
    uz: 'Sinergiya, birgalikdagi kuchli samara',
    partOfSpeech: 'noun',
    example: 'Team synergy multiplies individual productivity.',
    exampleUz: 'Jamoaviy sinergiya shaxsiy mahsuldorlikni bir necha barobar oshiradi.',
    category: 'business',
    difficulty: 'C1'
  },
  {
    id: 'b-3',
    word: 'Entrepreneur',
    ipa: '/ˌɑːn.trə.prəˈnɝː/',
    uz: 'Tadbirkor, startapchi',
    partOfSpeech: 'noun',
    example: 'An ambitious entrepreneur turns visionary ideas into reality.',
    exampleUz: 'Intiluvchan tadbirkor ilg‘or g‘oyalarni haqiqatga aylantiradi.',
    category: 'business',
    difficulty: 'B2'
  },
  {
    id: 'b-4',
    word: 'Stakeholder',
    ipa: '/ˈsteɪkˌhoʊl.dɚ/',
    uz: 'Manfaatdor tomon, aksiyador',
    partOfSpeech: 'noun',
    example: 'We must present quarterly earnings to every major stakeholder.',
    exampleUz: 'Biz har bir asosiy manfaatdor tomonga choraklik daromadlarni taqdim etishimiz shart.',
    category: 'business',
    difficulty: 'B2'
  },

  // Slang & Idioms
  {
    id: 's-1',
    word: 'Piece of cake',
    ipa: '/ˌpiːs əv ˈkeɪk/',
    uz: 'Juda oson, xamir uchidan patir',
    partOfSpeech: 'idiom',
    example: 'Once you master phonetics, English pronunciation is a piece of cake.',
    exampleUz: 'Fonetikani o‘zlashtirib olsangiz, inglizcha talaffuz juda oson bo‘lib qoladi.',
    category: 'slang',
    difficulty: 'B1'
  },
  {
    id: 's-2',
    word: 'Bite the bullet',
    ipa: '/ˌbaɪt ðə ˈbʊl.ɪt/',
    uz: 'Qiyinchilikka tishni tishga qo‘yib chidamoq',
    partOfSpeech: 'idiom',
    example: 'I had to bite the bullet and give the English presentation myself.',
    exampleUz: 'Men sabr qilib, inglizcha taqdimotni o‘zim o‘tkazishga majbur bo‘ldim.',
    category: 'slang',
    difficulty: 'B2'
  },
  {
    id: 's-3',
    word: 'Hit the nail on the head',
    ipa: '/ˌhɪt ðə neɪl ɑːn ðə ˈhed/',
    uz: 'Nishonga to‘g‘ri urmoq, ayni haqiqatni aytmoq',
    partOfSpeech: 'idiom',
    example: 'Your analysis of the problem really hit the nail on the head.',
    exampleUz: 'Muammo bo‘yicha sizning tahlilingiz ayni nishonga to‘g‘ri urdi.',
    category: 'slang',
    difficulty: 'B2'
  },
  {
    id: 's-4',
    word: 'Under the weather',
    ipa: '/ˌʌn.dɚ ðə ˈweð.ɚ/',
    uz: 'To‘bi yo‘q, biroz betob',
    partOfSpeech: 'idiom',
    example: 'She felt slightly under the weather, so she rested at home.',
    exampleUz: 'U o‘zini biroz betob his qildi va uyda dam oldi.',
    category: 'slang',
    difficulty: 'A2'
  },

  // Tricky Pronunciation words
  {
    id: 'd-1',
    word: 'Worcestershire',
    ipa: '/ˈwʊs.tɚ.ʃɚ/',
    uz: 'Vustershir (Britaniyadagi mashhur sous va graflik)',
    partOfSpeech: 'noun',
    example: 'Worcestershire sauce adds incredible depth to savory cooking.',
    exampleUz: 'Vustershir sousi taomlarga ajoyib chuqur ta‘m beradi.',
    category: 'difficult',
    difficulty: 'C1'
  },
  {
    id: 'd-2',
    word: 'Squirrel',
    ipa: '/ˈskwɝː.əl/',
    uz: 'Olmaxon',
    partOfSpeech: 'noun',
    example: 'The squirrel quickly scampered up the oak tree.',
    exampleUz: 'Olmaxon chaqqonlik bilan eman daraxtiga tirmashib chiqdi.',
    category: 'difficult',
    difficulty: 'B1'
  },
  {
    id: 'd-3',
    word: 'Phenomenon',
    ipa: '/fəˈnɑː.mə.nɑːn/',
    uz: 'Noyob hodisa, fenomen',
    partOfSpeech: 'noun',
    example: 'The northern lights are a breathtaking natural phenomenon.',
    exampleUz: 'Shimol yog‘dusi nafasni qisuvchi tabiiy noyob hodisadir.',
    category: 'difficult',
    difficulty: 'B2'
  },
  {
    id: 'd-4',
    word: 'Thoroughly',
    ipa: '/ˈθɝː.oʊ.li/',
    uz: 'Batafsil, obdon, to‘liq',
    partOfSpeech: 'adverb',
    example: 'Make sure you thoroughly review each vocabulary card.',
    exampleUz: 'Har bir lug‘at kartasini obdon ko‘rib chiqqaningizga ishonch hosil qiling.',
    category: 'difficult',
    difficulty: 'B2'
  },
  {
    id: 'd-5',
    word: 'Epitome',
    ipa: '/ɪˈpɪt.ə.mi/',
    uz: 'Timsollik, eng oliy namuna',
    partOfSpeech: 'noun',
    example: 'Her calm confidence is the epitome of great leadership.',
    exampleUz: 'Uning vazmin ishonchi ajoyib yetakchilikning eng oliy namunasidir.',
    category: 'difficult',
    difficulty: 'C1'
  }
];

export const TONGUE_TWISTERS = [
  {
    id: 'tt-1',
    title: 'Peter Piper',
    uz: 'Piter Payper qalamtirlari',
    text: 'Peter Piper picked a peck of pickled peppers.',
    difficulty: 'Medium',
    targetPhoneme: '/p/'
  },
  {
    id: 'tt-2',
    title: 'Seashells',
    uz: 'Dengiz bo‘yidagi chig‘anoqlar',
    text: 'She sells seashells by the seashore.',
    difficulty: 'Hard',
    targetPhoneme: '/s/ and /ʃ/'
  },
  {
    id: 'tt-3',
    title: 'Woodchuck',
    uz: 'Yog‘och kemiruvchi o‘rmon sichqoni',
    text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    difficulty: 'Hard',
    targetPhoneme: '/w/'
  },
  {
    id: 'tt-4',
    title: 'Red Lorry, Yellow Lorry',
    uz: 'Qizil yuk mashinasi, sariq yuk mashinasi',
    text: 'Red lorry, yellow lorry, red lorry, yellow lorry.',
    difficulty: 'Extreme',
    targetPhoneme: '/r/ and /l/'
  }
];
