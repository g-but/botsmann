import Link from 'next/link';
import { professionals } from '@/data/professionals';
import { ProfessionalCard } from '@/components/shared/ProfessionalCard';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { PrivacySection } from '@/components/shared/PrivacySection';
import { EnterpriseSection } from '@/components/shared/EnterpriseSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full opacity-10 blur-3xl" />
      </div>

      <main className="relative max-w-screen-xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-20 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Free to try - No credit card required</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Your Private
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              AI Professionals
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Expert advice from AI doctors, lawyers, and advisors.
            <span className="block mt-2 text-lg text-gray-500">
              Available 24/7. Completely private. A fraction of the cost.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/try"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Try Now - Free
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
            <Link
              href="#professionals"
              className="group border-2 border-gray-300 hover:border-blue-400 px-8 py-4 rounded-xl text-lg font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Meet Your Professionals
                <svg
                  className="w-5 h-5 group-hover:translate-y-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl mb-3">🔒</div>
              <div className="font-semibold text-gray-900">Complete Privacy</div>
              <div className="text-sm text-gray-500">Your data never leaves your control</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl mb-3">⏰</div>
              <div className="font-semibold text-gray-900">24/7 Access</div>
              <div className="text-sm text-gray-500">Expert guidance whenever you need it</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl mb-3">📄</div>
              <div className="font-semibold text-gray-900">Personalized</div>
              <div className="text-sm text-gray-500">Upload documents for tailored advice</div>
            </div>
          </div>
        </section>

        {/* Professionals Grid - THE MAIN PRODUCT */}
        <section id="professionals" className="mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Meet Your AI Professionals
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the expert advisor that matches your needs. Each professional brings
              specialized knowledge and a unique approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.slug} professional={professional} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/professionals"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Professionals
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <div id="how-it-works" className="scroll-mt-24">
          <HowItWorks />
        </div>

        {/* Privacy Section */}
        <PrivacySection />

        {/* Enterprise Section */}
        <EnterpriseSection />
      </main>
    </div>
  );
}

// Static marketing page; generate at build and revalidate periodically.
export const dynamic = 'force-static';
export const revalidate = 3600; // seconds
