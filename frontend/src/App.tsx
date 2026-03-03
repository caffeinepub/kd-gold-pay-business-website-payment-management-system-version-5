import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import VersionTracker from './pages/VersionTracker';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ProfileSetupModal from './components/ProfileSetupModal';

// Root layout component with smooth transitions
function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}

// Protected layout for authenticated pages with optimized loading
function ProtectedLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const { mutate: saveProfile, isPending: isSavingProfile } = useSaveCallerUserProfile();

  const [profileName, setProfileName] = useState('');

  const handleProfileSetup = () => {
    if (profileName.trim()) {
      saveProfile({ name: profileName.trim() });
    }
  };

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Optimized loading state
  if (isInitializing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Enhanced authentication prompt
  if (!isAuthenticated) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-24">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Profile setup flow
  if (!userProfile && !profileLoading && isFetched) {
    return (
      <>
        <div className="container flex min-h-[60vh] items-center justify-center py-24">
          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Complete Your Profile</h2>
            <p className="text-muted-foreground">Let's get you set up with a profile name.</p>
          </div>
        </div>
        {showProfileSetup && (
          <ProfileSetupModal
            profileName={profileName}
            setProfileName={setProfileName}
            onSave={handleProfileSetup}
            isSaving={isSavingProfile}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Outlet />
      {showProfileSetup && (
        <ProfileSetupModal
          profileName={profileName}
          setProfileName={setProfileName}
          onSave={handleProfileSetup}
          isSaving={isSavingProfile}
        />
      )}
    </>
  );
}

// Dashboard page component with optimized data fetching
function DashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  return userProfile ? <Dashboard userName={userProfile.name} /> : null;
}

// Create root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: Services,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
});

// Protected route wrapper
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
});

// Dashboard route (protected)
const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: DashboardPage,
});

// Version Tracker route (protected)
const versionTrackerRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/version-tracker',
  component: VersionTracker,
});

// Create router with optimized configuration
const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  servicesRoute,
  contactRoute,
  protectedRoute.addChildren([dashboardRoute, versionTrackerRoute]),
]);

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
