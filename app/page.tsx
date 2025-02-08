import Link from 'next/link';

export default function Page() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-16">
      <div className="text-center">
        <h1 className="mb-6 text-6xl font-semibold tracking-tight text-gray-900">
          AI-Powered Solutions for
          <span className="text-openai-green"> Every Need</span>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
          Discover our suite of specialized AI bots designed to transform your business operations
          and enhance productivity.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/bots"
            className="rounded-md bg-openai-green px-8 py-3 text-lg font-medium text-white hover:bg-opacity-90 transition-opacity"
          >
            Browse our bots
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-gray-300 bg-white px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
