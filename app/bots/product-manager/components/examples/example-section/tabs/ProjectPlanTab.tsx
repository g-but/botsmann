'use client';

import React from 'react';

const TIMELINE_STEPS = [
  { number: 1, title: 'Planning & Requirements (2 weeks)', description: 'Define user flows, security requirements, and integration points' },
  { number: 2, title: 'Core Authentication (3 weeks)', description: 'Implement user registration, login, and session management' },
  { number: 3, title: 'OAuth Integration (2 weeks)', description: 'Add support for Google, GitHub, and Microsoft authentication' },
  { number: 4, title: 'Role-Based Access Control (2 weeks)', description: 'Implement permission system with role hierarchy' },
  { number: 5, title: 'Testing & Refinement (1 week)', description: 'Security testing, performance optimization, and bug fixes' },
];

const RESOURCE_ALLOCATION = [
  { role: 'Backend Developer', allocation: '2 FTE', phase: 'All Phases' },
  { role: 'Frontend Developer', allocation: '1 FTE', phase: 'Phase 2-4' },
  { role: 'Security Engineer', allocation: '0.5 FTE', phase: 'Phase 1, 5' },
  { role: 'QA Engineer', allocation: '1 FTE', phase: 'Phase 5' },
];

export const ProjectPlanTab: React.FC = () => (
  <div className="animate-fadeIn">
    <h3 className="text-xl font-semibold mb-4">Project Plan & Timeline</h3>
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="font-medium text-gray-900 mb-2">Project Overview</h4>
      <p className="text-gray-700 mb-3">
        The User Authentication System will provide secure identity verification, role-based access control, and seamless integration with third-party OAuth providers for the Cursor application.
      </p>
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex flex-col">
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Project Timeline</h5>
            <div className="relative">
              <div className="absolute top-3 left-3 bottom-3 w-0.5 bg-blue-200"></div>
              <div className="space-y-6">
                {TIMELINE_STEPS.map((step) => (
                  <div key={step.number} className="flex">
                    <div className="flex-shrink-0 z-10">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs">{step.number}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Resource Allocation</h5>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {RESOURCE_ALLOCATION.map((resource) => (
                    <tr key={resource.role}>
                      <td className="px-4 py-2 text-sm text-gray-900">{resource.role}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{resource.allocation}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{resource.phase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
