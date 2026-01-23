import { type FC } from 'react';

interface SprintTask {
  id: number;
  title: string;
  storyPoints: number;
  description: string;
  subtasks: string[];
}

interface TeamMember {
  name: string;
  availability: string;
  storyPoints: number;
  isTotal?: boolean;
}

const SPRINT_TASKS: SprintTask[] = [
  {
    id: 1,
    title: 'User Registration Flow',
    storyPoints: 5,
    description:
      'Implement secure registration with email verification and password strength validation',
    subtasks: [
      'Create registration API endpoint',
      'Implement email verification service',
      'Build registration form UI with validation',
    ],
  },
  {
    id: 2,
    title: 'Login & Session Management',
    storyPoints: 8,
    description: 'Create secure login flow with JWT tokens and refresh mechanism',
    subtasks: [
      'Implement login API with rate limiting',
      'Create JWT token generation and validation',
      'Design and implement refresh token flow',
      'Build login UI with form validation',
    ],
  },
  {
    id: 3,
    title: 'Password Management',
    storyPoints: 5,
    description: 'Implement secure password reset and change functionality',
    subtasks: [
      'Create password reset flow with tokens',
      'Implement password change functionality',
      'Build password reset and change UI',
    ],
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Alex (Backend)', availability: '90%', storyPoints: 10 },
  { name: 'Taylor (Backend)', availability: '100%', storyPoints: 12 },
  { name: 'Jordan (Frontend)', availability: '80%', storyPoints: 8 },
  { name: 'Team Total', availability: '90%', storyPoints: 30, isTotal: true },
];

export const SprintPlanningTab: FC = () => (
  <div className="animate-fadeIn">
    <h3 className="text-xl font-semibold mb-4">Sprint Planning</h3>

    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="font-medium text-gray-900 mb-2">Sprint 1: Core Authentication (2 weeks)</h4>
      <div className="space-y-3">
        {SPRINT_TASKS.map((task) => (
          <div key={task.id} className="bg-white p-3 rounded border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-800 text-xs">{task.id}</span>
                </div>
                <span className="font-medium text-gray-900">{task.title}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                {task.storyPoints} Story Points
              </div>
            </div>
            <div className="pl-8">
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <div className="space-y-1">
                {task.subtasks.map((subtask, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-4 h-4 rounded-sm border border-gray-300 mr-2 flex-shrink-0"></div>
                    <span className="text-xs text-gray-700">{subtask}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">Sprint Velocity & Capacity</h4>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Member
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Story Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TEAM_MEMBERS.map((member) => (
              <tr key={member.name} className={member.isTotal ? 'bg-gray-50' : ''}>
                <td
                  className={`px-4 py-2 text-sm ${member.isTotal ? 'font-medium text-gray-900' : 'text-gray-900'}`}
                >
                  {member.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{member.availability}</td>
                <td
                  className={`px-4 py-2 text-sm ${member.isTotal ? 'font-medium text-gray-900' : 'text-gray-500'}`}
                >
                  {member.storyPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
