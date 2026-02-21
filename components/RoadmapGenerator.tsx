'use client';

import { useState } from "react";
import { Loader2, ChevronRight, MapPin, BookOpen, Trophy } from "lucide-react";

interface StudentProfile {
  grade: number;
  country: string;
  interests: string[];
  gpa?: number;
  satScore?: number;
  ieltsBand?: number;
}

interface RoadmapGeneratorProps {
  userId: string;
  studentId?: string;
  onRoadmapGenerated?: (roadmap: string) => void;
}

const COUNTRIES = [
  "India",
  "Nigeria",
  "Pakistan",
  "Bangladesh",
  "Kenya",
  "Philippines",
  "Vietnam",
  "Brazil",
  "Mexico",
  "Indonesia",
  "Other",
];

const INTERESTS = [
  "STEM",
  "Engineering",
  "Computer Science",
  "Business",
  "Medicine",
  "Law",
  "Humanities",
  "Arts & Design",
  "Environmental Science",
  "Social Sciences",
];

export function RoadmapGenerator({
  userId,
  studentId,
  onRoadmapGenerated,
}: RoadmapGeneratorProps) {
  const [step, setStep] = useState<
    "profile" | "universities" | "generating" | "result"
  >("profile");
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    grade: 10,
    country: "",
    interests: [],
  });
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddInterest = (interest: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleGenerateRoadmap = async () => {
    if (!studentId) {
      alert("Student ID is required");
      return;
    }

    setStep("generating");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          studentId,
          targetUniversityIds: selectedUniversities,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const data = await response.json();
      setRoadmap(data.roadmap);
      setStep("result");

      if (onRoadmapGenerated) {
        onRoadmapGenerated(data.roadmap);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate roadmap. Please try again.");
      setStep("universities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['Profile', 'Universities', 'Generating', 'Roadmap'].map(
              (label, idx) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      idx <=
                      (step === "profile"
                        ? 0
                        : step === "universities"
                          ? 1
                          : step === "generating"
                            ? 2
                            : 3)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  {idx < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        idx <
                        (step === "profile"
                          ? 0
                          : step === "universities"
                            ? 1
                            : step === "generating"
                              ? 2
                              : 3)
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Step 1: Profile */}
        {step === "profile" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Tell us about yourself
            </h2>

            {/* Grade */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Grade
              </label>
              <select
                value={studentProfile.grade}
                onChange={(e) =>
                  setStudentProfile({
                    ...studentProfile,
                    grade: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Country
              </label>
              <select
                value={studentProfile.country}
                onChange={(e) =>
                  setStudentProfile({
                    ...studentProfile,
                    country: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <BookOpen className="inline w-4 h-4 mr-1" />
                What are your interests? (Select at least one)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleAddInterest(interest)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      studentProfile.interests.includes(interest)
                        ? "bg-blue-500 text-white ring-2 ring-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA (optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  max="4"
                  value={studentProfile.gpa || ""}
                  onChange={(e) =>
                    setStudentProfile({
                      ...studentProfile,
                      gpa: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g., 3.8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SAT (optional)
                </label>
                <input
                  type="number"
                  value={studentProfile.satScore || ""}
                  onChange={(e) =>
                    setStudentProfile({
                      ...studentProfile,
                      satScore: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 1500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IELTS (optional)
                </label>
                <input
                  type="number"
                  step="0.5"
                  max="9"
                  value={studentProfile.ieltsBand || ""}
                  onChange={(e) =>
                    setStudentProfile({
                      ...studentProfile,
                      ieltsBand: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 7.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={() =>
                studentProfile.country && studentProfile.interests.length > 0
                  ? setStep("universities")
                  : alert("Please fill in all required fields")
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Universities */}
        {step === "universities" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Select target universities
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Placeholder for university selector - in production, fetch from database */}
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>University database integration coming soon</p>
                <p className="text-sm mt-1">
                  Search and select from 500+ universities
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep("profile")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleGenerateRoadmap}
                disabled={selectedUniversities.length === 0}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate My Roadmap <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === "generating" && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Creating Your Roadmap...
            </h2>
            <p className="text-gray-600">
              Our AI advisor is crafting a personalized college admission
              strategy for you. This may take a moment...
            </p>
          </div>
        )}

        {/* Step 4: Result */}
        {step === "result" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Your Personalized Roadmap
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {roadmap}
            </div>
            <button
              onClick={() => setStep("profile")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Create Another Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}