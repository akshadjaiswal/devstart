// Dependency mapping as per MVP document Section 4.4

export const dependencyMap = {
  framework: {
    'nextjs-app': {
      dependencies: ['next@^15.0.0', 'react@^19.0.0', 'react-dom@^19.0.0'],
      devDependencies: ['@types/node@^22', '@types/react@^19', '@types/react-dom@^19', 'typescript@^5']
    },
    'nextjs-pages': {
      dependencies: ['next@^15.0.0', 'react@^19.0.0', 'react-dom@^19.0.0'],
      devDependencies: ['@types/node@^22', '@types/react@^19', '@types/react-dom@^19', 'typescript@^5']
    },
    'vite-react': {
      dependencies: ['react@^19.0.0', 'react-dom@^19.0.0'],
      devDependencies: [
        'vite@^6.0.0',
        '@vitejs/plugin-react@^4.3.0',
        '@types/react@^19',
        '@types/react-dom@^19',
        'typescript@^5'
      ]
    },
    'remix': {
      dependencies: [
        '@remix-run/node@^2.15.0',
        '@remix-run/react@^2.15.0',
        '@remix-run/serve@^2.15.0',
        'react@^19.0.0',
        'react-dom@^19.0.0'
      ],
      devDependencies: [
        '@remix-run/dev@^2.15.0',
        '@types/react@^19',
        '@types/react-dom@^19',
        'typescript@^5'
      ]
    }
  },

  styling: {
    'tailwind': {
      dependencies: [],
      devDependencies: ['tailwindcss@^3', 'postcss@latest', 'autoprefixer@latest']
    },
    'css-modules': {
      dependencies: [],
      devDependencies: []
    },
    'styled-components': {
      dependencies: ['styled-components@latest'],
      devDependencies: ['@types/styled-components@latest']
    },
    'none': {
      dependencies: [],
      devDependencies: []
    }
  },

  ui: {
    'shadcn': {
      dependencies: [
        '@radix-ui/react-slot@latest',
        'class-variance-authority@latest',
        'clsx@latest',
        'tailwind-merge@latest'
      ],
      devDependencies: []
    },
    'radix': {
      dependencies: ['@radix-ui/react-icons@latest'],
      devDependencies: []
    },
    'headless': {
      dependencies: ['@headlessui/react@latest'],
      devDependencies: []
    },
    'none': {
      dependencies: [],
      devDependencies: []
    }
  },

  stateManagement: {
    'zustand': {
      dependencies: ['zustand@latest'],
      devDependencies: []
    },
    'redux': {
      dependencies: ['@reduxjs/toolkit@latest', 'react-redux@latest'],
      devDependencies: []
    },
    'jotai': {
      dependencies: ['jotai@latest'],
      devDependencies: []
    },
    'context': {
      dependencies: [],
      devDependencies: []
    },
    'none': {
      dependencies: [],
      devDependencies: []
    }
  },

  dataFetching: {
    'tanstack-query': {
      dependencies: ['@tanstack/react-query@latest'],
      devDependencies: []
    },
    'swr': {
      dependencies: ['swr@latest'],
      devDependencies: []
    },
    'apollo': {
      dependencies: ['@apollo/client@latest', 'graphql@latest'],
      devDependencies: []
    },
    'fetch': {
      dependencies: [],
      devDependencies: []
    }
  },

  database: {
    'supabase': {
      dependencies: ['@supabase/supabase-js@latest', '@supabase/ssr@latest'],
      devDependencies: []
    },
    'firebase': {
      dependencies: ['firebase@latest'],
      devDependencies: []
    },
    'prisma': {
      dependencies: ['@prisma/client@latest'],
      devDependencies: ['prisma@latest']
    },
    'mongodb': {
      dependencies: ['mongodb@latest'],
      devDependencies: []
    },
    'none': {
      dependencies: [],
      devDependencies: []
    }
  },

  auth: {
    'supabase-auth': {
      dependencies: [],
      devDependencies: []
    },
    'nextauth': {
      dependencies: ['next-auth@latest'],
      devDependencies: []
    },
    'clerk': {
      dependencies: ['@clerk/nextjs@latest'],
      devDependencies: []
    },
    'firebase-auth': {
      dependencies: [],
      devDependencies: []
    },
    'none': {
      dependencies: [],
      devDependencies: []
    }
  },

  additionalTools: {
    'axios': {
      dependencies: ['axios@latest'],
      devDependencies: []
    },
    'date-fns': {
      dependencies: ['date-fns@latest'],
      devDependencies: []
    },
    'zod': {
      dependencies: ['zod@latest'],
      devDependencies: []
    },
    'react-hook-form': {
      dependencies: ['react-hook-form@latest'],
      devDependencies: []
    },
    'framer-motion': {
      dependencies: ['framer-motion@latest'],
      devDependencies: []
    },
    'lucide-react': {
      dependencies: ['lucide-react@latest'],
      devDependencies: []
    }
  }
};

// Framework-specific npm scripts
export const frameworkScripts = {
  'nextjs-app': {
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    lint: 'next lint'
  },
  'nextjs-pages': {
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    lint: 'next lint'
  },
  'vite-react': {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
    lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
  },
  'remix': {
    dev: 'remix dev',
    build: 'remix build',
    start: 'remix-serve build',
    typecheck: 'tsc'
  }
};

// Environment variables required by each integration
export const envVariables = {
  supabase: [
    'NEXT_PUBLIC_SUPABASE_URL=your-project-url',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key'
  ],
  firebase: [
    'NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id'
  ],
  prisma: [
    'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"'
  ],
  mongodb: [
    'MONGODB_URI="mongodb://localhost:27017/mydb"'
  ],
  nextauth: [
    'NEXTAUTH_URL=http://localhost:3000',
    'NEXTAUTH_SECRET=your-secret-key'
  ],
  clerk: [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-publishable-key',
    'CLERK_SECRET_KEY=your-secret-key'
  ]
};
