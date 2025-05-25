// import NextAuth from 'next-auth';
// import Auth0 from 'next-auth/providers/auth0';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { prisma } from '@/prisma';

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [Auth0],
//   adapter: PrismaAdapter(prisma),
// });

// auth.ts
// auth.ts
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Auth0 from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';

export const authConfig: NextAuthConfig = {
  providers: [Auth0],
  adapter: PrismaAdapter(prisma),

  callbacks: {
    /** Con estrategia "database" recibes `user`, no `token`. */
    async session({ session, user }) {
      // Buscamos la sesión del usuario y añadimos el sessionToken
      const dbSession = await prisma.session.findFirst({
        where: { userId: user.id },
        orderBy: { expires: 'desc' },
      });

      if (dbSession?.sessionToken) {
        // Exponemos el valor para `useSession()`
        (session as any).sessionToken = dbSession.sessionToken;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);



