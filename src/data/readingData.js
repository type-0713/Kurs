// Reading Studio articles with interactive clickable word dictionaries and quizzes

export const READING_ARTICLES = [
  {
    id: 'art-1',
    title: 'The AI Renaissance and Language Mastery',
    titleUz: 'Sun‘iy Intellekt Renessansi va Til O‘rganish San‘ati',
    level: 'Intermediate (B1)',
    readTime: '3 min',
    wordCount: 165,
    summary: 'Discover how modern neural networks transform speech recognition and accelerate human fluency.',
    summaryUz: 'Zamonaviy neyron tarmoqlari nutqni aniqlashni qanday o‘zgartirayotgani va til o‘rganishni tezlashtirayotganini kashf qiling.',
    paragraphs: [
      'In the modern era of computing, artificial intelligence is reshaping how humans acquire foreign languages. Rather than memorizing endless grammar tables from dusty textbooks, students now interact with intelligent speech engines capable of analyzing vocal nuances in real time.',
      'When you practice speaking with an intelligent companion, you receive immediate feedback on syllable stress and phonetic clarity. This continuous feedback loop eliminates the fear of making mistakes in public. Consequently, learners build confidence twice as fast as traditional classroom methods.',
      'Language is not simply an assortment of syntactic rules. It is a bridge between minds, cultures, and global opportunities. Embracing technological tools allows anyone, anywhere, to unlock conversational fluency.'
    ],
    // Words lookup dictionary for instant inspector
    wordLookup: {
      'computing': { ipa: '/kəmˈpjuː.tɪŋ/', uz: 'Hisoblash texnologiyalari', pos: 'noun' },
      'artificial': { ipa: '/ˌɑːr.t̬əˈfɪʃ.əl/', uz: 'Sun‘iy', pos: 'adjective' },
      'intelligence': { ipa: '/ɪnˈtel.ə.dʒəns/', uz: 'Aql-idrok, intellekt', pos: 'noun' },
      'reshaping': { ipa: '/ˌriːˈʃeɪp.ɪŋ/', uz: 'Qayta shakllantirmoqda', pos: 'verb' },
      'acquire': { ipa: '/əˈkwaɪɚ/', uz: 'O‘zlashtirmoq, egallamoq', pos: 'verb' },
      'nuances': { ipa: '/ˈnuː.ɑːns.ɪz/', uz: 'Nozikliklar, mayda farqlar', pos: 'noun' },
      'vocal': { ipa: '/ˈvoʊ.kəl/', uz: 'Ovozli, vokal', pos: 'adjective' },
      'syllable': { ipa: '/ˈsɪl.ə.bəl/', uz: 'Bo‘g‘in', pos: 'noun' },
      'stress': { ipa: '/stres/', uz: 'Urg‘u', pos: 'noun' },
      'phonetic': { ipa: '/fəˈnet̬.ɪk/', uz: 'Fonetik, tovushga oid', pos: 'adjective' },
      'clarity': { ipa: '/ˈkler.ə.t̬i/', uz: 'Tiniqlik, aniqlik', pos: 'noun' },
      'continuous': { ipa: '/kənˈtɪn.ju.əs/', uz: 'Doimiy, to‘xtovsiz', pos: 'adjective' },
      'loop': { ipa: '/luːp/', uz: 'Halqa, zanjir', pos: 'noun' },
      'eliminates': { ipa: '/ɪˈlɪm.ə.neɪts/', uz: 'Yo‘qotadi, bartaraf etadi', pos: 'verb' },
      'consequently': { ipa: '/ˈkɑːn.sə.kwənt.li/', uz: 'Natijada, binobarin', pos: 'adverb' },
      'syntactic': { ipa: '/sɪnˈtæk.tɪk/', uz: 'Sintaktik, gap tuzilishiga oid', pos: 'adjective' },
      'assortment': { ipa: '/əˈsɔːrt.mənt/', uz: 'To‘plam, majmua', pos: 'noun' },
      'embracing': { ipa: '/ɪmˈbreɪs.ɪŋ/', uz: 'Qabul qilish, bag‘riga olish', pos: 'verb' },
      'fluency': { ipa: '/ˈfluː.ən.si/', uz: 'Erkin va ravon so‘zlashuv', pos: 'noun' }
    },
    quiz: [
      {
        question: 'What is replacing dusty textbooks according to the text?',
        questionUz: 'Matnga ko‘ra, eski darsliklarning o‘rnini nima egallamoqda?',
        options: [
          'Intelligent speech engines and AI companions',
          'Only written paper worksheets',
          'Silent reading libraries',
          'Memorizing long word lists'
        ],
        correct: 0,
        explanationUz: 'Sun‘iy intellekt va nutq tizimlari an‘anaviy darsliklarning o‘rnini bosmoqda.'
      },
      {
        question: 'Why do learners build confidence twice as fast with AI?',
        questionUz: 'Nima uchun o‘rganuvchilar AI bilan ikki barobar tezroq ishonch hosil qiladilar?',
        options: [
          'Because they can skip learning grammar completely',
          'Because instant feedback removes the fear of making mistakes in public',
          'Because they don’t need to speak at all',
          'Because computers never give any feedback'
        ],
        correct: 1,
        explanationUz: 'Bir zumda beriladigan tahlil jamoat oldida xato qilish qo‘rquvini yo‘qotadi.'
      },
      {
        question: 'How does the author define language in the final paragraph?',
        questionUz: 'Muallif oxirgi xatboshida tilga qanday ta‘rif beradi?',
        options: [
          'Merely a list of punctuation marks',
          'A strict mechanical code for computers',
          'A bridge between minds, cultures, and global opportunities',
          'An impossible challenge for humans'
        ],
        correct: 2,
        explanationUz: 'Til — bu onglarni, madaniyatlarni va global imkoniyatlarni bog‘lovchi ko‘prikdir.'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'The Psychology of Deep Focus in the Digital Age',
    titleUz: 'Raqamli Davrda Chuqur Diqqat Psixologiyasi',
    level: 'Advanced (B2/C1)',
    readTime: '4 min',
    wordCount: 195,
    summary: 'Master the art of unbroken concentration to absorb complex linguistic structures effortlessly.',
    summaryUz: 'Murakkab til tuzilmalarini osonlikcha o‘zlashtirish uchun bo‘linmas diqqat san‘atini egallang.',
    paragraphs: [
      'In a world saturated with notifications and micro-distractions, the ability to cultivate deep focus has become a superpower. Cognitive neuroscientists emphasize that our brains require uninterrupted stretches of time to encode new neural pathways.',
      'When acquiring a complex language like English, superficial skimming produces fleeting retention. In contrast, immersion in high-intensity practice sessions—whether through fast-paced typing games or active speech simulation—triggers profound neuroplasticity.',
      'To accelerate your fluency journey, design friction-free daily routines. Silence non-essential notifications, engage with challenging interactive exercises, and reward your brain for small milestones. Consistency over time outperforms erratic bursts of effort every single time.'
    ],
    wordLookup: {
      'saturated': { ipa: '/ˈsætʃ.ə.reɪ.t̬ɪd/', uz: 'To‘yinib ketgan, to‘la', pos: 'adjective' },
      'cultivate': { ipa: '/ˈkʌl.tə.veɪt/', uz: 'Rivojlantirmoq, shakllantirmoq', pos: 'verb' },
      'cognitive': { ipa: '/ˈkɑːɡ.nə.t̬ɪv/', uz: 'Kognitiv, idrokka oid', pos: 'adjective' },
      'neuroscientists': { ipa: '/ˌnʊr.oʊˈsaɪən.tɪsts/', uz: 'Miya faoliyati bo‘yicha olimlar', pos: 'noun' },
      'uninterrupted': { ipa: '/ˌʌn.ɪn.t̬əˈrʌp.tɪd/', uz: 'Uzluksiz, bo‘linmagan', pos: 'adjective' },
      'encode': { ipa: '/ɪnˈkoʊd/', uz: 'Miyada mustahkamlab saqlamoq', pos: 'verb' },
      'superficial': { ipa: '/ˌsuː.pɚˈfɪʃ.əl/', uz: 'Yuzaki, sayoz', pos: 'adjective' },
      'skimming': { ipa: '/ˈskɪm.ɪŋ/', uz: 'Yuzaki ko‘z yugurtirish', pos: 'noun' },
      'fleeting': { ipa: '/ˈfliː.t̬ɪŋ/', uz: 'Tez o‘tuvchi, qisqa muddatli', pos: 'adjective' },
      'retention': { ipa: '/rɪˈten.ʃən/', uz: 'Xotirada saqlab qolish', pos: 'noun' },
      'immersion': { ipa: '/ɪˈmɝː.ʒən/', uz: 'Butunlay sho‘ng‘ish, chuqur kirishish', pos: 'noun' },
      'neuroplasticity': { ipa: '/ˌnʊr.oʊ.plæsˈtɪs.ə.t̬i/', uz: 'Neyroplastiklik (miyaning o‘zgarish qobiliyati)', pos: 'noun' },
      'friction': { ipa: '/ˈfrɪk.ʃən/', uz: 'Qarshilik, qiyinchilik', pos: 'noun' },
      'erratic': { ipa: '/ɪˈræt̬.ɪk/', uz: 'Betartib, beqaror', pos: 'adjective' },
      'milestones': { ipa: '/ˈmaɪl.stoʊnz/', uz: 'Bosqichlar, muhim bekatlar', pos: 'noun' }
    },
    quiz: [
      {
        question: 'What do cognitive neuroscientists state brains need to encode neural pathways?',
        questionUz: 'Neyroolimlar yangi neyron yo‘llarini hosil qilish uchun miyaga nima kerak deb ta‘kidlashadi?',
        options: [
          'Uninterrupted stretches of focused time',
          'Constant multitasking on mobile phones',
          'Listening to background noise all day',
          'Sleeping without any study'
        ],
        correct: 0,
        explanationUz: 'Uzluksiz bo‘linmagan diqqat vaqt oralig‘i yangi xotira izlarini mustahkamlaydi.'
      },
      {
        question: 'What beats erratic bursts of effort every single time?',
        questionUz: 'Har doim betartib urinishlardan nimasi ustun keladi?',
        options: [
          'Pure luck',
          'Consistency over time',
          'Studying only once a month',
          'Ignoring all exercises'
        ],
        correct: 1,
        explanationUz: 'Vaqt davomidagi izchillik va doimiylik (consistency) betartib harakatlardan ustundir.'
      }
    ]
  }
];
