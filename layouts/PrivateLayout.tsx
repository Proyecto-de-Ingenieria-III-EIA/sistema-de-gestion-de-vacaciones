import { AppSidebar } from '@/components/atomic-design/organisms/app-sidebar';
import { ThemeProvider } from '@/components/home/theme-provider/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ApolloProvider } from '@/lib/apollo-provider';
import { ApolloProviderWrapper } from '@/lib/ApolloProviderWrapper';
import { signIn, useSession } from 'next-auth/react';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    signIn('auth0');
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <main className='flex-1 overflow-auto'>
          <div className='container'>
            <ApolloProviderWrapper>
              {/* <ApolloProvider> */}
              {children}
              {/* </ApolloProvider> */}
            </ApolloProviderWrapper>
          </div>
        </main>
      </ThemeProvider>
    </SidebarProvider>
  );
};

export { PrivateLayout };
