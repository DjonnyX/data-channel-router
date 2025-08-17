/** @type {import('jest').Config} */
const config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
    },
    transformIgnorePatterns: [
        "node_modules/(?!variables/.*)"
    ]
};

module.exports = config;