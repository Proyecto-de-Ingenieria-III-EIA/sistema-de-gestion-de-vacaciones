import { AppSidebar } from '@/components/atomic-design/organisms/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
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
      <main className='flex-1 overflow-auto'>
        <div className='container'>{children}</div>
      </main>
    </SidebarProvider>
  );
};

export { PrivateLayout };
