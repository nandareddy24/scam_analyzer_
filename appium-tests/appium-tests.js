/**
 * ==============================================================================================
 * UPI Scam Analyzer — Mobile App Frontend Appium E2E Automation Entry Point
 * File: appium-tests.js
 * Description: Root execution entry point for Appium mobile automation suite.
 * Delegates to tests/app-tests.js and triggers Excel report generation (>300 test cases).
 * ==============================================================================================
 */

const { runMobileAppiumTests, generateExcelReport } = require('./tests/app-tests.js');

if (require.main === module) {
  runMobileAppiumTests()
    .then((res) => {
      if (res && res.failCount > 0) process.exitCode = 1;
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}

module.exports = require('./tests/app-tests.js');

