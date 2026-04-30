/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  setupFiles: ['<rootDir>/tests/env.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
