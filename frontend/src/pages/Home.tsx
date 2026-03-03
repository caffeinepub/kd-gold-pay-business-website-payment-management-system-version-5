import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, TrendingUp, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    } else {
      try {
        await login();
        navigate({ to: '/dashboard' });
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Bank-level security with end-to-end encryption for all your transactions.',
    },
    {
      icon: TrendingUp,
      title: 'Financial Tracking',
      description: 'Real-time insights into your income, expenses, and overall financial health.',
    },
    {
      icon: Clock,
      title: 'Transaction Management',
      description: 'Effortlessly manage and track all your financial transactions in one place.',
    },
    {
      icon: FileText,
      title: 'Version History',
      description: 'Smart version tracking and monitoring for complete audit trails.',
    },
  ];

  const benefits = [
    'Real-time transaction tracking',
    'Interactive analytics dashboard',
    'Secure Internet Identity authentication',
    'Export capabilities for reporting',
    'Mobile-responsive design',
    'Dark mode support',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/3 to-background py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center animate-in fade-in slide-in-from-left-8 duration-700">
              <Badge className="mb-4 w-fit" variant="secondary">
                Version 5 - Production Ready
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Manage Your Finances with{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                KD Gold Pay is your complete digital payment and financial management solution. 
                Track transactions, monitor expenses, and gain insights into your financial health—all in one secure platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={handleGetStarted} disabled={loginStatus === 'logging-in'} className="transition-all duration-200 hover:scale-105">
                  {loginStatus === 'logging-in' ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/about' })} className="transition-all duration-200 hover:scale-105">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
                <img
                  src="/assets/generated/dashboard-hero.dim_800x400.png"
                  alt="KD Gold Pay Dashboard"
                  className="relative rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Why Choose KD Gold Pay?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features designed to simplify your financial management and give you complete control.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Everything You Need
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive features for complete financial management
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-background p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join KD Gold Pay today and experience seamless financial management with enterprise-grade security.
            </p>
            <Button size="lg" onClick={handleGetStarted} disabled={loginStatus === 'logging-in'} className="transition-all duration-200 hover:scale-105">
              {loginStatus === 'logging-in' ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading...
                </>
              ) : (
                <>
                  Start Managing Your Finances
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
