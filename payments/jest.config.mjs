export default {
  verbose: true,

  // Tell Jest to use the Node.js environment with ESM support
  testEnvironment: 'node',
  
  setupFiles: [
    "<rootDir>/layers/nodejs/node_modules/dotenv/config"
  ],

  // Add this testMatch pattern to match .mjs test files
  testMatch: [
    '**/__tests__/**/*.mjs',
    // '**/?(*.)+(spec|test).mjs'
  ], 
  
  modulePaths: [
    "<rootDir>/layers/nodejs/node_modules/"
  ],

  // Add or update this line to ignore the cdk folder
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/cdk/*"
  ],  
};
