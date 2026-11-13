import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Grand Masala Bistro | Smart QR Ordering',
  description: 'Order food directly from your table',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 flex flex-col items-center">
        <div className="w-full max-w-md min-h-screen bg-white shadow-xl flex flex-col relative pb-24">
          {children}
        </div>
      </body>
    </html>
  );
}
