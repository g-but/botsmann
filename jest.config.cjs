/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"]
}; 