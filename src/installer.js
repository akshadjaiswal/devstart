import { execa } from 'execa';
import ora from 'ora';
import { logger } from './utils/logger.js';
import { detectPackageManager, getInstallCommand } from './utils/package-manager.js';

export async function installDependencies(projectPath, config) {
  if (!config.install) {
    logger.info('Skipping dependency installation');
    return;
  }

  const packageManager = detectPackageManager(projectPath);
  const installCommand = getInstallCommand(packageManager);

  logger.log('');
  const spinner = ora({
    text: `Installing dependencies with ${packageManager}...`,
    color: 'cyan'
  }).start();

  try {
    const [command, ...args] = installCommand.split(' ');

    await execa(command, args, {
      cwd: projectPath,
      stdio: 'pipe'
    });

    spinner.succeed('Dependencies installed successfully!');
    return true;
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    logger.error(`Installation error: ${error.message}`);
    logger.warning('You can install dependencies manually by running:');
    logger.info(`  cd ${projectPath}`);
    logger.info(`  ${installCommand}`);
    return false;
  }
}

export async function initializeGit(projectPath, config) {
  if (!config.git) {
    return;
  }

  const spinner = ora('Initializing Git repository...').start();

  try {
    await execa('git', ['init'], { cwd: projectPath });
    spinner.succeed('Git repository initialized');
    return true;
  } catch (error) {
    spinner.fail('Failed to initialize Git');
    logger.warning('You can initialize Git manually by running:');
    logger.info(`  cd ${projectPath}`);
    logger.info('  git init');
    return false;
  }
}
