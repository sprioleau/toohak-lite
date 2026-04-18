export interface Question {
  id: string;
  title: string;
  verse: string;
  verseRef: string;
  description: string;
}

export const THE_FIVE_TS: Question[] = [
  {
    id: 'time',
    title: 'Time',
    verse: 'Redeeming the time, because the days are evil.',
    verseRef: 'Ephesians 5:16',
    description: 'Prioritize spiritual, eternal pursuits over temporary ones. How well do you steward your time for Kingdom purposes?',
  },
  {
    id: 'talent',
    title: 'Talent',
    verse: 'Each of you should use whatever gift you have received to serve others, as faithful stewards of God\'s grace.',
    verseRef: '1 Peter 4:10',
    description: 'Utilizing unique skills, abilities, and spiritual gifts to serve God and others.',
  },
  {
    id: 'treasure',
    title: 'Treasure',
    verse: 'Do not store up for yourselves treasures on earth... but store up for yourselves treasures in heaven.',
    verseRef: 'Matthew 6:19-20',
    description: 'Managing financial resources, giving generously, and avoiding excessive debt as caretakers of God\'s money.',
  },
  {
    id: 'temple',
    title: 'Temple',
    verse: 'Do you not know that your bodies are temples of the Holy Spirit, who is in you?',
    verseRef: '1 Corinthians 6:19-20',
    description: 'Honoring God by caring for your physical body as a temple of the Holy Spirit.',
  },
  {
    id: 'testimony',
    title: 'Testimony',
    verse: 'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.',
    verseRef: 'Matthew 5:16',
    description: 'Sharing your faith and the story of God\'s goodness to influence others for Christ.',
  },
];
