const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  setupFiles: ['<rootDir>/tests/setup-tests.ts'],
  testEnvironment: 'jest-environment-node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/tests/__tests__/**/*.test.ts',
    '<rootDir>/tests/__tests__/**/*.test.tsx',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(next|@next|mongoose)/)'
  ],
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
