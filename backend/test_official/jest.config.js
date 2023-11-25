module.exports = {
    testTimeout: 30000,
    preset: 'ts-jest',
    setupFiles: ['esm/register'],
    testEnvironment: 'node',
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.m?js$": "babel-jest"
      }
  };
  