import { Heart } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const navigate = useNavigate();

  const footerLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { icon: SiFacebook, label: 'Facebook', href: '#' },
    { icon: SiX, label: 'X (Twitter)', href: '#' },
    { icon: SiLinkedin, label: 'LinkedIn', href: '#' },
    { icon: SiInstagram, label: 'Instagram', href: '#' },
  ];

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/assets/generated/kd-gold-pay-logo.dim_200x200.png"
                alt="KD Gold Pay"
                className="h-10 w-10 rounded-lg shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold">KD Gold Pay</h3>
                <p className="text-xs text-muted-foreground">Payment Management</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure digital payment and financial management solution for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="link"
                  onClick={() => navigate({ to: link.path })}
                  className="justify-start px-0 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </Button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Connect With Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                  onClick={() => window.open(social.href, '_blank')}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 KD Gold Pay. Built with{' '}
            <Heart className="inline h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors duration-200 hover:text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
