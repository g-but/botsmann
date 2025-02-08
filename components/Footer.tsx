export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Botsmann. All rights reserved.
          </div>
          <nav className="flex space-x-6">
            <a href="/privacy" className="text-sm text-gray-600 hover:text-openai-green">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-gray-600 hover:text-openai-green">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
