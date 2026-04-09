import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';
import { copyConditionalTemplate } from '../generator.js';
import { dependencyMap } from '../constants.js';

const FRAMEWORK_MARKERS = {
  'nextjs-app': 'next',
  'nextjs-pages': 'next',
  'vite-react': 'vite',
  'remix': '@remix-run/react',
};

const INTEGRATION_PACKAGES = {
  zustand: 'zustand',
  redux: '@reduxjs/toolkit',
  jotai: 'jotai',
  'tanstack-query': '@tanstack/react-query',
  swr: 'swr',
  apollo: '@apollo/client',
  supabase: '@supabase/supabase-js',
  firebase: 'firebase',
  prisma: '@prisma/client',
  mongodb: 'mongodb',
  nextauth: 'next-auth',
  clerk: '@clerk/nextjs',
};

const INTEGRATION_CATEGORIES = {
  zustand: 'state',
  redux: 'state',
  jotai: 'state',
  'tanstack-query': 'data',
  swr: 'data',
  apollo: 'data',
  supabase: 'database',
  firebase: 'database',
  prisma: 'database',
  mongodb: 'database',
  nextauth: 'auth',
  clerk: 'auth',
};

const INTEGRATION_LABELS = {
  zustand: 'Zustand (state)',
  redux: 'Redux Toolkit (state)',
  jotai: 'Jotai (state)',
  'tanstack-query': 'TanStack Query (data fetching)',
  swr: 'SWR (data fetching)',
  apollo: 'Apollo Client (data fetching)',
  supabase: 'Supabase (database)',
  firebase: 'Firebase (database)',
  prisma: 'Prisma + PostgreSQL (database)',
  mongodb: 'MongoDB (database)',
  nextauth: 'Auth.js v5 / NextAuth (auth)',
  clerk: 'Clerk (auth)',
};

export async function upgradeProject() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, 'package.json');

  if (!await fs.pathExists(pkgPath)) {
    logger.error('No package.json found. Run this command inside a project directory.');
    process.exit(1);
  }

  const pkg = await fs.readJSON(pkgPath);
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Detect framework
  let framework = null;
  for (const [fw, marker] of Object.entries(FRAMEWORK_MARKERS)) {
    if (allDeps[marker]) {
      framework = fw;
      break;
    }
  }

  // Distinguish nextjs-app vs nextjs-pages by checking for app/ directory
  if (framework === 'nextjs-app' || framework === 'nextjs-pages') {
    const hasAppDir = await fs.pathExists(path.join(cwd, 'app'));
    framework = hasAppDir ? 'nextjs-app' : 'nextjs-pages';
  }

  if (!framework) {
    logger.error('Could not detect a supported framework (Next.js, Vite, or Remix) in this project.');
    process.exit(1);
  }

  logger.info(`Detected framework: ${chalk.bold(framework)}`);
  console.log('');

  // Find integrations not yet installed
  const missing = [];
  for (const [integration, pkg] of Object.entries(INTEGRATION_PACKAGES)) {
    if (!allDeps[pkg]) {
      missing.push(integration);
    }
  }

  if (missing.length === 0) {
    logger.success('All supported integrations are already installed!');
    return;
  }

  const { chosen } = await inquirer.prompt([
    {
      type: 'list',
      name: 'chosen',
      message: 'Which integration would you like to add?',
      choices: [
        ...missing.map(key => ({ name: INTEGRATION_LABELS[key], value: key })),
        { name: 'Cancel', value: null },
      ],
    },
  ]);

  if (!chosen) {
    logger.info('No changes made.');
    return;
  }

  const category = INTEGRATION_CATEGORIES[chosen];
  const templateVars = { framework, typescript: true };

  logger.step(`Copying ${INTEGRATION_LABELS[chosen]} template files...`);
  await copyConditionalTemplate(cwd, framework, category, chosen, templateVars);
  logger.success(`Added ${INTEGRATION_LABELS[chosen]} template files.`);

  // Show packages to install
  const depEntry = dependencyMap[
    category === 'state' ? 'stateManagement' :
    category === 'data' ? 'dataFetching' :
    category === 'database' ? 'database' :
    'auth'
  ]?.[chosen];

  if (depEntry) {
    const allPkgs = [...(depEntry.dependencies || []), ...(depEntry.devDependencies || [])];
    if (allPkgs.length > 0) {
      console.log('');
      logger.info('Install the following packages:');
      console.log(chalk.cyan(`  npm install ${allPkgs.join(' ')}`));
    }
  }

  console.log('');
  logger.success('Done! Review the new files in your lib/ folder.');
}
