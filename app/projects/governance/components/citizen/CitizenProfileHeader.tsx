import { type FC } from 'react';
import { type CitizenData } from '@/types/governance';
import { ProfileHeader } from '@/components/governance/ProfileHeader';

interface CitizenProfileHeaderProps {
  citizen: CitizenData;
}

/**
 * Citizen-specific profile header
 * Wraps the reusable ProfileHeader with citizen-specific props
 */
export const CitizenProfileHeader: FC<CitizenProfileHeaderProps> = ({ citizen }) => {
  return (
    <ProfileHeader
      name={citizen.name}
      id={citizen.id}
      idLabel="Citizen ID"
      subtitle={`Registered since ${citizen.registeredSince}`}
      avatarUrl={citizen.avatarUrl}
      gradient="blue-green"
      badge={{
        label: 'Participation Score',
        value: `${citizen.participationScore}/100`,
      }}
    />
  );
};
