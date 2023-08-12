module.exports = {
  roots: ["<rootDir>"],
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testRegex: ".*.(test|spec).(ts|tsx|js)$",
  testPathIgnorePatterns: [
    "/node_modules/",
    ".*.snapshots.ts",
    "/dist/",
    "src/strategy/flatfile/flatfileDb/",
  ],
};
