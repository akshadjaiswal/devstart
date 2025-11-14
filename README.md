<div align="center">

# DevStart CLI

**Stop configuring. Start building.**

A powerful CLI that scaffolds production-ready Next.js projects with your preferred tech stack in 30 seconds.

[![npm version](https://img.shields.io/npm/v/devstart-cli?color=blue)](https://www.npmjs.com/package/devstart-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

```bash
npx devstart-cli init
```

[Quick Start](#quick-start) • [Features](#features) • [Tech Stack](#supported-integrations) • [Examples](#example)

</div>

---

## Why DevStart?

**Before:** Spend 2-4 hours configuring Next.js, Tailwind, Supabase, TanStack Query, Zustand, shadcn/ui, TypeScript, ESLint...

**After:** Run one command. Answer 9 questions. Start building features in 30 seconds.

DevStart generates production-ready projects with **working setup files** for all your integrations — not just dependencies, but configured clients, providers, and boilerplate.

## Quick Start

```bash
npx devstart-cli init
```

That's it. No global installation needed.

Or install globally:

```bash
npm install -g devstart-cli
devstart init
```

## Features

- ⚡ **30-Second Setup** - One command, 9 questions, done
- 📦 **13 Integrations** - Supabase, shadcn/ui, Zustand, TanStack Query, Redux, Prisma, MongoDB, and more
- 🔧 **Working Setup Files** - Get configured clients, providers, and helpers, not just dependencies
- 🎨 **Smart Provider Wrapping** - Auto-wraps layout.tsx with QueryProvider, ReduxProvider, ApolloProvider
- 📚 **Best Practices** - Proper folder structure, TypeScript configs, environment templates
- 🚀 **Production Ready** - Everything works out of the box

## What You Get

DevStart doesn't just install packages — it creates **working setup files** for your stack:

**For Supabase:** `lib/supabase/client.ts` + `lib/supabase/server.ts` — Browser and server clients ready to use

**For shadcn/ui:** `components.json` + `lib/utils.ts` — Run `npx shadcn@latest add button` immediately

**For Zustand:** `lib/example-store.ts` — Example store with counter logic

**For TanStack Query:** `lib/query-provider.tsx` — Provider auto-wrapped in layout.tsx

**For NextAuth:** `app/api/auth/[...nextauth]/route.ts` + `lib/auth.ts` — Auth handler and config

**For Prisma:** `prisma/schema.prisma` + `lib/prisma.ts` — Example schema and client

**For MongoDB:** `lib/mongodb.ts` — Connection setup with singleton pattern

**For Redux:** `lib/store.ts` + `lib/redux-provider.tsx` — Store and provider auto-wrapped

**For Firebase:** `lib/firebase.ts` — Initialized with Auth and Firestore

**For Clerk:** `middleware.ts` — Clerk middleware ready

**For Jotai:** `lib/atoms.ts` — Example atoms

**For SWR:** `lib/swr-config.ts` — SWR configuration

**For Apollo:** `lib/apollo-client.ts` + `lib/apollo-provider.tsx` — GraphQL client and provider

Plus: `.env.local.example`, `README.md`, beautiful landing page, and more.

## Example Output

```bash
$ npx devstart-cli init

Welcome to DevStart CLI! 🚀

? What's your project name? my-saas-app
? Which framework? Next.js 16 (App Router)
? Choose your styling solution: Tailwind CSS
? Add UI components? shadcn/ui
? State management? Zustand
? Data fetching? TanStack Query
? Database & Backend? Supabase
? Authentication? Supabase Auth
? Additional tools? Zod, Lucide Icons

✓ Created project folder
✓ Initialized Next.js 16 (App Router)
✓ Configured Tailwind CSS
✓ Added shadcn/ui components
✓ Setup Zustand store
✓ Configured TanStack Query
✓ Setup Supabase client
✓ Configured Supabase Auth
✓ Created package.json
✓ Created .env.local.example
✓ Initialized Git repository

✔ Dependencies installed successfully!

✅ Project created successfully!

Next steps:
  cd my-saas-app
  cp .env.local.example .env.local
  # Add your Supabase keys
  npm run dev

Your app is running at http://localhost:3000
```

## Project Structure

```
my-saas-app/
├── app/
│   ├── layout.tsx              # Auto-wrapped with providers
│   ├── page.tsx                # Beautiful landing page
│   └── globals.css
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # ✅ Browser client
│   │   └── server.ts          # ✅ Server client
│   ├── example-store.ts       # ✅ Zustand store
│   ├── query-provider.tsx     # ✅ TanStack Query provider
│   └── utils.ts               # ✅ shadcn cn() helper
├── components.json            # ✅ shadcn config
├── .env.local.example         # ✅ Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Supported Integrations

<table>
<tr>
<td>

**Frameworks**
- Next.js 16 (App/Pages Router)
- Vite + React
- Remix

**Styling**
- Tailwind CSS
- CSS Modules
- Styled Components

**UI Components**
- shadcn/ui
- Radix UI
- Headless UI

</td>
<td>

**State Management**
- Zustand
- Redux Toolkit
- Jotai
- Context API

**Data Fetching**
- TanStack Query
- SWR
- Apollo Client

**Database**
- Supabase
- Firebase
- Prisma + PostgreSQL
- MongoDB

</td>
<td>

**Authentication**
- Supabase Auth
- NextAuth.js
- Clerk
- Firebase Auth

**Additional Tools**
- Axios
- date-fns
- Zod
- React Hook Form
- Framer Motion
- Lucide Icons

</td>
</tr>
</table>

## Philosophy

DevStart CLI follows a simple philosophy:

> **One command. Zero opinions. Production ready.**

- ✅ Minimal setup files, not opinionated boilerplate
- ✅ Pick only what you need
- ✅ Everything works out of the box
- ✅ Best practices built-in
- ✅ 30 seconds from idea to code

## Development

Want to contribute or run locally?

```bash
git clone https://github.com/akshadjaiswal/devstart.git
cd devstart
npm install
npm link
devstart init
```

## Roadmap

**v1.0** (Current) - Core CLI with 13 integrations
**v1.1** (Next) - Template presets (SaaS, Blog, Dashboard)
**v1.2** (Future) - Configuration save/load
**v2.0** (Future) - Custom templates and marketplace

## Author

Built by **[Akshad Jaiswal](https://github.com/akshadjaiswal)**

- 🐦 Twitter/X: [@akshad_999](https://x.com/akshad_999)
- 💼 LinkedIn: [akshadsantoshjaiswal](https://www.linkedin.com/in/akshadsantoshjaiswal)
- 🌐 GitHub: [@akshadjaiswal](https://github.com/akshadjaiswal)

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) first.

## License

MIT © [Akshad Jaiswal](https://github.com/akshadjaiswal)

## Support

- 📖 [Documentation](https://github.com/akshadjaiswal/devstart)
- 🐛 [Issues](https://github.com/akshadjaiswal/devstart/issues)
- 💬 [Discussions](https://github.com/akshadjaiswal/devstart/discussions)

---

<div align="center">

**Stop configuring. Start building.**

Made with ❤️ for developers who want to ship faster.

[⭐ Star on GitHub](https://github.com/akshadjaiswal/devstart) • [📦 View on npm](https://www.npmjs.com/package/devstart-cli)

</div>
