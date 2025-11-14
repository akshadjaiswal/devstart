# DevStart CLI

> Stop configuring. Start building.

A powerful CLI tool that scaffolds production-ready Next.js, Vite, and Remix projects with your preferred tech stack in seconds.

## Features

- 🚀 **Interactive CLI** - Answer 9 simple questions, get a fully configured project
- ⚡ **Multiple Frameworks** - Next.js (App/Pages Router), Vite + React, Remix
- 🎨 **Flexible Stack** - Choose only what you need: styling, UI components, state management, and more
- 📦 **Smart Dependencies** - Automatically installs and configures your selected integrations
- 🔧 **Zero Config** - Everything works out of the box
- 📚 **Best Practices** - Includes proper folder structure and configurations

## Quick Start

### Installation

You can use DevStart CLI without installing it globally:

```bash
npx @devstart/cli
```

Or install it globally:

```bash
npm install -g @devstart/cli
devstart init
```

### Usage

Simply run the command and answer the prompts:

```bash
npx @devstart/cli
```

Or if installed globally:

```bash
devstart init
```

## What Gets Created?

DevStart CLI asks you 9 questions:

1. **Project Name** - Your project name
2. **Framework** - Next.js App Router, Next.js Pages Router, Vite + React, or Remix
3. **Styling** - Tailwind CSS, CSS Modules, Styled Components, or None
4. **UI Components** - shadcn/ui, Radix UI, Headless UI, or None
5. **State Management** - Zustand, Redux Toolkit, Jotai, Context API, or None
6. **Data Fetching** - TanStack Query, SWR, Apollo Client, or fetch only
7. **Database** - Supabase, Firebase, Prisma + PostgreSQL, MongoDB, or None
8. **Authentication** - Supabase Auth, NextAuth.js, Clerk, Firebase Auth, or None
9. **Additional Tools** - Axios, date-fns, Zod, React Hook Form, Framer Motion, Lucide Icons (multi-select)

Plus:
- **TypeScript** - Yes (recommended)
- **Git** - Initialize Git repository
- **Install** - Install dependencies now

## Example

```bash
$ npx @devstart/cli

Welcome to DevStart CLI! 🚀

? What's your project name? my-awesome-app
? Which framework? Next.js 16 (App Router)
? Choose your styling solution: Tailwind CSS
? Add UI components? shadcn/ui
? State management? Zustand
? Data fetching? TanStack Query
? Database & Backend? Supabase
? Authentication? Supabase Auth
? Additional tools? Zod, Lucide Icons
? TypeScript? Yes
? Initialize Git? Yes
? Install dependencies now? Yes

Creating your project... ⚙️

✓ Created project folder
✓ Initialized Next.js 16 (App Router)
✓ Configured Tailwind CSS
✓ Added shadcn/ui components
✓ Setup Zustand store
✓ Configured TanStack Query
✓ Setup Supabase client
✓ Configured Supabase Auth
✓ Created folder structure
✓ Generated boilerplate files
✓ Created .env.local.example
✓ Initialized Git repository

📦 Installing dependencies...

✅ Project created successfully!

Next steps:
  1. cd my-awesome-app
  2. Copy .env.local.example to .env.local
  3. Add your environment variables
  4. npm run dev

Happy coding! 🎉
```

## Project Structure

Generated projects follow this structure:

```
my-awesome-app/
├── app/                    # Next.js app directory (or src/ for Vite)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/             # React components
├── lib/                    # Utilities and configurations
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
├── public/                 # Static assets
├── .env.local.example      # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js      # If Tailwind selected
├── next.config.js          # Framework config
└── README.md               # Generated documentation
```

## Supported Integrations

### Frameworks
- Next.js 16 (App Router)
- Next.js 16 (Pages Router)
- Vite + React
- Remix

### Styling
- Tailwind CSS
- CSS Modules
- Styled Components

### UI Components
- shadcn/ui
- Radix UI
- Headless UI

### State Management
- Zustand
- Redux Toolkit
- Jotai
- Context API

### Data Fetching
- TanStack Query
- SWR
- Apollo Client

### Database
- Supabase
- Firebase
- Prisma + PostgreSQL
- MongoDB

### Authentication
- Supabase Auth
- NextAuth.js
- Clerk
- Firebase Auth

### Additional Tools
- Axios (HTTP client)
- date-fns (Date utilities)
- Zod (Validation)
- React Hook Form
- Framer Motion (Animations)
- Lucide Icons

## Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn, pnpm, bun)

## Development

To work on the CLI locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/devstart-cli.git
cd devstart-cli

# Install dependencies
npm install

# Link the CLI globally
npm link

# Now you can use it
devstart init
```

## Philosophy

DevStart CLI follows a simple philosophy:

**One thing done well. Generate a configured project. That's it.**

We focus on:
- ✅ Quality over quantity
- ✅ Flexibility - pick only what you need
- ✅ No bloat - minimal, working code
- ✅ Best practices built-in
- ✅ Fast project setup (< 2 minutes)

We explicitly **don't** include (for MVP):
- ❌ Template presets (coming in v1.1)
- ❌ Configuration save/load (coming in v1.1)
- ❌ Code generation (coming later)
- ❌ Addon system (coming later)

## Roadmap

### v1.0 (MVP) - Current
- Interactive CLI with 9 prompts
- 4 framework options
- 30+ integrations
- Project generation
- Dependency installation

### v1.1 - Planned
- Template presets (SaaS, Blog, Dashboard, etc.)
- Configuration save/load
- Better error messages
- More examples in docs

### v1.2 - Future
- Remote template support
- Update notifications
- Usage analytics (opt-in)

### v2.0 - Future
- Addon system
- Code generation
- Migration tools
- Template marketplace

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## License

MIT © [Akshad](https://github.com/yourusername)

## Support

- 📖 [Documentation](https://github.com/yourusername/devstart-cli)
- 🐛 [Report Issues](https://github.com/yourusername/devstart-cli/issues)
- 💬 [Discussions](https://github.com/yourusername/devstart-cli/discussions)

---

**Built with ❤️ by developers, for developers.**

Stop wasting hours on project setup. Start building features from day one with DevStart CLI.
