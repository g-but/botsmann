/**
 * Unified Bot Demo System
 *
 * Main export: DemoSection - use this in bot pages
 *
 * Example usage:
 * ```tsx
 * import { DemoSection } from '@/components/shared/demo';
 *
 * export default function LegalExpertPage() {
 *   return (
 *     <BotPageTemplate botSlug="legal-expert">
 *       <BotSection id="demo">
 *         <DemoSection botSlug="legal-expert" />
 *       </BotSection>
 *     </BotPageTemplate>
 *   );
 * }
 * ```
 */

// Main component
export { DemoSection } from './DemoSection';

// Individual components (for advanced customization)
export { DemoProgress } from './DemoProgress';
export { DemoIntake } from './DemoIntake';
export { DemoChat } from './DemoChat';
export { DemoFileUpload } from './DemoFileUpload';
export { DemoContextPanel } from './DemoContextPanel';
export { DemoMessage, DemoDisclaimer } from './DemoMessage';

// State management hook
export { useDemoState } from './useDemoState';
