// Infrastructure Types - Single Source of Truth for AI Provider and Storage type definitions

export type ProviderColor = 'orange' | 'green' | 'purple' | 'blue';

export type ProviderId = 'groq' | 'openrouter' | 'ollama';

export type StorageId = 'cloud' | 'local' | 'usb';

export type StorageStatus = 'available' | 'coming' | 'future';

export type ConnectionStatus = 'connected' | 'not-configured' | 'validating' | 'error';

export interface AIProvider {
  id: ProviderId;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  color: ProviderColor;
  keyRequired: boolean;
  keyPlaceholder: string;
  helpUrl: string;
  logo: string;
}

export interface StorageOption {
  id: StorageId;
  name: string;
  description: string;
  status: StorageStatus;
  icon: string;
}

export interface ProviderColorClasses {
  bg: string;
  bgLight: string;
  bgGradient: string;
  text: string;
  border: string;
  hover: string;
  ring: string;
  focusRing: string;
}
