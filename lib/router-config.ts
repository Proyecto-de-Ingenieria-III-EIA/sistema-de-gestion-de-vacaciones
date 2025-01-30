import { Home, LogIn } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type RouteConfig = {
  id: string;
  name: string;
  path: string;
  isPublic: boolean;
  icon?: LucideIcon;
  showInSidebar?: boolean;
};

export const routerConfig: RouteConfig[] = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    isPublic: false,
    icon: Home,
    showInSidebar: true,
  },
  {
    id: 'home',
    name: 'Page 2',
    path: '/page-2',
    isPublic: false,
    icon: Home,
    showInSidebar: true,
  },
  {
    id: 'login',
    name: 'Login',
    path: '/login',
    isPublic: true,
    icon: LogIn,
    showInSidebar: false,
  },
  // Add more routes as needed
];

// Helper function to get sidebar items
export const getSidebarItems = () =>
  routerConfig
    .filter((route) => route.showInSidebar)
    .map(({ name, path, icon }) => ({
      title: name,
      url: path,
      icon: icon || Home, // Fallback icon if none provided
    }));
