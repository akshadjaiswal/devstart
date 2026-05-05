// Auth.js v5 (NextAuth)
// Add providers in .env.local:
// - AUTH_GITHUB_ID, AUTH_GITHUB_SECRET
// - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
// - AUTH_SECRET (generate with: npx auth secret)

import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Google,
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Return true if user is authenticated
      return !!auth
    },
  },
})
