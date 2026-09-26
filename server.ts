import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { PATNA_LAW_COLLEGE_HOLIDAYS_2026, SEMESTER_DATA, COLLEGE_TIMETABLE_RULES } from './src/data/collegeCalendar.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK for server-side calls
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for deterministic attendance math fallback
function calculateAttendanceSchedule(
  totalHeld: number,
  totalAttended: number,
  targetPercentage: number = 75,
  dailyLectures: number = 5,
  remainingDays: number = 24
) {
  const currentPercentage = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;
  const projectedLecturesInRemaining = remainingDays * dailyLectures;
  const finalTotalLectures = totalHeld + projectedLecturesInRemaining;
  
  // Formula: (totalAttended + x) / finalTotalLectures >= targetPercentage / 100
  // x >= (targetPercentage/100) * finalTotalLectures - totalAttended
  const minRequiredLectures = Math.max(
    0,
    Math.ceil((targetPercentage / 100) * finalTotalLectures - totalAttended)
  );

  const safeBunks = Math.max(0, projectedLecturesInRemaining - minRequiredLectures);
  const minDaysToAttend = Math.ceil(minRequiredLectures / dailyLectures);
  const safeDaysToBunk = Math.floor(safeBunks / dailyLectures);

  return {
    currentPercentage,
    projectedLecturesInRemaining,
    finalTotalLectures,
    minRequiredLectures,
    safeBunks,
    minDaysToAttend,
    safeDaysToBunk,
  };
}

// 1. API: Get Patna Law College Academic Calendar
app.get('/api/college-calendar', (_req, res) => {
  res.json({
    rules: COLLEGE_TIMETABLE_RULES,
    semesters: SEMESTER_DATA,
    holidays: PATNA_LAW_COLLEGE_HOLIDAYS_2026,
  });
});

// 2. API: AI Attendance & Calendar Schedule Planner
app.post('/api/attendance-ai/plan', async (req, res) => {
  try {
    const {
      totalHeld = 60,
      totalAttended = 45,
      semester = 'Odd Semester (July – December)',
      targetPercentage = 75,
      dailyLectures = 5,
      remainingWorkingDays = 26,
      plannedLeaves = '',
      subjects = [],
    } = req.body;

    const mathFallback = calculateAttendanceSchedule(
      Number(totalHeld),
      Number(totalAttended),
      Number(targetPercentage),
      Number(dailyLectures),
      Number(remainingWorkingDays)
    );

    // Call Gemini 3.8 Flash to intelligently arrange attendance based on Patna Law College Academic Calendar
    const prompt = `
You are the official Patna Law College (Patna University) AI Academic Dean & Attendance Strategist for BBA.LLB & LLB students.
Patna Law College (Rani Ghat, Mahendru, Patna) operates under Bar Council of India (BCI) rules with a strict 75% attendance criterion.

Student Profile:
- Total lectures held so far: ${totalHeld}
- Total lectures attended: ${totalAttended} (Current attendance: ${mathFallback.currentPercentage.toFixed(1)}%)
- Target attendance required: ${targetPercentage}% (BCI threshold)
- Academic Semester: ${semester}
- Daily lecture periods: ${dailyLectures} periods/day (Mon - Sat)
- Estimated remaining working days in the session: ${remainingWorkingDays} days (excluding Sundays and holidays)
- Student's planned leaves / constraints: "${plannedLeaves || 'None specified'}"
- Key Subjects: ${subjects.length > 0 ? subjects.join(', ') : 'Constitutional Law, Law of Crimes (BNS), Contracts, Jurisprudence, Family Law'}

Academic Calendar Context:
- Working Days: Monday to Saturday. Sunday is always Weekly Off.
- Big festive breaks in Bihar: Chhath Puja (10 days in Nov), Durga Puja (8 days in Oct), Holi (5 days in March).
- Patna University Condonation: Students between 66% and 74% can request a medical condonation certificate signed by the Dean/Principal. Under 66% is strictly debarred from semester exams.

Task:
Generate a comprehensive, mathematically accurate, and practical day-by-day attendance roadmap tailored to this student.
Arrange their remaining attendance so they comfortably reach or exceed ${targetPercentage}%, while taking into account their planned leaves and holidays.

Format the output strictly as valid JSON matching this schema (do NOT enclose in code blocks other than pure json if possible):
{
  "summary": {
    "currentPercentage": number,
    "status": "SAFE" | "CAUTION" | "DETENTION_RISK",
    "projectedFinalPercentage": number,
    "totalLecturesEnd": number,
    "minClassesMustAttend": number,
    "maxSafeBunksAllowed": number,
    "minDaysMustAttend": number,
    "safeDaysCanBunk": number
  },
  "strategyHeadline": "A catchy, motivating 1-sentence headline for this student",
  "weeklyPlan": [
    {
      "weekNumber": 1,
      "focus": "e.g., Core Foundations & Attendance Rebound",
      "daysToAttend": number,
      "daysToBunk": number,
      "daysSchedule": [
        {
          "day": "Monday",
          "action": "MUST_ATTEND" | "SAFE_BUNK" | "COLLEGE_HOLIDAY" | "OPTIONAL",
          "subjectOrEvent": "e.g. Constitutional Law (2 periods) + Law of Crimes",
          "notes": "Advice on why to attend or bunk this day"
        }
      ],
      "proTip": "Specific tip for this week"
    }
  ],
  "subjectWiseBalance": [
    {
      "subject": "string",
      "priority": "HIGH" | "MEDIUM" | "FLEXIBLE",
      "recommendation": "string"
    }
  ],
  "patnaCollegeRulesAdvice": [
    "Practical Patna Law College guideline or condonation step"
  ],
  "darindaMotivationalNote": "A warm, fraternal note from Founder Harshvardhan & Developer Zargham Hasan team"
}
`;

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            systemInstruction: 'You are an expert academic advisor for Patna Law College students. You calculate precise attendance fractions and format valid JSON.',
          },
        });

        const responseText = response.text || '';
        try {
          const parsed = JSON.parse(responseText.trim());
          return res.json({ success: true, plan: parsed, isAiGenerated: true });
        } catch {
          // Fall through to structured fallback if JSON parse fails
        }
      } catch (geminiErr: any) {
        console.warn('Gemini plan model call failed, using built-in calendar planner:', geminiErr?.message);
        // Fall through to structured fallback
      }
    }

    // Built-in intelligent fallback plan
    const fallbackPlan = {
      summary: {
        currentPercentage: Number(mathFallback.currentPercentage.toFixed(1)),
        status: mathFallback.currentPercentage >= 75 ? 'SAFE' : mathFallback.currentPercentage >= 66 ? 'CAUTION' : 'DETENTION_RISK',
        projectedFinalPercentage: targetPercentage,
        totalLecturesEnd: mathFallback.finalTotalLectures,
        minClassesMustAttend: mathFallback.minRequiredLectures,
        maxSafeBunksAllowed: mathFallback.safeBunks,
        minDaysMustAttend: mathFallback.minDaysToAttend,
        safeDaysCanBunk: mathFallback.safeDaysToBunk,
      },
      strategyHeadline: mathFallback.currentPercentage >= 75
        ? `Attendance on target! You have ${mathFallback.safeDaysToBunk} full days (${mathFallback.safeBunks} lectures) of buffer.`
        : `Action Required: Attend ${mathFallback.minDaysToAttend} of the remaining ${remainingWorkingDays} days to cross the mandatory 75% BCI bar.`,
      weeklyPlan: [
        {
          weekNumber: 1,
          focus: 'Attendance Rebound & Core Doctrine Lectures',
          daysToAttend: Math.min(5, mathFallback.minDaysToAttend),
          daysToBunk: Math.max(0, 6 - Math.min(5, mathFallback.minDaysToAttend)),
          daysSchedule: [
            { day: 'Monday', action: 'MUST_ATTEND', subjectOrEvent: 'Constitutional Law & Moot Court', notes: 'Mandatory roll call taken at 10:15 AM.' },
            { day: 'Tuesday', action: 'MUST_ATTEND', subjectOrEvent: 'Law of Crimes (BNS) & Evidence', notes: 'Core doctrine paper; keep high percentage.' },
            { day: 'Wednesday', action: mathFallback.safeBunks > 5 ? 'SAFE_BUNK' : 'MUST_ATTEND', subjectOrEvent: 'Jurisprudence & Family Law', notes: 'Safe for library study if needed.' },
            { day: 'Thursday', action: 'MUST_ATTEND', subjectOrEvent: 'Law of Contracts & Drafting', notes: 'Assignment submission day.' },
            { day: 'Friday', action: 'MUST_ATTEND', subjectOrEvent: 'Specialized Legal Studies', notes: 'Important case law discussion.' },
            { day: 'Saturday', action: mathFallback.safeBunks > 3 ? 'SAFE_BUNK' : 'MUST_ATTEND', subjectOrEvent: 'Tutorial & Legal Clinic', notes: 'Weekend buffer before Sunday.' },
          ],
          proTip: 'Sign the attendance register in the first 15 minutes of every lecture.',
        },
        {
          weekNumber: 2,
          focus: 'Consolidation & Planned Leave Buffer',
          daysToAttend: Math.min(4, mathFallback.minDaysToAttend),
          daysToBunk: Math.max(0, 6 - Math.min(4, mathFallback.minDaysToAttend)),
          daysSchedule: [
            { day: 'Monday', action: 'MUST_ATTEND', subjectOrEvent: 'Constitutional Law Writs', notes: 'High exam weightage.' },
            { day: 'Tuesday', action: 'MUST_ATTEND', subjectOrEvent: 'Criminal Procedure (BNSS)', notes: 'Vital for courtroom advocacy.' },
            { day: 'Wednesday', action: 'MUST_ATTEND', subjectOrEvent: 'Property & Contract Law', notes: 'Compulsory lecture credit.' },
            { day: 'Thursday', action: plannedLeaves ? 'SAFE_BUNK' : 'MUST_ATTEND', subjectOrEvent: plannedLeaves || 'Self-Study Buffer', notes: 'Planned leave utilization slot.' },
            { day: 'Friday', action: 'MUST_ATTEND', subjectOrEvent: 'Family Law Reforms', notes: 'Pre-exam test review.' },
            { day: 'Saturday', action: 'OPTIONAL', subjectOrEvent: 'Moot Society Preparations', notes: 'Relax along Rani Ghat or prepare files.' },
          ],
          proTip: 'Keep a physical copy of your medical certificate ready if applying for condonation.',
        },
      ],
      subjectWiseBalance: [
        { subject: 'Constitutional Law', priority: 'HIGH', recommendation: 'Minimum 80% recommended due to internal viva and writ petition draft submission.' },
        { subject: 'Law of Crimes (BNS)', priority: 'HIGH', recommendation: 'Never miss procedural case law discussions.' },
        { subject: 'Jurisprudence & Contracts', priority: 'MEDIUM', recommendation: 'Steady attendance of 75% is adequate.' },
        { subject: 'Legal Clinic & Moot Court', priority: 'FLEXIBLE', recommendation: 'Credits evaluated on practical participation.' },
      ],
      patnaCollegeRulesAdvice: [
        'Patna University Syndicate strictly enforces the 75% rule for B.B.A. LL.B. examination form clearance.',
        'Between 66% and 74%, the Principal may grant condonation on genuine medical grounds with a formal civil surgeon / government hospital certificate.',
        'Below 66%, no condonation is legally permissible under Bar Council of India Legal Education Rules.',
      ],
      darindaMotivationalNote: 'Harshvardhan and the Munna Darinda leadership team stand with every batchmate. Study smart, attend key lectures, and never let detention touch your admit card!',
    };

    return res.json({ success: true, plan: fallbackPlan, isAiGenerated: false });
  } catch (error: any) {
    console.error('AI attendance plan error:', error);
    res.status(500).json({ error: 'Failed to generate attendance schedule', details: error?.message });
  }
});

// 3. API: AI Interactive Attendance & Calendar Counselor Chat
app.post('/api/attendance-ai/chat', async (req, res) => {
  try {
    const { message, attendanceContext = {} } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { totalHeld = 60, totalAttended = 45, semester = 'Odd Sem' } = attendanceContext;
    const currentPercent = totalHeld > 0 ? ((totalAttended / totalHeld) * 100).toFixed(1) : '75.0';

    const prompt = `
You are the AI Academic Advisor & Calendar Strategist for Patna Law College (Patna University), Mahendru, Patna.
Fraternity / Student Hub: Munna Darinda Team (Founder: Harshvardhan, Developer: Zargham Hasan).

Student's Current Record:
- Total Lectures Held: ${totalHeld}
- Total Lectures Attended: ${totalAttended} (${currentPercent}%)
- Current Session: ${semester}
- Rules: Mandatory 75% BCI attendance, 66% to 74% medical condonation with Principal permission, under 66% debarred.
- Campus: Patna Law College, Rani Ghat, Mahendru, Patna - 800006.

Student Query:
"${message}"

Provide a warm, sharp, authoritative, and encouraging response in Hindi/Hinglish or English (matching user language).
If asked to draft a medical leave or condonation application, provide a formal, ready-to-print application addressed to the Principal of Patna Law College.
Keep explanations concise, legal-minded, and grounded in Patna University & BCI rules.
`;

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.4,
            systemInstruction: 'You are the intelligent academic & attendance mentor for Patna Law College students. You know the exact university holiday calendar and 75% rule.',
          },
        });

        const reply = response.text || 'I am ready to help you with your attendance and academic calendar!';
        return res.json({ reply });
      } catch (geminiChatErr: any) {
        console.warn('Gemini chat call failed, providing tailored advisor response:', geminiChatErr?.message);
        // Fall through to smart legal response
      }
    }

    // Smart fallback if API is busy or offline
    const isMedicalApp = /medical|application|leave|condonation|draft/i.test(message);
    const isHolidayQuery = /holiday|chutti|chhath|puja|calendar|diwali|vacation/i.test(message);

    if (isMedicalApp) {
      return res.json({
        reply: `Here is the official Condonation / Medical Leave Application format for Patna Law College:\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `To,\n` +
          `The Principal,\n` +
          `Patna Law College, Patna University,\n` +
          `Rani Ghat Road, Mahendru, Patna - 800006.\n\n` +
          `Date: ${new Date().toLocaleDateString('en-GB')}\n\n` +
          `Subject: Application for Condonation of Attendance Shortage on Medical Grounds under BCI & PU Rules\n\n` +
          `Respected Sir,\n\n` +
          `I, [Your Full Name], am a bonafide student of Patna Law College, enrolled in the BBA.LL.B. (5-Year Integrated Course), Batch 2026-31, Roll No: [Your Roll No].\n\n` +
          `I respectfully submit that I was unable to attend regular lectures between [Start Date] and [End Date] due to severe [Illness/Medical Condition]. I was undergoing medical treatment under the care of a registered medical practitioner.\n\n` +
          `As a result, my current cumulative attendance stands at ${currentPercent}%. In light of the Bar Council of India Legal Education Rules and Patna University Ordinances permitting condonation up to 9% on genuine medical grounds, I pray that you kindly grant condonation for the period of absence and permit me to fill the Semester Examination Form.\n\n` +
          `I have enclosed the Medical Certificate, prescription slips, and fitness certificate issued by the attending physician for your kind perusal.\n\n` +
          `Thanking you,\n\n` +
          `Yours obediently,\n` +
          `[Your Full Name]\n` +
          `BBA.LL.B. Batch 2026-31\n` +
          `Patna Law College, Mahendru, Patna\n` +
          `Contact: [Your Mobile Number]\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `📌 Pro-tip: Submit this along with an original OPD slip from PMCH (Patna Medical College Hospital) or any Registered Medical Officer for instant clearance.`,
      });
    }

    if (isHolidayQuery) {
      return res.json({
        reply: `📅 **Upcoming Major Breaks in Patna Law College Academic Calendar:**\n\n` +
          `1. **Diwali & Chhath Puja Grand Holidays:** Nov 08 – Nov 17 (10 Days). Rani Ghat right outside campus is the epicentre of holy arghya!\n` +
          `2. **Durga Puja Vacation:** Oct 18 – Oct 25 (8 Days).\n` +
          `3. **Winter Recess:** Dec 24 – Dec 31 (8 Days).\n` +
          `4. **Weekly Offs:** Every Sunday is an official holiday.\n\n` +
          `Would you like me to calculate your safe bunks around any of these dates?`,
      });
    }

    // Default response if API key not connected
    return res.json({
      reply: `Namaste! Based on your current attendance of ${currentPercent}% (${totalAttended}/${totalHeld} lectures held):\n\n` +
        `• 75% Rule Compliance: Patna Law College strictly follows Bar Council of India (BCI) rules. You need to keep your percentage at or above 75% before the semester examination forms are signed.\n` +
        `• Next Steps: Check your upcoming working days on the Patna Law College calendar. Avoid bunking core subjects like Constitutional Law and Bharatiya Nyaya Sanhita (BNS).\n` +
        `• If you need an official Medical Leave or Condonation Application draft, ask: "Draft condonation application for Principal" and I will format it for you!`,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process AI chat query', details: error?.message });
  }
});

// Vite middleware in dev / static in production
const isDev = process.env.NODE_ENV === 'development';
const distPath = path.resolve(__dirname, 'dist');
const distExists = fs.existsSync(distPath);

if (!isDev && distExists) {
  // Production / Cloud Run mode: serve pre-built dist
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  // Development mode: mount Vite dev middleware
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
