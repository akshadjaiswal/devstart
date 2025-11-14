'use client'

import { ApolloProvider as Provider } from '@apollo/client'
import { apolloClient } from './apollo-client'

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={apolloClient}>{children}</Provider>
}
