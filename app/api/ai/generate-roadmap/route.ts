import { NextRequest, NextResponse } from "next/server";
import {
  generateAdmissionRoadmap,
  logAIResponse,
} from "@/lib/ai/assistant";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, studentId, targetUniversityIds } =
      await request.json();

    if (!userId || !studentId || !targetUniversityIds) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, studentId, targetUniversityIds",
        },
        { status: 400 }
      );
    }

    // Fetch student profile
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Fetch target universities
    const universities = await prisma.university.findMany({
      where: {
        id: {
          in: targetUniversityIds,
        },
      },
    });

    if (universities.length === 0) {
      return NextResponse.json(
        { error: "No universities found" },
        { status: 404 }
      );
    }

    // Generate roadmap
    const { roadmap, timeline, model } = await generateAdmissionRoadmap(
      {
        id: student.id,
        grade: student.grade,
        country: student.country,
        interests: student.interests,
        gpa: student.gpa ?? undefined,
        satScore: student.satScore ?? undefined,
        ieltsBand: student.ieltsBand ?? undefined,
      },
      universities.map((u) => ({
        id: u.id,
        name: u.name,
        satRangeMin: u.satRangeMin ?? undefined,
        satRangeMax: u.satRangeMax ?? undefined,
        gpaRequirement: u.gpaRequirement ?? undefined,
        acceptanceRate: u.acceptanceRate ?? undefined,
      }))
    );

    // Save roadmap to database
    const savedRoadmap = await prisma.roadmap.create({
      data: {
        studentId,
        userId,
        title: `${student.user.name}'s College Roadmap`,
        content: roadmap,
      },
    });

    // Log the response
    await logAIResponse(
      userId,
      `Generate roadmap for ${universities.map((u) => u.name).join(", ")}`,
      roadmap,
      []
    );

    return NextResponse.json({
      id: savedRoadmap.id,
      roadmap,
      timeline,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in generate-roadmap endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap. Please try again." },
      { status: 500 }
    );
  }
}