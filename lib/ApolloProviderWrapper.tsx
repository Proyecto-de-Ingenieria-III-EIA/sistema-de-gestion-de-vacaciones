'use client';

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  /** Espera a que NextAuth termine de cargar */
  const client = useMemo(() => {
    if (status === 'loading') return null;

    const httpLink = new HttpLink({
      uri: '/api/graphql', // mismo dominio
      credentials: 'same-origin', // envía la cookie
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'session-token': (session as any)?.sessionToken ?? '', // <- aquí el valor real
      },
    }));

    return new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [session, status]);

  if (!client) return null; // o un spinner

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
