import { NextRequest, NextResponse } from "next/server";
import { answerAdmissionQuestion, logAIResponse } from "@/lib/ai/assistant";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { question, userId, studentId } = await request.json();

    if (!question || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: question, userId" },
        { status: 400 }
      );
    }

    // Fetch student context if provided
    let studentContext = null;
    if (studentId) {
      studentContext = await prisma.student.findUnique({
        where: { id: studentId },
      });
    }

    // Get AI response
    const { answer, sources, model } = await answerAdmissionQuestion(
      question,
      studentContext
        ? {
            grade: studentContext.grade,
            country: studentContext.country,
            interests: studentContext.interests,
            gpa: studentContext.gpa ?? undefined,
            satScore: studentContext.satScore ?? undefined,
            ieltsBand: studentContext.ieltsBand ?? undefined,
          }
        : undefined
    );

    // Log the response for monitoring
    await logAIResponse(userId, question, answer, sources);

    return NextResponse.json({
      answer,
      sources,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in answer-question endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}