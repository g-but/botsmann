module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^next/server$": "<rootDir>/tests/__mocks__/next/server.ts"
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }]
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    TextEncoder: require("util").TextEncoder,
    TextDecoder: require("util").TextDecoder,
    Request: require("node-fetch").Request,
    Response: require("node-fetch").Response
  }
}  