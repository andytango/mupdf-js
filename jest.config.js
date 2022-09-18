/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { cpus } = require("os");
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: cpus().length / 2,
};
