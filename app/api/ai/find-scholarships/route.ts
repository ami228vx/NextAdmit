import { NextRequest, NextResponse } from "next/server";
import { findScholarships, logAIResponse } from "@/lib/ai/assistant";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, studentId, targetCountries } = await request.json();

    if (!userId || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields: userId, studentId" },
        { status: 400 }
      );
    }

    // Fetch student profile
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Find scholarships
    const { scholarships, recommendations } = await findScholarships(
      {
        grade: student.grade,
        country: student.country,
        interests: student.interests,
        gpa: student.gpa ?? undefined,
        satScore: student.satScore ?? undefined,
        ieltsBand: student.ieltsBand ?? undefined,
      },
      targetCountries
    );

    // Log the response
    await logAIResponse(
      userId,
      `Find scholarships for student from ${student.country}`,
      JSON.stringify(scholarships),
      []
    );

    return NextResponse.json({
      scholarships,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in find-scholarships endpoint:", error);
    return NextResponse.json(
      { error: "Failed to find scholarships. Please try again." },
      { status: 500 }
    );
  }
}