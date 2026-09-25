import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: {
    default: 'MediAssist',
    template: '%s | MediAssist',
  },
  description:
    'AI-powered clinical decision support platform for symptom-based disease predictions, verified medicine details, precautions, and dietary guidance.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] antialiased selection:bg-sky-500/30 selection:text-sky-600 dark:selection:text-sky-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
