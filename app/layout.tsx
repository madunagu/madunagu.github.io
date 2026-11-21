import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ekene Madunagu — Full-Stack Software Engineer',
  description: 'Ekene David Madunagu is a full-stack software engineer building digital products, distributed systems and thoughtful web experiences.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
