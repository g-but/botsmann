import { type FC } from 'react';

interface TechStackItem {
  abbrev: string;
  name: string;
  description: string;
}

const TECH_STACK: TechStackItem[] = [
  {
    abbrev: 'BE',
    name: 'Node.js with Express',
    description: 'Provides excellent performance for API-driven applications with extensive middleware ecosystem',
  },
  {
    abbrev: 'FE',
    name: 'React with Next.js',
    description: 'Server-side rendering improves security for authentication flows',
  },
  {
    abbrev: 'DB',
    name: 'PostgreSQL',
    description: 'Reliable, ACID-compliant database with excellent support for JSON data',
  },
  {
    abbrev: 'SEC',
    name: 'JWT with Refresh Tokens',
    description: 'Stateless authentication with secure token refresh mechanism',
  },
];

export const TechnicalStrategyTab: FC = () => (
  <div className="animate-fadeIn">
    <h3 className="text-xl font-semibold mb-4">Technical Strategy</h3>
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
            ARCHITECTURE
          </div>
          <h4 className="font-medium text-gray-900">Authentication Service Design</h4>
        </div>
        <p className="text-gray-700 mb-2">
          The authentication system will use a microservice architecture to ensure scalability and
          maintainability.
        </p>
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 rounded-lg p-3 w-full max-w-md text-center mb-2">
              <span className="font-medium">API Gateway</span>
            </div>
            <svg
              className="h-8 w-8 text-gray-400 my-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-2">
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <span className="font-medium">Auth Service</span>
              </div>
              <div className="bg-indigo-100 rounded-lg p-3 text-center">
                <span className="font-medium">User Service</span>
              </div>
            </div>
            <svg
              className="h-8 w-8 text-gray-400 my-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
            <div className="bg-purple-100 rounded-lg p-3 w-full max-w-md text-center">
              <span className="font-medium">Database Cluster</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
            TECHNOLOGY
          </div>
          <h4 className="font-medium text-gray-900">Tech Stack Recommendations</h4>
        </div>
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TECH_STACK.map((item) => (
              <div key={item.abbrev} className="space-y-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-800 text-xs">{item.abbrev}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <p className="text-xs text-gray-600 pl-8">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
