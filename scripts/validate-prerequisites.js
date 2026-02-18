#!/usr/bin/env node

/**
 * Prerequisite Validation Script
 *
 * Validates that the minimum requirements for running the examples are met:
 * - Node.js version >= 20.0.0
 * - npm is available
 *
 * Usage: node scripts/validate-prerequisites.js
 */

const REQUIRED_NODE_VERSION = '20.0.0';

function formatNodeVersion(version) {
  return version.replace(/^v/, '');
}

function compareVersions(a, b) {
  const aParts = formatNodeVersion(a).split('.').map(Number);
  const bParts = formatNodeVersion(b).split('.').map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;

    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }

  return 0;
}

function validateNodeVersion() {
  const nodeVersion = process.version;

  if (compareVersions(nodeVersion, REQUIRED_NODE_VERSION) < 0) {
    console.error(`❌ Node.js version requirement not met`);
    console.error(`   Required: >= ${REQUIRED_NODE_VERSION}`);
    console.error(`   Found: ${nodeVersion}`);
    console.error('');
    console.error(`Please upgrade Node.js:`);
    console.error(`  - Download from https://nodejs.org/`);
    console.error(`  - Or use nvm: nvm install ${REQUIRED_NODE_VERSION}`);
    return false;
  }

  return true;
}

function validateNpm() {
  try {
    const { execSync } = require('child_process');
    execSync('npm --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`❌ npm not found or not accessible`);
    console.error('');
    console.error(`Please ensure npm is installed and accessible in your PATH`);
    return false;
  }
}

function main() {
  const checks = [
    { name: 'Node.js version', fn: validateNodeVersion },
    { name: 'npm', fn: validateNpm },
  ];

  let allPassed = true;

  for (const check of checks) {
    if (!check.fn()) {
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('✅ All prerequisites met');
    process.exit(0);
  } else {
    console.error('');
    console.error(`❌ Some prerequisites are not met`);
    process.exit(1);
  }
}

main();
