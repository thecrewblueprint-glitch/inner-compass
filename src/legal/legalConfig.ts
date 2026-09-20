export type ReleaseTier = 'CONTROLLED_BETA' | 'PUBLIC_RELEASE';

const operatorName = import.meta.env.VITE_LEGAL_OPERATOR_NAME?.trim() || '';
const contactEmail = import.meta.env.VITE_LEGAL_CONTACT_EMAIL?.trim() || '';
const counselReviewed = import.meta.env.VITE_LEGAL_COUNSEL_REVIEWED === 'true';
const publicLaunchApproved = import.meta.env.VITE_PUBLIC_LAUNCH_APPROVED === 'true';

export const LEGAL_CONFIG = {
  productName: 'Inner Compass',
  effectiveDate: 'September 20, 2026',
  minimumAge: 18,
  launchRegion: 'United States',
  supportedLanguage: 'English',
  operatorName,
  contactEmail,
  counselReviewed,
  publicLaunchApproved,
} as const;

export const hasConfiguredLegalIdentity =
  Boolean(LEGAL_CONFIG.operatorName) && Boolean(LEGAL_CONFIG.contactEmail);

export const isPublicReleaseConfigured =
  hasConfiguredLegalIdentity &&
  LEGAL_CONFIG.counselReviewed &&
  LEGAL_CONFIG.publicLaunchApproved;

export const getReleaseTier = (): ReleaseTier =>
  isPublicReleaseConfigured ? 'PUBLIC_RELEASE' : 'CONTROLLED_BETA';

export const releaseBlockingReasons = (): string[] => {
  const reasons: string[] = [];
  if (!LEGAL_CONFIG.operatorName) reasons.push('Legal operator is not configured.');
  if (!LEGAL_CONFIG.contactEmail) reasons.push('Legal/privacy contact is not configured.');
  if (!LEGAL_CONFIG.counselReviewed) reasons.push('Counsel review is not marked complete.');
  if (!LEGAL_CONFIG.publicLaunchApproved) reasons.push('Owner public-launch approval is not marked complete.');
  return reasons;
};
