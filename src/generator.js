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
    logger.success(`Initialized ${getFrameworkName(framework)}`);

    // Copy conditional templates
    if (styling !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'styling', styling, templateVars);
      logger.success(`Configured ${getStylingName(styling)}`);
    }

    if (ui !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'ui', ui, templateVars);
      logger.success(`Added ${getUIName(ui)} components`);
    }

    if (stateManagement !== 'none' && stateManagement !== 'context') {
      await copyConditionalTemplate(projectPath, framework, 'state', stateManagement, templateVars);
      logger.success(`Setup ${getStateName(stateManagement)} store`);
    }

    if (dataFetching !== 'fetch') {
      await copyConditionalTemplate(projectPath, framework, 'data', dataFetching, templateVars);
      logger.success(`Configured ${getDataFetchingName(dataFetching)}`);
    }

    if (database !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'database', database, templateVars);
      logger.success(`Setup ${getDatabaseName(database)} client`);
    }

    if (auth !== 'none') {
      await copyConditionalTemplate(projectPath, framework, 'auth', auth, templateVars);
      logger.success(`Configured ${getAuthName(auth)}`);
    }

    // Generate package.json
    await generatePackageJson(projectPath, config);
    logger.success('Created package.json');

    // Generate .env.local.example
    await generateEnvExample(projectPath, config);
    logger.success('Created .env.local.example');

    // Generate README
    await generateReadme(projectPath, config);
    logger.success('Created README.md');

    // Create folder structure
    await createFolderStructure(projectPath, framework);
    logger.success('Created folder structure');

    // Generate .gitignore
    await generateGitignore(projectPath);
    logger.success('Created .gitignore');

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

    // Generate and save favicon
    const { generateProjectInitials, generateFaviconSVG } = await import('./utils/favicon.js');
    const initials = generateProjectInitials(projectName);
    const faviconSVG = generateFaviconSVG(initials);
    await fs.writeFile(
      path.join(projectPath, 'public', 'icon.svg'),
      faviconSVG,
      'utf-8'
    );
    logger.success(`Generated favicon with initials "${initials}"`);

    // Create minimal layout
    const { dataFetching, stateManagement } = templateVars;
    const needsQueryProvider = dataFetching === 'tanstack-query';
    const needsReduxProvider = stateManagement === 'redux';
    const needsApolloProvider = dataFetching === 'apollo';
    const needsSWRProvider = dataFetching === 'swr';
    const needsJotaiProvider = stateManagement === 'jotai';

    let imports = `import type { Metadata } from 'next'\nimport { Inter } from 'next/font/google'\nimport './globals.css'\n\nconst inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })`;
    if (needsQueryProvider) imports += `\nimport { QueryProvider } from '@/lib/query-provider'`;
    if (needsReduxProvider) imports += `\nimport { ReduxProvider } from '@/lib/redux-provider'`;
    if (needsApolloProvider) imports += `\nimport { ApolloProvider } from '@/lib/apollo-provider'`;
    if (needsSWRProvider) imports += `\nimport { SWRProvider } from '@/lib/swr-provider'`;
    if (needsJotaiProvider) imports += `\nimport { JotaiProvider } from '@/lib/jotai-provider'`;

    let childrenWrapper = 'children';
    if (needsQueryProvider) childrenWrapper = `<QueryProvider>${childrenWrapper}</QueryProvider>`;
    if (needsReduxProvider) childrenWrapper = `<ReduxProvider>${childrenWrapper}</ReduxProvider>`;
    if (needsApolloProvider) childrenWrapper = `<ApolloProvider>${childrenWrapper}</ApolloProvider>`;
    if (needsSWRProvider) childrenWrapper = `<SWRProvider>${childrenWrapper}</SWRProvider>`;
    if (needsJotaiProvider) childrenWrapper = `<JotaiProvider>${childrenWrapper}</JotaiProvider>`;

    const layoutContent = `${imports}

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Built with DevStart CLI',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>${childrenWrapper.replace('children', '{children}')}</body>
    </html>
  )
}
`;
    await fs.writeFile(path.join(projectPath, 'app', `layout.${ext}`), layoutContent);

    // Create minimal page
    const pageContent = `export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-20 border-b border-black pb-12">
          <div className="mb-4">
            <span className="text-xs font-light tracking-widest uppercase text-gray-600">
              Generated with DevStart CLI
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-tight text-black mb-6">
            ${projectName}
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl">
            Production-ready application scaffolded in 30 seconds
          </p>
        </header>

        {/* Tech Stack */}
        <section className="mb-20">
          <h2 className="text-xs font-medium tracking-widest uppercase text-black mb-8 border-b border-gray-200 pb-3">
            Your Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            ${templateVars.styling !== 'none' ? `<div className="border border-gray-200 p-6 hover:border-black transition-colors">
              <div className="text-xs font-light text-gray-500 mb-2">Styling</div>
              <div className="font-light text-black">${getStylingName(templateVars.styling)}</div>
            </div>` : ''}
            ${templateVars.ui !== 'none' ? `<div className="border border-gray-200 p-6 hover:border-black transition-colors">
              <div className="text-xs font-light text-gray-500 mb-2">UI Components</div>
              <div className="font-light text-black">${getUIName(templateVars.ui)}</div>
            </div>` : ''}
            ${templateVars.stateManagement !== 'none' ? `<div className="border border-gray-200 p-6 hover:border-black transition-colors">
              <div className="text-xs font-light text-gray-500 mb-2">State</div>
              <div className="font-light text-black">${getStateName(templateVars.stateManagement)}</div>
            </div>` : ''}
            ${templateVars.dataFetching !== 'fetch' ? `<div className="border border-gray-200 p-6 hover:border-black transition-colors">
              <div className="text-xs font-light text-gray-500 mb-2">Data Fetching</div>
              <div className="font-light text-black">${getDataFetchingName(templateVars.dataFetching)}</div>
            </div>` : ''}
            ${templateVars.database !== 'none' ? `<div className="border border-gray-200 p-6 hover:border-black transition-colors">
              <div className="text-xs font-light text-gray-500 mb-2">Database</div>
              <div className="font-light text-black">${getDatabaseName(templateVars.database)}</div>
            </div>` : ''}
            ${templateVars.auth !== 'none' ? `<div className="border border-gray-200 p-6 hover:border-black transition-colors">
              <div className="text-xs font-light text-gray-500 mb-2">Authentication</div>
              <div className="font-light text-black">${getAuthName(templateVars.auth)}</div>
            </div>` : ''}
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-20 border border-black p-8">
          <h2 className="text-xs font-medium tracking-widest uppercase text-black mb-6">
            Quick Start
          </h2>
          <div className="space-y-4 font-light text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">01</span>
              <p>Edit <code className="bg-gray-50 border border-gray-200 px-2 py-1 text-sm font-mono text-black">app/page.tsx</code> to customize this page</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">02</span>
              <p>Configure environment variables in <code className="bg-gray-50 border border-gray-200 px-2 py-1 text-sm font-mono text-black">.env.local.example</code></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">03</span>
              <p>Your integrations are ready to use in the <code className="bg-gray-50 border border-gray-200 px-2 py-1 text-sm font-mono text-black">lib/</code> folder</p>
            </div>
          </div>
        </section>

        {/* Footer / DevStart Promo */}
        <footer className="border-t border-gray-200 pt-12">
          <div className="mb-8">
            <p className="text-sm font-light text-gray-600 mb-6">
              This project was scaffolded in 30 seconds, saving you 2-4 hours of manual configuration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/akshadjaiswal/devstart"
                className="inline-block border border-black px-6 py-3 text-sm font-light hover:bg-black hover:text-white transition-colors text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                ★ Star on GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/devstart-cli"
                className="inline-block border border-gray-300 px-6 py-3 text-sm font-light hover:border-black transition-colors text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on npm
              </a>
            </div>
          </div>
          <div className="text-xs font-light text-gray-500">
            <code className="bg-gray-50 border border-gray-200 px-2 py-1 font-mono">npx devstart-cli init</code>
          </div>
        </footer>
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
        target: "ES2017",
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
  const templateBasePath = path.join(__dirname, 'templates', framework);

  // Styling
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

  // UI Components - shadcn
  if (type === 'ui' && value === 'shadcn') {
    const shadcnPath = path.join(templateBasePath, 'shadcn');
    if (await fs.pathExists(shadcnPath)) {
      await fs.copy(shadcnPath, projectPath, { overwrite: false });
    }
  }

  // State Management
  if (type === 'state') {
    if (value === 'zustand') {
      const zustandPath = path.join(templateBasePath, 'zustand');
      if (await fs.pathExists(zustandPath)) {
        await fs.copy(zustandPath, projectPath, { overwrite: false });
      }
    } else if (value === 'redux') {
      const reduxPath = path.join(templateBasePath, 'redux');
      if (await fs.pathExists(reduxPath)) {
        await fs.copy(reduxPath, projectPath, { overwrite: false });
      }
    } else if (value === 'jotai') {
      const jotaiPath = path.join(templateBasePath, 'jotai');
      if (await fs.pathExists(jotaiPath)) {
        await fs.copy(jotaiPath, projectPath, { overwrite: false });
      }
    }
  }

  // Data Fetching
  if (type === 'data') {
    if (value === 'tanstack-query') {
      const tanstackPath = path.join(templateBasePath, 'tanstack');
      if (await fs.pathExists(tanstackPath)) {
        await fs.copy(tanstackPath, projectPath, { overwrite: false });
      }
    } else if (value === 'swr') {
      const swrPath = path.join(templateBasePath, 'swr');
      if (await fs.pathExists(swrPath)) {
        await fs.copy(swrPath, projectPath, { overwrite: false });
      }
    } else if (value === 'apollo') {
      const apolloPath = path.join(templateBasePath, 'apollo');
      if (await fs.pathExists(apolloPath)) {
        await fs.copy(apolloPath, projectPath, { overwrite: false });
      }
    }
  }

  // Database
  if (type === 'database') {
    if (value === 'supabase') {
      const supabasePath = path.join(templateBasePath, 'supabase');
      if (await fs.pathExists(supabasePath)) {
        await fs.copy(supabasePath, projectPath, { overwrite: false });
      }
    } else if (value === 'prisma') {
      const prismaPath = path.join(templateBasePath, 'prisma');
      if (await fs.pathExists(prismaPath)) {
        await fs.copy(prismaPath, projectPath, { overwrite: false });
      }
    } else if (value === 'mongodb') {
      const mongoPath = path.join(templateBasePath, 'mongodb');
      if (await fs.pathExists(mongoPath)) {
        await fs.copy(mongoPath, projectPath, { overwrite: false });
      }
    } else if (value === 'firebase') {
      const firebasePath = path.join(templateBasePath, 'firebase');
      if (await fs.pathExists(firebasePath)) {
        await fs.copy(firebasePath, projectPath, { overwrite: false });
      }
    }
  }

  // Auth
  if (type === 'auth') {
    if (value === 'nextauth') {
      const nextauthPath = path.join(templateBasePath, 'nextauth');
      if (await fs.pathExists(nextauthPath)) {
        await fs.copy(nextauthPath, projectPath, { overwrite: false });
      }
    } else if (value === 'clerk') {
      const clerkPath = path.join(templateBasePath, 'clerk');
      if (await fs.pathExists(clerkPath)) {
        await fs.copy(clerkPath, projectPath, { overwrite: false });
      }
    }
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
  const scripts = { ...frameworkScripts[framework] };

  // Add Prisma postinstall script if Prisma is selected
  if (database === 'prisma') {
    scripts.postinstall = 'prisma generate';
  }

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts,
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
- [DevStart CLI](https://github.com/akshadjaiswal/devstart-cli)

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
