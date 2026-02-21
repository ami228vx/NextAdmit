import { AdmissionAssistant } from "@/components/AdmissionAssistant";
import { RoadmapGenerator } from "@/components/RoadmapGenerator";

export default function Home() {
  // TODO: Replace with actual user session
  const userId = "demo-user-123";
  const studentId = "demo-student-123";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-900">
            🎓 Next Admit
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            AI-Powered University Admissions for Every Student
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Get personalized roadmaps for applying to top universities with
            guidance on exams, scholarships, and applications.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Personalized Roadmaps
                </h3>
                <p className="text-slate-600">
                  Get step-by-step guidance tailored to your grade, country, and
                  university goals.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Exam Preparation
                </h3>
                <p className="text-slate-600">
                  SAT and IELTS prep timelines with resources and score
                  benchmarks for your target universities.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Scholarship Finder
                </h3>
                <p className="text-slate-600">
                  Discover scholarships and financial aid options tailored to
                  your background and needs.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  AI Advisor
                </h3>
                <p className="text-slate-600">
                  Ask questions about admissions, essays, extracurriculars, and
                  get expert guidance 24/7.
                </p>
              </div>
            </div>

            {/* Roadmap Generator */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Get Started
              </h2>
              <RoadmapGenerator userId={userId} studentId={studentId} />
            </div>
          </div>

          {/* Right column: Assistant Chat */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Chat with Advisor
            </h2>
            <div className="sticky top-4">
              <AdmissionAssistant userId={userId} studentId={studentId} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600">
          <p>
            Next Admit © 2026. Making top university education accessible to
            students worldwide.
          </p>
        </div>
      </footer>
    </main>
  );
}