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
      devDependencies: ['tailwindcss@^3.4.0', 'postcss@^8.4.0', 'autoprefixer@^10.4.0']
    },
    'css-modules': {
      dependencies: [],
      devDependencies: []
    },
    'styled-components': {
      dependencies: ['styled-components@^6.1.0'],
      devDependencies: ['@types/styled-components@^5.1.0']
    },
    'none': {
      dependencies: [],
      devDependencies: []
    }
  },

  ui: {
    'shadcn': {
      dependencies: [
        '@radix-ui/react-slot@^1.1.0',
        'class-variance-authority@^0.7.0',
        'clsx@^2.1.0',
        'tailwind-merge@^2.5.0'
      ],
      devDependencies: []
    },
    'radix': {
      dependencies: ['@radix-ui/react-icons@^1.3.0'],
      devDependencies: []
    },
    'headless': {
      dependencies: ['@headlessui/react@^2.2.0'],
      devDependencies: []
    },
    'none': {
      dependencies: [],
      devDependencies: []
    }
  },

  stateManagement: {
    'zustand': {
      dependencies: ['zustand@^5.0.0'],
      devDependencies: []
    },
    'redux': {
      dependencies: ['@reduxjs/toolkit@^2.3.0', 'react-redux@^9.1.0'],
      devDependencies: []
    },
    'jotai': {
      dependencies: ['jotai@^2.10.0'],
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
      dependencies: ['@tanstack/react-query@^5.59.0'],
      devDependencies: []
    },
    'swr': {
      dependencies: ['swr@^2.2.0'],
      devDependencies: []
    },
    'apollo': {
      dependencies: ['@apollo/client@^3.11.0', 'graphql@^16.9.0'],
      devDependencies: []
    },
    'fetch': {
      dependencies: [],
      devDependencies: []
    }
  },

  database: {
    'supabase': {
      dependencies: ['@supabase/supabase-js@^2.45.0', '@supabase/ssr@^0.5.0'],
      devDependencies: []
    },
    'firebase': {
      dependencies: ['firebase@^11.0.0'],
      devDependencies: []
    },
    'prisma': {
      dependencies: ['@prisma/client@^6.0.0'],
      devDependencies: ['prisma@^6.0.0']
    },
    'mongodb': {
      dependencies: ['mongodb@^6.10.0'],
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
      dependencies: ['next-auth@^5.0.0-beta.25'],
      devDependencies: []
    },
    'clerk': {
      dependencies: ['@clerk/nextjs@^6.7.0'],
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
      dependencies: ['axios@^1.7.0'],
      devDependencies: []
    },
    'date-fns': {
      dependencies: ['date-fns@^4.1.0'],
      devDependencies: []
    },
    'zod': {
      dependencies: ['zod@^3.23.0'],
      devDependencies: []
    },
    'react-hook-form': {
      dependencies: ['react-hook-form@^7.53.0'],
      devDependencies: []
    },
    'framer-motion': {
      dependencies: ['framer-motion@^11.11.0'],
      devDependencies: []
    },
    'lucide-react': {
      dependencies: ['lucide-react@^0.460.0'],
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
