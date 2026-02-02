export const SITE_GROUPS = {
  SINGLE_SITE: 'Single Site',
  DIRECT_TO_PATIENT: 'Direct to Patient',
} as const;

export type SiteGroup = typeof SITE_GROUPS[keyof typeof SITE_GROUPS];

export const SITE_GROUP_VALUES = Object.values(SITE_GROUPS);
