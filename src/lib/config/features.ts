export const FEATURES = {
  AWS_SES_TEMPLATES: process.env.USE_AWS_SES === 'true'
} as const;
