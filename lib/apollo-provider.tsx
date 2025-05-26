// "use client"

// import { ApolloClient, InMemoryCache, ApolloProvider as BaseApolloProvider, HttpLink } from "@apollo/client"
// import { useMemo } from "react"
// import type { ReactNode } from "react"

// export function ApolloProvider({ children }: { children: ReactNode }) {
//   const client = useMemo(() => {
//     // Nota: Las variables de entorno en el cliente deben comenzar con NEXT_PUBLIC_
//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api/graphql"
    
//     // Obtener el token de sesión (puedes ajustar esto según cómo almacenes tu token)
//     const sessionToken = localStorage.getItem('authjs.session-token') || sessionStorage.getItem('authjs.session-token') 
//    || null;
//    console.log(sessionToken)

//     return new ApolloClient({
//       link: new HttpLink({
//         uri: backendUrl,
//         headers: {
//           // Añadir el header session-token
//           'session-token': sessionToken || '45eaded6-d06c-492c-a3b5-3c7ea55a7983',
//           // Agregar más headers si es necesario
//         }
//       }),
//       cache: new InMemoryCache(),
//       defaultOptions: {
//         watchQuery: {
//           fetchPolicy: "network-only",
//           nextFetchPolicy: "cache-first",
//         },
//       },
//     })
//   }, [])

//   return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
// }