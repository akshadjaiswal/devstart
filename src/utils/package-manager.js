import fs from 'fs-extra';
import path from 'path';

export function detectPackageManager(projectPath) {
  // Check for lockfiles in the project directory
  if (fs.existsSync(path.join(projectPath, 'bun.lockb'))) {
    return 'bun';
  }
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) {
    return 'yarn';
  }

  // Default to npm
  return 'npm';
}

export function getInstallCommand(packageManager) {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
    bun: 'bun install'
  };

  return commands[packageManager] || commands.npm;
}

export function getPackageManagerName(packageManager) {
  return packageManager || 'npm';
}
