"use client"

import { ApolloClient, InMemoryCache, ApolloProvider as BaseApolloProvider, HttpLink } from "@apollo/client"
import { useMemo } from "react"
import type { ReactNode } from "react"

export function ApolloProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    // Nota: Las variables de entorno en el cliente deben comenzar con NEXT_PUBLIC_
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api/graphql"

    return new ApolloClient({
      link: new HttpLink({
        uri: backendUrl,
        // Puedes agregar headers adicionales si es necesario
        // headers: { ... }
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "network-only",
          nextFetchPolicy: "cache-first",
        },
      },
    })
  }, [])

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
}
