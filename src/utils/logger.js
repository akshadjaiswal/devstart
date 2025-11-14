import chalk from 'chalk';

export const logger = {
  success: (message) => {
    console.log(chalk.green('✓'), message);
  },

  error: (message) => {
    console.log(chalk.red('✗'), message);
  },

  warning: (message) => {
    console.log(chalk.yellow('⚠'), message);
  },

  info: (message) => {
    console.log(chalk.blue('ℹ'), message);
  },

  log: (message) => {
    console.log(message);
  },

  title: (message) => {
    console.log(chalk.bold.cyan(`\n${message}\n`));
  },

  step: (message) => {
    console.log(chalk.gray('→'), message);
  }
};
