import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SRMS | Manager Live Floor Map & Staff Portal',
  description: 'Smart Restaurant Management System Floor Control & KDS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
