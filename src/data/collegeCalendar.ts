export interface CollegeHoliday {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  days: number;
  category: 'festival' | 'gazetted' | 'vacation' | 'exam' | 'event';
  description: string;
}

export interface SemesterInfo {
  id: string;
  name: string;
  type: 'odd' | 'even';
  months: string;
  startMonth: number; // 1-12
  endMonth: number;
  totalWorkingDaysApprox: number;
  totalLecturesApprox: number;
  examMonth: string;
  subjects: string[];
}

export const SEMESTER_DATA: SemesterInfo[] = [
  {
    id: 'odd-sem-1-3-5',
    name: 'Odd Semester (Sem I, III, V, VII, IX)',
    type: 'odd',
    months: 'July – December',
    startMonth: 7,
    endMonth: 12,
    totalWorkingDaysApprox: 94,
    totalLecturesApprox: 470,
    examMonth: 'December',
    subjects: [
      'Constitutional Law I & Precedents',
      'Law of Crimes (BNS / IPC)',
      'Law of Contracts & Specific Relief',
      'Jurisprudence & Legal Theory',
      'Family Law I (Hindu Law)',
      'Legal Language & Court Drafting',
    ],
  },
  {
    id: 'even-sem-2-4-6',
    name: 'Even Semester (Sem II, IV, VI, VIII, X)',
    type: 'even',
    months: 'January – June',
    startMonth: 1,
    endMonth: 6,
    totalWorkingDaysApprox: 92,
    totalLecturesApprox: 460,
    examMonth: 'May – June',
    subjects: [
      'Constitutional Law II (Fundamental Rights & Writs)',
      'Law of Criminal Procedure (BNSS / CrPC)',
      'Law of Torts & Consumer Protection',
      'Family Law II (Muslim & Succession Law)',
      'Law of Evidence (BSA)',
      'Moot Court & Advocacy Ethics',
    ],
  },
];

export const PATNA_LAW_COLLEGE_HOLIDAYS_2026: CollegeHoliday[] = [
  {
    id: 'h-1',
    name: 'New Year Day',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    days: 1,
    category: 'gazetted',
    description: 'Patna University closed for New Year.',
  },
  {
    id: 'h-2',
    name: 'Makar Sankranti',
    startDate: '2026-01-14',
    endDate: '2026-01-15',
    days: 2,
    category: 'festival',
    description: 'Traditional harvest festival in Bihar with Dahi-Chura.',
  },
  {
    id: 'h-3',
    name: 'Republic Day & Saraswati Puja',
    startDate: '2026-01-26',
    endDate: '2026-01-26',
    days: 1,
    category: 'gazetted',
    description: 'National holiday & Basant Panchami puja on campus.',
  },
  {
    id: 'h-4',
    name: 'Maha Shivratri',
    startDate: '2026-02-16',
    endDate: '2026-02-16',
    days: 1,
    category: 'festival',
    description: 'Official university holiday.',
  },
  {
    id: 'h-5',
    name: 'Holi Festival Break',
    startDate: '2026-03-03',
    endDate: '2026-03-07',
    days: 5,
    category: 'festival',
    description: 'Official 5-day Spring festival of colors holiday break.',
  },
  {
    id: 'h-6',
    name: 'Bihar Diwas',
    startDate: '2026-03-22',
    endDate: '2026-03-22',
    days: 1,
    category: 'gazetted',
    description: 'Statehood day of Bihar celebrations.',
  },
  {
    id: 'h-7',
    name: 'Ram Navami',
    startDate: '2026-03-27',
    endDate: '2026-03-27',
    days: 1,
    category: 'festival',
    description: 'Gazetted festival holiday.',
  },
  {
    id: 'h-8',
    name: 'Eid-ul-Fitr',
    startDate: '2026-03-20',
    endDate: '2026-03-21',
    days: 2,
    category: 'festival',
    description: 'University closed for Eid festival.',
  },
  {
    id: 'h-9',
    name: 'Dr. B.R. Ambedkar Jayanti',
    startDate: '2026-04-14',
    endDate: '2026-04-14',
    days: 1,
    category: 'gazetted',
    description: 'Architect of Indian Constitution commemoration.',
  },
  {
    id: 'h-10',
    name: 'Buddha Purnima',
    startDate: '2026-05-01',
    endDate: '2026-05-01',
    days: 1,
    category: 'gazetted',
    description: 'Gazetted holiday.',
  },
  {
    id: 'h-11',
    name: 'Summer Vacation Break',
    startDate: '2026-06-01',
    endDate: '2026-06-25',
    days: 25,
    category: 'vacation',
    description: 'Annual summer recess for students and faculty.',
  },
  {
    id: 'h-12',
    name: 'Muharram',
    startDate: '2026-06-26',
    endDate: '2026-06-26',
    days: 1,
    category: 'gazetted',
    description: 'Gazetted holiday.',
  },
  {
    id: 'h-13',
    name: 'Independence Day',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    days: 1,
    category: 'gazetted',
    description: 'Flag hoisting at Rani Ghat campus & university auditorium.',
  },
  {
    id: 'h-14',
    name: 'Raksha Bandhan & Janmashtami',
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    days: 2,
    category: 'festival',
    description: 'Festival holidays.',
  },
  {
    id: 'h-15',
    name: 'Mahatma Gandhi Jayanti',
    startDate: '2026-10-02',
    endDate: '2026-10-02',
    days: 1,
    category: 'gazetted',
    description: 'National holiday.',
  },
  {
    id: 'h-16',
    name: 'Durga Puja & Dussehra Vacation',
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    days: 8,
    category: 'festival',
    description: 'Grand festive break in Bihar for Durga Puja (Maha Saptami to Vijayadashami).',
  },
  {
    id: 'h-17',
    name: 'Diwali & Chhath Puja Grand Holidays',
    startDate: '2026-11-08',
    endDate: '2026-11-17',
    days: 10,
    category: 'festival',
    description: 'The paramount cultural and religious celebration of Bihar. Rani Ghat on river Ganga hosts millions of devotees right in front of college.',
  },
  {
    id: 'h-18',
    name: 'Guru Nanak Jayanti & Kartik Purnima',
    startDate: '2026-11-24',
    endDate: '2026-11-24',
    days: 1,
    category: 'gazetted',
    description: 'Holy dip at Rani Ghat & university holiday.',
  },
  {
    id: 'h-19',
    name: 'Christmas & Winter Recess',
    startDate: '2026-12-24',
    endDate: '2026-12-31',
    days: 8,
    category: 'vacation',
    description: 'Year-end winter vacation before odd semester examinations.',
  },
];

export const COLLEGE_TIMETABLE_RULES = {
  collegeName: 'Patna Law College (Constituent College of Patna University)',
  location: 'Rani Ghat Road, Mahendru, Patna - 800006',
  workingDaysPerWeek: 6, // Monday to Saturday
  lecturesPerDay: 5,
  sundayStatus: 'Weekly Off',
  mandatoryAttendancePercentage: 75,
  condonationLimitPercentage: 66, // 66% to 74% with Medical Certificate & Dean Permission
  debarredThresholdPercentage: 65, // Below 66% strictly debarred from Semester Exams under BCI Rules
};
