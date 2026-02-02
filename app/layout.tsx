import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';
import { site } from '@/lib/site';
import './globals.css';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: `${site.name} - ${site.tagline}`,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
