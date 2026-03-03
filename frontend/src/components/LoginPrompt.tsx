import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <img
            src="/assets/generated/dashboard-hero.dim_800x400.png"
            alt="Dashboard Preview"
            className="rounded-2xl shadow-2xl"
          />
        </div>
        <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Manage Your Finances with Confidence
        </h2>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Track your income and expenses, view detailed transaction history, and get real-time financial summaries.
          Secure, private, and easy to use.
        </p>
        <Button size="lg" onClick={handleLogin} disabled={loginStatus === 'logging-in'}>
          {loginStatus === 'logging-in' ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Login to Get Started
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
