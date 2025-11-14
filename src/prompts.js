import inquirer from 'inquirer';
import { validateProjectName } from './utils/validator.js';

export async function promptUser() {
  console.log('\nWelcome to DevStart CLI! 🚀\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: "What's your project name?",
      default: 'my-awesome-app',
      validate: (input) => {
        const validation = validateProjectName(input);
        return validation.valid || validation.message;
      }
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework?',
      choices: [
        { name: 'Next.js 16 (App Router)', value: 'nextjs-app' },
        { name: 'Next.js 16 (Pages Router)', value: 'nextjs-pages' },
        { name: 'Vite + React', value: 'vite-react' },
        { name: 'Remix', value: 'remix' }
      ],
      default: 'nextjs-app'
    },
    {
      type: 'list',
      name: 'styling',
      message: 'Choose your styling solution:',
      choices: [
        { name: 'Tailwind CSS', value: 'tailwind' },
        { name: 'CSS Modules', value: 'css-modules' },
        { name: 'Styled Components', value: 'styled-components' },
        { name: 'None', value: 'none' }
      ],
      default: 'tailwind'
    },
    {
      type: 'list',
      name: 'ui',
      message: 'Add UI components?',
      choices: [
        { name: 'shadcn/ui', value: 'shadcn' },
        { name: 'Radix UI', value: 'radix' },
        { name: 'Headless UI', value: 'headless' },
        { name: 'None', value: 'none' }
      ],
      default: 'shadcn'
    },
    {
      type: 'list',
      name: 'stateManagement',
      message: 'State management?',
      choices: [
        { name: 'Zustand', value: 'zustand' },
        { name: 'Redux Toolkit', value: 'redux' },
        { name: 'Jotai', value: 'jotai' },
        { name: 'Context API only', value: 'context' },
        { name: 'None', value: 'none' }
      ],
      default: 'zustand'
    },
    {
      type: 'list',
      name: 'dataFetching',
      message: 'Data fetching?',
      choices: [
        { name: 'TanStack Query', value: 'tanstack-query' },
        { name: 'SWR', value: 'swr' },
        { name: 'Apollo Client', value: 'apollo' },
        { name: 'fetch only', value: 'fetch' }
      ],
      default: 'tanstack-query'
    },
    {
      type: 'list',
      name: 'database',
      message: 'Database & Backend?',
      choices: [
        { name: 'Supabase', value: 'supabase' },
        { name: 'Firebase', value: 'firebase' },
        { name: 'Prisma + PostgreSQL', value: 'prisma' },
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'None', value: 'none' }
      ],
      default: 'supabase'
    },
    {
      type: 'list',
      name: 'auth',
      message: 'Authentication?',
      choices: [
        { name: 'Supabase Auth', value: 'supabase-auth' },
        { name: 'NextAuth.js', value: 'nextauth' },
        { name: 'Clerk', value: 'clerk' },
        { name: 'Firebase Auth', value: 'firebase-auth' },
        { name: 'None', value: 'none' }
      ],
      default: 'supabase-auth'
    },
    {
      type: 'checkbox',
      name: 'additionalTools',
      message: 'Additional tools? (multi-select)',
      choices: [
        { name: 'Axios', value: 'axios' },
        { name: 'date-fns', value: 'date-fns' },
        { name: 'Zod (validation)', value: 'zod' },
        { name: 'React Hook Form', value: 'react-hook-form' },
        { name: 'Framer Motion', value: 'framer-motion' },
        { name: 'Lucide Icons', value: 'lucide-react' }
      ],
      default: []
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'TypeScript?',
      default: true
    },
    {
      type: 'confirm',
      name: 'git',
      message: 'Initialize Git?',
      default: true
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies now?',
      default: true
    }
  ]);

  return answers;
}
