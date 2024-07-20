import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Rocketseat',
    template: '%s | Rocketseat',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
