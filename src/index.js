import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { createRequire } from 'module';
import { promptUser, promptProjectName } from './prompts.js';
import { PRESETS } from './presets.js';
import { generateProject } from './generator.js';
import { installDependencies, initializeGit } from './installer.js';
import { validateProjectPath } from './utils/validator.js';
import { logger } from './utils/logger.js';
import { displayBanner } from './utils/banner.js';
import { dependencyMap } from './constants.js';
import { upgradeProject } from './commands/upgrade.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();

program
  .name('devstart')
  .description('A powerful CLI tool that scaffolds production-ready projects with your preferred tech stack')
  .version(version);

program
  .command('init')
  .description('Create a new project')
  .option('--latest', 'Use latest stable versions instead of pinned version ranges')
  .option('--preset <name>', 'Use a preset configuration: saas, blog, dashboard')
  .action(async (options) => {
    try {
      // Display banner
      displayBanner();

      // Get user input
      let config;
      if (options.preset) {
        config = await applyPreset(options.preset);
      } else {
        config = await promptUser();
      }

      if (options.latest) {
        config.useLatest = true;
        logger.warning('Using latest versions — some packages may have breaking changes between major versions.');
      }

      // Validate project path
      const projectPath = path.join(process.cwd(), config.projectName);
      const pathValidation = validateProjectPath(projectPath);

      if (!pathValidation.valid) {
        logger.error(pathValidation.message);
        process.exit(1);
      }

      // Start generation
      logger.title('Creating your project... ⚙️');

      // Generate project
      await generateProject(config);

      // Initialize Git
      await initializeGit(projectPath, config);

      // Install dependencies
      logger.log('');
      await installDependencies(projectPath, config);

      // Success message
      displaySuccessMessage(config);

    } catch (error) {
      logger.error(`\nError: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all available frameworks and integrations')
  .action(() => {
    displayList();
  });

program
  .command('upgrade')
  .description('Add an integration to an existing devstart project')
  .action(async () => {
    await upgradeProject();
  });

// If no command specified, run init by default
if (process.argv.length === 2) {
  program.parse(['node', 'devstart', 'init']);
} else {
  program.parse();
}

async function applyPreset(presetName) {
  const preset = PRESETS[presetName];
  if (!preset) {
    logger.error(`Unknown preset "${presetName}". Available: ${Object.keys(PRESETS).join(', ')}`);
    process.exit(1);
  }
  logger.info(`Using preset: ${chalk.bold(presetName)}`);
  const projectName = await promptProjectName();
  return { ...preset, projectName };
}

function displayList() {
  console.log('');
  console.log(chalk.bold.cyan('DevStart CLI — Available Options\n'));

  const sections = [
    { label: 'Frameworks', key: 'framework' },
    { label: 'Styling', key: 'styling' },
    { label: 'UI Components', key: 'ui' },
    { label: 'State Management', key: 'stateManagement' },
    { label: 'Data Fetching', key: 'dataFetching' },
    { label: 'Database', key: 'database' },
    { label: 'Auth', key: 'auth' },
    { label: 'Additional Tools', key: 'additionalTools' },
  ];

  for (const { label, key } of sections) {
    const map = dependencyMap[key];
    if (!map) continue;
    console.log(chalk.bold(`  ${label}:`));
    for (const [option, deps] of Object.entries(map)) {
      const pkgs = [...(deps.dependencies || []), ...(deps.devDependencies || [])];
      const pkgNames = pkgs.map(p => p.split('@')[p.startsWith('@') ? 2 : 0] ? p.split('@')[0] || ('@' + p.split('@')[1]) : p);
      // Display package names (first part before @version)
      const pkgDisplay = pkgs.map(p => {
        if (p.startsWith('@')) {
          const parts = p.split('@');
          return chalk.dim('@' + parts[1]);
        }
        return chalk.dim(p.split('@')[0]);
      });
      const pkgStr = pkgDisplay.length > 0 ? `  ${chalk.gray('→')} ${pkgDisplay.join(', ')}` : '';
      console.log(`    ${chalk.cyan(option)}${pkgStr}`);
    }
    console.log('');
  }

  console.log(chalk.bold('  Presets:'));
  for (const name of Object.keys(PRESETS)) {
    console.log(`    ${chalk.cyan(name)}  ${chalk.gray('→')} ${chalk.dim(`devstart init --preset ${name}`)}`);
  }
  console.log('');
}

function displaySuccessMessage(config) {
  const { projectName } = config;

  console.log('');
  logger.success('Project created successfully!');
  console.log('');

  console.log(chalk.bold('Next steps:'));
  console.log(chalk.gray('  1.'), `cd ${projectName}`);
  console.log(chalk.gray('  2.'), 'Copy .env.local.example to .env.local');
  console.log(chalk.gray('  3.'), 'Add your environment variables');
  console.log(chalk.gray('  4.'), 'npm run dev');
  console.log('');

  console.log(chalk.dim(`Your project is ready at: ./${projectName}`));
  console.log('');
  console.log(chalk.dim(`Documentation: ./${projectName}/README.md`));
  console.log(chalk.dim('Need help? https://github.com/akshadjaiswal/devstart-cli'));
  console.log('');
  console.log(chalk.bold.cyan('Happy coding! 🎉'));
  console.log('');
}

export default program;
