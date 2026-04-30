import type { Metadata } from 'next';
import { Space_Grotesk, Playfair_Display } from 'next/font/google';
import { ReactNode } from 'react';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

const sansFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'User Management System',
    template: '%s | User Management System',
  },
  description:
    'Production-ready user management system built with Next.js, Express, MongoDB, and TypeScript.',
  keywords: ['MERN', 'Next.js', 'TypeScript', 'authentication', 'user management'],
};

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props)=> {
  return (
    <html lang="en" className={`${sansFont.variable} ${displayFont.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
