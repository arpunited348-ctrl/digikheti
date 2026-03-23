import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KrishiMitra AI — Smart Farming Assistant',
  description: 'AI-powered farming advisor for Indian farmers. Crop advice, weather alerts, spray guidance. A product by APR United.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-green-950 text-white">{children}</body>
    </html>
  );
}
