// Writing Workshop data: Speed typing texts, Error Surgeon grammar puzzles, and Sentence Upgrade

export const SPEED_TYPING_PASSAGES = [
  {
    id: 'st-1',
    title: 'The Cyber Frontier',
    uz: 'Kiber Hudud',
    text: 'Technology empowers learners across the globe to connect, collaborate, and conquer linguistic barriers in real time.',
    difficulty: 'Normal'
  },
  {
    id: 'st-2',
    title: 'Architects of Tomorrow',
    uz: 'Ertangi Kun Me‘morlari',
    text: 'Every line of code and every mastered sentence builds an unshakeable foundation for international mastery.',
    difficulty: 'Normal'
  },
  {
    id: 'st-3',
    title: 'Neuroplasticity and Speed',
    uz: 'Neyroplastiklik va Tezlik',
    text: 'Rapid keystrokes synchronize muscle memory with cognitive vocabulary retention, accelerating human speech fluency.',
    difficulty: 'Expert'
  }
];

export const ERROR_SURGEON_PUZZLES = [
  {
    id: 'es-1',
    sentenceParts: [
      { text: 'She', isError: false },
      { text: 'have', isError: true, correct: 'has', reasonUz: 'Uchinchi shaxs birlikda (She/He/It) "have" emas, "has" ishlatiladi.' },
      { text: 'been', isError: false },
      { text: 'learning', isError: false },
      { text: 'English', isError: false },
      { text: 'for', isError: false },
      { text: 'two', isError: false },
      { text: 'years.', isError: false }
    ],
    fullSentence: 'She have been learning English for two years.',
    correctedSentence: 'She has been learning English for two years.',
    ruleTitle: 'Subject-Verb Agreement',
    ruleTitleUz: 'Ega va Kesim Moslashuvi'
  },
  {
    id: 'es-2',
    sentenceParts: [
      { text: 'I', isError: false },
      { text: 'look', isError: false },
      { text: 'forward', isError: false },
      { text: 'to', isError: false },
      { text: 'meet', isError: true, correct: 'meeting', reasonUz: '"Look forward to" iborasidan keyin fe‘lga -ing qo‘shiladi (to meeting).' },
      { text: 'you', isError: false },
      { text: 'at', isError: false },
      { text: 'the', isError: false },
      { text: 'summit.', isError: false }
    ],
    fullSentence: 'I look forward to meet you at the summit.',
    correctedSentence: 'I look forward to meeting you at the summit.',
    ruleTitle: 'Preposition + Gerund',
    ruleTitleUz: 'Predlogdan keyingi Gerundiy (-ing)'
  },
  {
    id: 'es-3',
    sentenceParts: [
      { text: 'Despite', isError: false },
      { text: 'of', isError: true, correct: '', reasonUz: '"Despite" so‘zidan keyin "of" ishlatilmaydi. "In spite of" yoki faqat "Despite" bo‘ladi.' },
      { text: 'the', isError: false },
      { text: 'heavy', isError: false },
      { text: 'rain,', isError: false },
      { text: 'our', isError: false },
      { text: 'flight', isError: false },
      { text: 'departed', isError: false },
      { text: 'on', isError: false },
      { text: 'schedule.', isError: false }
    ],
    fullSentence: 'Despite of the heavy rain, our flight departed on schedule.',
    correctedSentence: 'Despite the heavy rain, our flight departed on schedule.',
    ruleTitle: 'Conjunction Usage',
    ruleTitleUz: 'Bog‘lovchi Ishlatish Qoidasi'
  }
];

export const SENTENCE_UPGRADES = [
  {
    id: 'su-1',
    basic: 'I think this idea is good.',
    basicUz: 'Men bu g‘oya yaxshi deb o‘ylayman.',
    upgrades: [
      {
        text: 'From my perspective, this innovative proposal holds immense promise.',
        uz: 'Mening nuqtai nazarimdan, bu innovatsion taklif juda katta istiqbolga ega.',
        level: 'C1 Academic'
      },
      {
        text: 'I strongly believe this strategy is highly effective and viable.',
        uz: 'Men bu strategiya yuqori samara va hayotiylikka ega ekaniga qat‘iy ishonaman.',
        level: 'B2 Professional'
      }
    ]
  },
  {
    id: 'su-2',
    basic: 'We need to fix this problem fast.',
    basicUz: 'Biz bu muammoni tez hal qilishimiz kerak.',
    upgrades: [
      {
        text: 'It is imperative that we promptly resolve this critical bottleneck.',
        uz: 'Ushbu jiddiy to‘siqni zudlik bilan bartaraf etishimiz o‘ta zarurdir.',
        level: 'C1 Corporate'
      },
      {
        text: 'We should address this urgent challenge without delay.',
        uz: 'Biz ushbu kechiktirib bo‘lmas vazifani paysalga solmasdan hal qilishimiz lozim.',
        level: 'B2 Business'
      }
    ]
  }
];
