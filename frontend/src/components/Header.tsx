import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const currentPath = routerState.location.pathname;

  // Enhanced scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
    ...(isAuthenticated
      ? [
          { path: '/dashboard', label: 'Dashboard' },
          { path: '/version-tracker', label: 'Version Tracker' },
        ]
      : []),
  ];

  const handleNavClick = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-border/60 bg-background/80 shadow-sm backdrop-blur-lg'
          : 'border-border/40 bg-background/95 backdrop-blur'
      } supports-[backdrop-filter]:bg-background/60`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 transition-all duration-200 hover:opacity-80"
          >
            <img
              src="/assets/generated/kd-gold-pay-logo.dim_200x200.png"
              alt="KD Gold Pay"
              className="h-10 w-10 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">KD Gold Pay</h1>
              <p className="text-xs text-muted-foreground">Payment Management</p>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant={currentPath === link.path ? 'secondary' : 'ghost'}
                onClick={() => handleNavClick(link.path)}
                className="font-medium transition-all duration-200"
              >
                {link.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-all duration-200">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            className="hidden transition-all duration-200 md:flex"
          >
            {loginStatus === 'logging-in' ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Logging in...
              </>
            ) : isAuthenticated ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.path}>
                    <Button
                      variant={currentPath === link.path ? 'secondary' : 'ghost'}
                      onClick={() => handleNavClick(link.path)}
                      className="justify-start font-medium transition-all duration-200"
                    >
                      {link.label}
                    </Button>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    onClick={handleAuth}
                    disabled={disabled}
                    variant={isAuthenticated ? 'outline' : 'default'}
                    className="justify-start transition-all duration-200"
                  >
                    {loginStatus === 'logging-in' ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Logging in...
                      </>
                    ) : isAuthenticated ? (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
