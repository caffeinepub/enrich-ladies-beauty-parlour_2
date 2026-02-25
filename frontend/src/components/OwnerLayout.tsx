import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MoreVertical, Home, Calendar, Scissors, Palette, Star, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '../lib/authStore';

interface OwnerLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function OwnerLayout({ children, title = 'Owner Dashboard' }: OwnerLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const menuItems = [
    { label: 'Home', icon: Home, path: '/owner-dashboard' },
    { label: 'Appointments of the Day', icon: Calendar, path: '/owner/appointments' },
    { label: 'Manage Services', icon: Scissors, path: '/owner/manage-services' },
    { label: 'Theme & Customization', icon: Palette, path: '/owner/theme-customization' },
    { label: 'Reviews', icon: Star, path: '/owner/reviews' },
    { label: 'Profile', icon: User, path: '/owner/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 shadow-lg shadow-purple-900/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/salon-logo.dim_512x512.png"
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-300/50"
            />
            <div>
              <h1 className="text-white font-semibold text-sm font-playfair leading-tight">Enrich Beauty</h1>
              <p className="text-purple-300 text-xs">{title}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-purple-100 shadow-xl rounded-2xl p-1">
              {menuItems.map(item => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-purple-50 text-purple-900 font-medium"
                >
                  <item.icon className="w-4 h-4 text-purple-600" />
                  {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-1 bg-purple-100" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content */}
      <main className="pb-8">{children}</main>

      {/* Footer */}
      <footer className="bg-purple-900 text-purple-300 text-center py-4 text-xs">
        <p>
          Built with{' '}
          <span className="text-pink-400">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-200 hover:text-white transition-colors underline"
          >
            caffeine.ai
          </a>{' '}
          · © {new Date().getFullYear()} Enrich Ladies Beauty Parlour
        </p>
      </footer>
    </div>
  );
}
