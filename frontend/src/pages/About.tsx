import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Award, Users } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower individuals and businesses with intuitive financial management tools that provide clarity, control, and confidence in every transaction.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To become the leading digital payment and financial management platform, trusted by users worldwide for security, reliability, and innovation.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We are committed to delivering exceptional quality in every aspect of our platform, from security to user experience.',
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Our users are at the heart of everything we do. We continuously evolve based on feedback and changing needs.',
    },
  ];

  const advantages = [
    {
      title: 'Blockchain-Powered Security',
      description: 'Built on the Internet Computer blockchain, ensuring unparalleled security and data integrity.',
    },
    {
      title: 'Real-Time Insights',
      description: 'Get instant access to your financial data with real-time updates and comprehensive analytics.',
    },
    {
      title: 'User-Friendly Interface',
      description: 'Intuitive design that makes financial management accessible to everyone, regardless of technical expertise.',
    },
    {
      title: 'Complete Privacy',
      description: 'Your financial data is yours alone. We use decentralized identity for maximum privacy protection.',
    },
    {
      title: 'Comprehensive Tracking',
      description: 'Track every transaction, monitor trends, and maintain complete version history for audit purposes.',
    },
    {
      title: 'Always Available',
      description: 'Access your financial dashboard anytime, anywhere, from any device with internet connectivity.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              About <span className="text-primary">KD Gold Pay</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              KD Gold Pay is a next-generation digital payment and financial management solution designed to give you complete control over your finances with enterprise-grade security and user-friendly tools.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Our Purpose
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Driven by innovation and guided by our commitment to excellence.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-muted/50 py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Why KD Gold Pay Stands Out
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Discover the advantages that make KD Gold Pay the preferred choice for digital payment management.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((advantage, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              Our Story
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                KD Gold Pay was born from a simple observation: managing finances shouldn't be complicated. 
                Traditional financial management tools were either too complex for everyday users or lacked the 
                security features needed for peace of mind.
              </p>
              <p>
                We set out to create a solution that combines the best of both worlds—powerful features wrapped 
                in an intuitive interface, all built on cutting-edge blockchain technology for unmatched security.
              </p>
              <p>
                Today, KD Gold Pay serves users who demand both simplicity and sophistication in their financial 
                management tools. We continue to innovate, always keeping our users' needs at the forefront of 
                every decision we make.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
