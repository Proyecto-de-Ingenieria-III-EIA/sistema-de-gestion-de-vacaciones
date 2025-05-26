'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calendar, Briefcase, BarChart3, Inbox, Home } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/',
      label: 'Inicio',
      icon: Home,
      active: pathname === '/',
    },
    {
      href: '/absence-calendar',
      label: 'Calendario',
      icon: Calendar,
      active: pathname === '/absence-calendar',
    },
    {
      href: '/request-absence',
      label: 'Solicitar',
      icon: Briefcase,
      active: pathname === '/request-absence',
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      active: pathname === '/dashboard',
    },
    {
      href: '/mailbox',
      label: 'Aprobaciones',
      icon: Inbox,
      active: pathname === '/mailbox',
    },
  ];

  return (
    <nav className='flex items-center space-x-4 lg:space-x-6'>
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              route.active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className='h-4 w-4 mr-2' />
            <span className='hidden md:inline'>{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
