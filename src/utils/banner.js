import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';

/**
 * Display the DevStart CLI banner with gradient colors
 */
export function displayBanner() {
  const banner = figlet.textSync('DEVSTART', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  });

  // Create a gradient from cyan -> blue -> magenta -> pink
  const gradientColors = gradient(['#00D9FF', '#7B61FF', '#E040FB', '#FF006E']);

  console.log('');
  console.log(gradientColors.multiline(banner));
  console.log('');
  console.log(chalk.bold.white('  Stop configuring. Start building.'));
  console.log(chalk.dim(`  Version: 1.0.5`) + chalk.dim(' • ') + chalk.dim('https://github.com/akshadjaiswal/devstart'));
  console.log('');
  console.log(chalk.dim('─'.repeat(75)));
  console.log('');
}

/**
 * Display a compact banner (optional alternative)
 */
export function displayCompactBanner() {
  const banner = figlet.textSync('DevStart', {
    font: 'Small',
    horizontalLayout: 'fitted',
  });

  const gradientColors = gradient(['cyan', 'magenta']);
  console.log('');
  console.log(gradientColors.multiline(banner));
  console.log('');
}
