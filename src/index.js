import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { promptUser } from './prompts.js';
import { generateProject } from './generator.js';
import { installDependencies, initializeGit } from './installer.js';
import { validateProjectPath } from './utils/validator.js';
import { logger } from './utils/logger.js';
import { displayBanner } from './utils/banner.js';

const program = new Command();

program
  .name('devstart')
  .description('A powerful CLI tool that scaffolds production-ready projects with your preferred tech stack')
  .version('1.0.0');

program
  .command('init')
  .description('Create a new project')
  .action(async () => {
    try {
      // Display banner
      displayBanner();

      // Get user input
      const config = await promptUser();

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

// If no command specified, run init by default
if (process.argv.length === 2) {
  program.parse(['node', 'devstart', 'init']);
} else {
  program.parse();
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
