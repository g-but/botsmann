import '@/app/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Botsmann - AI Bot Suite',
  description: 'A collection of powerful AI bots for various use cases',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
