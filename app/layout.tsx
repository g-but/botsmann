import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'Botsmann - Private AI for Your Data',
  description: 'AI assistants that work with your documents. Pre-built experts for legal, medical, research, or bring your own data. Your data stays private.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
