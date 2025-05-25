import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    sessionToken?: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    sessionToken?: string;
  }
}
