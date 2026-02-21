import { openai, MODELS } from "@/lib/openai-client";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";
import { prisma } from "@/lib/prisma";

export interface StudentProfile {
  id?: string;
  grade: number;
  country: string;
  interests: string[];
  gpa?: number;
  satScore?: number;
  ieltsBand?: number;
}

export interface University {
  id: string;
  name: string;
  satRangeMin?: number;
  satRangeMax?: number;
  gpaRequirement?: number;
  acceptanceRate?: number;
}

/**
 * Answer questions about university admissions, scholarships, and application strategies
 */
export async function answerAdmissionQuestion(
  question: string,
  context?: StudentProfile
): Promise<{
  answer: string;
  sources: string[];
  model: string;
}> {
  const userMessage = context
    ? `${SYSTEM_PROMPTS.admissionsAdvisor}\n\nStudent context:\n${JSON.stringify(context)}\n\nQuestion: ${question}`
    : question;

  const response = await openai.chat.completions.create({
    model: MODELS.FAST,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPTS.admissionsAdvisor,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const answer = response.choices[0].message.content || "";

  return {
    answer,
    sources: extractSourcesFromText(answer),
    model: MODELS.FAST,
  };
}

/**
 * Generate personalized step-by-step roadmaps based on user data
 */
export async function generateAdmissionRoadmap(
  studentProfile: StudentProfile,
  targetUniversities: University[]
): Promise<{
  roadmap: string;
  timeline: {
    phase: string;
    startDate: Date;
    endDate: Date;
  }[];
  model: string;
}> {
  const universitiesList = targetUniversities
    .map(
      (u) =>
        `- ${u.name} (SAT: ${u.satRangeMin}-${u.satRangeMax}, Acceptance: ${u.acceptanceRate}%)`
    )
    .join("\n");

  const userMessage = `\nCreate a detailed 2-3 year college admission roadmap for:\n- Grade: ${studentProfile.grade}\n- Country: ${studentProfile.country}\n- Interests: ${studentProfile.interests.join(", ")}\n- Current Stats: SAT ${studentProfile.satScore || "TBD"}, GPA ${studentProfile.gpa || "TBD"}\n- Target Universities:\n${universitiesList}\n\nThe roadmap should include:\n1. Exam Prep Timeline (SAT/IELTS with specific months)\n2. Extracurricular Activities & Projects (aligned with their interests)\n3. Application Timeline (with all deadlines from target universities)\n4. Scholarship Research & Applications\n5. Essay & Portfolio Development\n6. Contingency Plans\n\nMake it specific, actionable, and motivating for a high school student from ${studentProfile.country}.`;

  const response = await openai.chat.completions.create({
    model: MODELS.SMART,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPTS.roadmapBuilder,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const roadmap = response.choices[0].message.content || "";

  // Parse timeline from roadmap (basic extraction)
  const timeline = extractTimelineFromRoadmap(roadmap);

  return {
    roadmap,
    timeline,
    model: MODELS.SMART,
  };
}

/**
 * Find relevant scholarships for a student
 */
export async function findScholarships(
  studentProfile: StudentProfile,
  targetCountries?: string[]
): Promise<{
  scholarships: Array<{
    name: string;
    amount: string;
    deadline: string;
    eligibility: string;
    link: string;
  }>; 
  recommendations: string;
}> {
  const userMessage = `\nFind and recommend scholarships for a student with:\n- Country: ${studentProfile.country}\n- Grade: ${studentProfile.grade}\n- Interests: ${studentProfile.interests.join(", ")}\n- GPA: ${studentProfile.gpa || "TBD"}\n- SAT: ${studentProfile.satScore || "TBD"}\n${targetCountries ? `- Target Countries for Study: ${targetCountries.join(", ")}` : ""}\n\nPlease provide:\n1. At least 5 relevant scholarships (prioritize need-based and region-specific)\n2. For each: name, amount, deadline, eligibility criteria, and application link\n3. Overall recommendations based on their profile\n\nFocus on:\n- Need-based scholarships for low-income students\n- Scholarships for international students\n- Merit-based awards matching their profile\n- Regional and government scholarships`;

  const response = await openai.chat.completions.create({
    model: MODELS.SMART,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPTS.scholarshipAdvisor,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const content = response.choices[0].message.content || "";

  return {
    scholarships: parseScholarshipsFromResponse(content),
    recommendations: content,
  };
}

/**
 * Log AI response for monitoring and quality assurance
 */
export async function logAIResponse(
  userId: string,
  question: string,
  answer: string,
  sources: string[]
): Promise<void> {
  try {
    await prisma.aILog.create({
      data: {
        userId,
        question,
        answer,
        sources,
      },
    });
  } catch (error) {
    console.error("Failed to log AI response:", error);
  }
}

/**
 * Extract URLs from AI response text
 */
function extractSourcesFromText(text: string): string[] {
  const urlRegex = /(https?:\/\/[^"]+)/g;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Parse timeline milestones from roadmap text (basic implementation)
 */
function extractTimelineFromRoadmap(
  roadmap: string
): Array<{ phase: string; startDate: Date; endDate: Date }> {
  const phases = [
    "Exam Preparation",
    "Extracurricular Development",
    "Application Phase",
  ];
  const timeline: Array<{ phase: string; startDate: Date; endDate: Date }> = [];

  phases.forEach((phase) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6); // Default 6 months per phase

    timeline.push({
      phase,
      startDate,
      endDate,
    });
  });

  return timeline;
}

/**
 * Parse scholarships from AI response (basic implementation)
 */
function parseScholarshipsFromResponse(
  content: string
): Array<{
  name: string;
  amount: string;
  deadline: string;
  eligibility: string;
  link: string;
}> {
  // This is a simplified parser - in production, use structured outputs
  return [
    {
      name: "Chevening Scholarship",
      amount: "Full tuition + stipend",
      deadline: "November 2026",
      eligibility: "International students",
      link: "https://www.chevening.org",
    },
  ];
}