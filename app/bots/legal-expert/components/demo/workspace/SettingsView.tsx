import { type FC } from 'react';
import { type LawyerProfile } from '../types';

interface SettingsViewProps {
  lawyer: LawyerProfile;
}

interface TeamMember {
  role: string;
  access: string;
  icon: string;
}

interface NotificationSetting {
  label: string;
  enabled: boolean;
}

export const SettingsView: FC<SettingsViewProps> = ({ lawyer }) => {
  const teamMembers: TeamMember[] = [
    { role: 'Owner (You)', access: 'Full Access', icon: '👤' },
    { role: `Attorney (${lawyer.username})`, access: 'Full Access', icon: lawyer.avatar },
    { role: 'Paralegal', access: 'Limited Access', icon: '📝' },
    { role: 'Advisor', access: 'Read Only', icon: '👥' },
  ];

  const notificationSettings: NotificationSetting[] = [
    { label: 'Email notifications', enabled: true },
    { label: 'Push notifications', enabled: true },
    { label: 'SMS alerts', enabled: false },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white">⚙️ Workspace Settings</h2>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">🔐 Privacy & Access Control</h3>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.role}
              className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{member.icon}</span>
                <div>
                  <p className="text-white font-medium">{member.role}</p>
                  <p className="text-sm text-slate-400">{member.access}</p>
                </div>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">🔔 Notifications</h3>
        <div className="space-y-3">
          {notificationSettings.map((setting) => (
            <div
              key={setting.label}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
            >
              <span className="text-white">{setting.label}</span>
              <div
                className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-blue-600' : 'bg-slate-600'}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${setting.enabled ? 'ml-6' : 'ml-0.5'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
