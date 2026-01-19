import Link from 'next/link';
import nextDynamic from 'next/dynamic';

const ConsultationForm = nextDynamic(() => import('@/components/ConsultationForm'), {
  loading: () => <div className="min-h-[200px] flex items-center justify-center">Loading...</div>,
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <main className="relative max-w-screen-xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-24 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Free to try - No credit card required</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Chat With Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Documents
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload PDFs, notes, and research. Ask questions. Get answers with citations.
            <span className="block mt-2 text-lg text-gray-500">
              Your data stays private. AI included free.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/documents"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Try It Free
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
              href="/contact"
              className="group border-2 border-gray-300 hover:border-blue-400 px-8 py-4 rounded-xl text-lg font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Get Consulting
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
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl mb-3">🔒</div>
              <div className="font-semibold text-gray-900">Private by Default</div>
              <div className="text-sm text-gray-500">Your documents stay on your device</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl mb-3">🤖</div>
              <div className="font-semibold text-gray-900">AI Included Free</div>
              <div className="text-sm text-gray-500">No API keys or setup required</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-3xl mb-3">📚</div>
              <div className="font-semibold text-gray-900">Cited Answers</div>
              <div className="text-sm text-gray-500">Know exactly where info comes from</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-lg text-gray-600">Three simple steps to chat with your documents</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Documents</h3>
              <p className="text-gray-600">
                Drag and drop your PDFs, text files, or markdown documents. We support most common
                formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Process & Index</h3>
              <p className="text-gray-600">
                Click "Process" and we'll extract text, create searchable chunks, and build your
                knowledge base.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ask Questions</h3>
              <p className="text-gray-600">
                Chat naturally with your documents. Get answers with citations pointing to the exact
                source.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Built For
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link
              href="/solutions/individuals"
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                Researchers
              </h3>
              <p className="text-sm text-gray-600">
                Chat with papers, organize notes, find connections across your research.
              </p>
            </Link>

            <Link
              href="/solutions/individuals"
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="text-4xl mb-4">⚕️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                Healthcare
              </h3>
              <p className="text-sm text-gray-600">
                Understand medical records privately. Track health data securely on your device.
              </p>
            </Link>

            <Link
              href="/solutions/businesses"
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                Legal Teams
              </h3>
              <p className="text-sm text-gray-600">
                Analyze contracts, search case files, and review documents with AI assistance.
              </p>
            </Link>

            <Link
              href="/solutions/businesses"
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                Enterprises
              </h3>
              <p className="text-sm text-gray-600">
                Deploy on your infrastructure. Keep proprietary knowledge secure and searchable.
              </p>
            </Link>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="mb-24">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Your Data. Your Control.
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unlike other AI tools, we don't use your documents to train models. Your files are
                processed securely and stay under your control.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="font-bold text-gray-900 mb-2">Secure Processing</div>
                <p className="text-sm text-gray-600">
                  Documents are processed in isolated environments. Nothing is shared or stored
                  beyond your session.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="font-bold text-gray-900 mb-2">No Training on Your Data</div>
                <p className="text-sm text-gray-600">
                  We never use your documents to train AI models. Your intellectual property stays
                  yours.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="font-bold text-gray-900 mb-2">Enterprise Ready</div>
                <p className="text-sm text-gray-600">
                  Need on-premises deployment? We can set up Botsmann entirely on your own
                  infrastructure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Consulting CTA */}
        <section className="mb-24">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Enterprise Deployment?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              We help organizations deploy private AI on their own infrastructure. Full data
              sovereignty, custom integrations, and ongoing support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Book a Consultation
              </Link>
              <Link
                href="/solutions/businesses"
                className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h2>
            <p className="text-gray-600">
              Questions about deployment? Want a demo? We'd love to hear from you.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-xl mx-auto">
            <ConsultationForm />
          </div>
        </section>
      </main>
    </div>
  );
}

// Static marketing page; generate at build and revalidate periodically.
export const dynamic = 'force-static';
export const revalidate = 3600; // seconds
