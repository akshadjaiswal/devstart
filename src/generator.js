import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { logger } from './utils/logger.js';
import { dependencyMap, frameworkScripts, envVariables } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateProject(config) {
  const { projectName, framework, styling, ui, stateManagement, dataFetching, database, auth, additionalTools, typescript } = config;
  const projectPath = path.join(process.cwd(), projectName);

  try {
    // Create project directory
    logger.step('Created project folder');
    await fs.ensureDir(projectPath);

    // Prepare template variables
    const templateVars = {
      projectName,
      framework,
      hasTailwind: styling === 'tailwind',
      hasTypescript: typescript,
      stateManagement,
      dataFetching,
      database,
      auth,
      additionalTools: additionalTools || [],
      styling,
      ui
    };

    // Copy base template
    await copyBaseTemplate(projectPath, framework, templateVars);
    logger.step(`Initialized ${getFrameworkName(framework)}`);

    // Copy conditional templates
    if (styling !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'styling', styling, templateVars);
      logger.step(`Configured ${getStylingName(styling)}`);
    }

    if (ui !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'ui', ui, templateVars);
      logger.step(`Added ${getUIName(ui)} components`);
    }

    if (stateManagement !== 'none' && stateManagement !== 'context') {
      await copyConditionalTemplate(projectPath, framework, 'state', stateManagement, templateVars);
      logger.step(`Setup ${getStateName(stateManagement)} store`);
    }

    if (dataFetching !== 'fetch') {
      await copyConditionalTemplate(projectPath, framework, 'data', dataFetching, templateVars);
      logger.step(`Configured ${getDataFetchingName(dataFetching)}`);
    }

    if (database !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'database', database, templateVars);
      logger.step(`Setup ${getDatabaseName(database)} client`);
    }

    if (auth !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'auth', auth, templateVars);
      logger.step(`Configured ${getAuthName(auth)}`);
    }

    // Generate package.json
    await generatePackageJson(projectPath, config);
    logger.step('Created package.json');

    // Generate .env.local.example
    await generateEnvExample(projectPath, config);
    logger.step('Created .env.local.example');

    // Generate README
    await generateReadme(projectPath, config);
    logger.step('Created README.md');

    // Create folder structure
    await createFolderStructure(projectPath, framework);
    logger.step('Created folder structure');

    // Generate .gitignore
    await generateGitignore(projectPath);
    logger.step('Created .gitignore');

    return projectPath;
  } catch (error) {
    logger.error(`Error generating project: ${error.message}`);
    throw error;
  }
}

async function copyBaseTemplate(projectPath, framework, templateVars) {
  const templatePath = path.join(__dirname, 'templates', framework, 'base');

  // For now, create minimal files programmatically
  // In full implementation, these would be copied from template files
  await createMinimalFiles(projectPath, framework, templateVars);
}

async function createMinimalFiles(projectPath, framework, templateVars) {
  const { projectName, hasTypescript } = templateVars;
  const ext = hasTypescript ? 'tsx' : 'jsx';
  const configExt = hasTypescript ? 'ts' : 'js';

  if (framework === 'nextjs-app') {
    // Create app directory structure
    await fs.ensureDir(path.join(projectPath, 'app'));
    await fs.ensureDir(path.join(projectPath, 'public'));

    // Create minimal layout
    const layoutContent = `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Built with DevStart CLI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;
    await fs.writeFile(path.join(projectPath, 'app', `layout.${ext}`), layoutContent);

    // Create minimal page
    const pageContent = `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to ${projectName}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Built with DevStart CLI 🚀
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">⚡ Fast</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Built with Next.js 15 and optimized for performance
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">🎨 Styled</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tailwind CSS configured and ready to use
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">🚀 Ready</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start building your application right away
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              👋 Getting Started
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Edit <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm">app/page.tsx</code> to customize this page
            </p>
            <a
              href="https://nextjs.org/docs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the docs →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
`;
    await fs.writeFile(path.join(projectPath, 'app', `page.${ext}`), pageContent);

    // Create globals.css
    const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    await fs.writeFile(path.join(projectPath, 'app', 'globals.css'), globalsCss);

    // Create next.config.js
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`;
    await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);
  }

  // Create tsconfig.json if TypeScript
  if (hasTypescript) {
    const tsConfig = framework === 'nextjs-app' || framework === 'nextjs-pages' ? {
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    } : {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
  }
}

async function copyConditionalTemplate(projectPath, framework, type, value, templateVars) {
  // In full implementation, this would copy from template directories
  // For now, we'll create minimal files based on the selection

  if (type === 'styling' && value === 'tailwind') {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

    const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);
  }
}

async function generatePackageJson(projectPath, config) {
  const { projectName, framework, styling, ui, stateManagement, dataFetching, database, auth, additionalTools, typescript } = config;

  // Collect all dependencies
  const dependencies = [];
  const devDependencies = [];

  // Framework dependencies
  const frameworkDeps = dependencyMap.framework[framework];
  dependencies.push(...frameworkDeps.dependencies);
  if (typescript) {
    devDependencies.push(...frameworkDeps.devDependencies);
  }

  // Styling dependencies
  if (styling !== 'none') {
    const stylingDeps = dependencyMap.styling[styling];
    dependencies.push(...stylingDeps.dependencies);
    devDependencies.push(...stylingDeps.devDependencies);
  }

  // UI dependencies
  if (ui !== 'none') {
    const uiDeps = dependencyMap.ui[ui];
    dependencies.push(...uiDeps.dependencies);
  }

  // State management dependencies
  if (stateManagement !== 'none' && stateManagement !== 'context') {
    const stateDeps = dependencyMap.stateManagement[stateManagement];
    dependencies.push(...stateDeps.dependencies);
  }

  // Data fetching dependencies
  if (dataFetching !== 'fetch') {
    const dataFetchingDeps = dependencyMap.dataFetching[dataFetching];
    dependencies.push(...dataFetchingDeps.dependencies);
  }

  // Database dependencies
  if (database !== 'none') {
    const dbDeps = dependencyMap.database[database];
    dependencies.push(...dbDeps.dependencies);
    devDependencies.push(...dbDeps.devDependencies);
  }

  // Auth dependencies
  if (auth !== 'none' && auth !== 'supabase-auth' && auth !== 'firebase-auth') {
    const authDeps = dependencyMap.auth[auth];
    dependencies.push(...authDeps.dependencies);
  }

  // Additional tools
  if (additionalTools && additionalTools.length > 0) {
    additionalTools.forEach(tool => {
      const toolDeps = dependencyMap.additionalTools[tool];
      if (toolDeps) {
        dependencies.push(...toolDeps.dependencies);
      }
    });
  }

  // Create package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: frameworkScripts[framework],
    dependencies: convertToObject(dependencies),
    devDependencies: convertToObject(devDependencies)
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

function convertToObject(depsArray) {
  const obj = {};
  depsArray.forEach(dep => {
    // Handle scoped packages (@org/package@version) and regular packages (package@version)
    let pkgName, version;

    if (dep.startsWith('@')) {
      // Scoped package: @org/package@version
      const parts = dep.split('@');
      // parts[0] is empty, parts[1] is org/package, parts[2] is version
      pkgName = '@' + parts[1];
      version = parts[2] || 'latest';
    } else {
      // Regular package: package@version
      const atIndex = dep.indexOf('@');
      if (atIndex > 0) {
        pkgName = dep.substring(0, atIndex);
        version = dep.substring(atIndex + 1);
      } else {
        pkgName = dep;
        version = 'latest';
      }
    }

    obj[pkgName] = version;
  });
  return obj;
}

async function generateEnvExample(projectPath, config) {
  const { database, auth } = config;
  let envContent = '# Environment Variables\n\n';

  if (database !== 'none' && envVariables[database]) {
    envContent += `# ${database.toUpperCase()}\n`;
    envContent += envVariables[database].join('\n') + '\n\n';
  }

  if (auth !== 'none' && auth !== 'supabase-auth' && auth !== 'firebase-auth' && envVariables[auth]) {
    envContent += `# ${auth.toUpperCase()}\n`;
    envContent += envVariables[auth].join('\n') + '\n\n';
  }

  await fs.writeFile(path.join(projectPath, '.env.local.example'), envContent);
}

async function generateReadme(projectPath, config) {
  const { projectName, framework, styling, ui, stateManagement, dataFetching, database, auth } = config;

  const readmeContent = `# ${projectName}

Built with DevStart CLI 🚀

## Stack

- **Framework**: ${getFrameworkName(framework)}
- **Styling**: ${getStylingName(styling)}
- **UI Components**: ${getUIName(ui)}
- **State Management**: ${getStateName(stateManagement)}
- **Data Fetching**: ${getDataFetchingName(dataFetching)}
- **Database**: ${getDatabaseName(database)}
- **Authentication**: ${getAuthName(auth)}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

3. Add your environment variables to \`.env.local\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

${Object.entries(frameworkScripts[framework]).map(([key, value]) => `- \`npm run ${key}\` - ${value}`).join('\n')}

## Project Structure

\`\`\`
${projectName}/
├── app/               # Application code
├── public/            # Static assets
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── README.md          # This file
\`\`\`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [DevStart CLI](https://github.com/yourusername/devstart-cli)

## Deploy

Deploy your application using [Vercel](https://vercel.com) or any other hosting platform.

---

Built with ❤️ using DevStart CLI
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}

async function createFolderStructure(projectPath, framework) {
  const folders = ['components', 'lib', 'hooks', 'types', 'public'];

  for (const folder of folders) {
    await fs.ensureDir(path.join(projectPath, folder));
  }
}

async function generateGitignore(projectPath) {
  const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
}

// Helper functions to get display names
function getFrameworkName(framework) {
  const names = {
    'nextjs-app': 'Next.js 16 (App Router)',
    'nextjs-pages': 'Next.js 16 (Pages Router)',
    'vite-react': 'Vite + React',
    'remix': 'Remix'
  };
  return names[framework] || framework;
}

function getStylingName(styling) {
  const names = {
    'tailwind': 'Tailwind CSS',
    'css-modules': 'CSS Modules',
    'styled-components': 'Styled Components',
    'none': 'None'
  };
  return names[styling] || styling;
}

function getUIName(ui) {
  const names = {
    'shadcn': 'shadcn/ui',
    'radix': 'Radix UI',
    'headless': 'Headless UI',
    'none': 'None'
  };
  return names[ui] || ui;
}

function getStateName(state) {
  const names = {
    'zustand': 'Zustand',
    'redux': 'Redux Toolkit',
    'jotai': 'Jotai',
    'context': 'Context API',
    'none': 'None'
  };
  return names[state] || state;
}

function getDataFetchingName(dataFetching) {
  const names = {
    'tanstack-query': 'TanStack Query',
    'swr': 'SWR',
    'apollo': 'Apollo Client',
    'fetch': 'fetch only'
  };
  return names[dataFetching] || dataFetching;
}

function getDatabaseName(database) {
  const names = {
    'supabase': 'Supabase',
    'firebase': 'Firebase',
    'prisma': 'Prisma + PostgreSQL',
    'mongodb': 'MongoDB',
    'none': 'None'
  };
  return names[database] || database;
}

function getAuthName(auth) {
  const names = {
    'supabase-auth': 'Supabase Auth',
    'nextauth': 'NextAuth.js',
    'clerk': 'Clerk',
    'firebase-auth': 'Firebase Auth',
    'none': 'None'
  };
  return names[auth] || auth;
}
