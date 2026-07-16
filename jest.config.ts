import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        jsx: "react-jsx",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^next/font/google$": "<rootDir>/test/mocks/next-font.ts",
    "\\.css$": "<rootDir>/test/mocks/style-mock.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
};

export default config;
