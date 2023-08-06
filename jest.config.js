const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('@jest/types').Config.InitialOptions} */
const customJestConfig = {
  clearMocks: true,
  moduleNameMapper: {
    "^@/pages/(.*)": "<rootDir>/pages/$1",
    "^@/query/(.*)": "<rootDir>/query/$1",
    "^@/styles/(.*)": "<rootDir>/styles/$1",
    "^@/store/(.*)": "<rootDir>/store/$1",
    "^@/utils/(.*)": "<rootDir>/utils/$1",
    "^@/components/shared*": "<rootDir>/components/shared/index.ts",
    "^@/components/shared/(.*)": "<rootDir>/components/shared/$1",
    "^@/components/specific/(.*)": "<rootDir>/components/specific/$1",
    "@supabase/(.*)": "<rootDir>/node_modules/@supabase/$1",
  },
  testEnvironment: "jest-environment-jsdom",
};

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: ["node_modules/(?!(swiper|ssr-window|dom7)/)"],
});
