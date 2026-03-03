import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, FileText, Clock, Lock, BarChart3, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function Services() {
  const navigate = useNavigate();

  const mainServices = [
    {
      icon: Shield,
      title: 'Secure Payment Processing',
      description: 'Process payments with confidence using our blockchain-powered security infrastructure.',
      features: [
        'End-to-end encryption',
        'Multi-factor authentication',
        'Fraud detection and prevention',
        'Compliance with industry standards',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Transaction Management',
      description: 'Comprehensive tools to manage all your financial transactions in one centralized platform.',
      features: [
        'Real-time transaction tracking',
        'Categorization and tagging',
        'Bulk transaction operations',
        'Transaction history and search',
      ],
    },
    {
      icon: BarChart3,
      title: 'Financial Tracking & Reporting',
      description: 'Gain deep insights into your financial health with powerful analytics and reporting tools.',
      features: [
        'Income and expense summaries',
        'Custom financial reports',
        'Trend analysis and forecasting',
        'Export capabilities for accounting',
      ],
    },
    {
      icon: FileText,
      title: 'Smart Version History Monitoring',
      description: 'Track changes and maintain complete audit trails with our intelligent version control system.',
      features: [
        'Automatic version tracking',
        'Change history and logs',
        'Export to multiple formats',
        'Compliance documentation',
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is encrypted and stored securely on the blockchain with decentralized identity.',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access your financial dashboard anytime, anywhere, from any device.',
    },
    {
      icon: Database,
      title: 'Data Integrity',
      description: 'Blockchain technology ensures your financial records are tamper-proof and verifiable.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience instant updates and real-time synchronization across all your devices.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Comprehensive financial management solutions designed to meet all your payment processing and tracking needs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Core Services
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to manage your finances effectively and securely.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {mainServices.map((service, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="bg-muted/50 py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Additional Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Built-in capabilities that enhance your experience and ensure peace of mind.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {additionalFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Experience the power of KD Gold Pay's comprehensive financial management services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate({ to: '/contact' })}>
                Contact Us
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/about' })}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
