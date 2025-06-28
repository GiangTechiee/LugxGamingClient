import Header from '@/components/layout/Header';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import OverlayWrapper from '@/components/common/OverlayWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="vi">
      <body className="flex flex-col">
        <Header />
        <main>{children}</main>
        <OverlayWrapper />
        <Toaster
          toastOptions={{
            // Default options for all toasts
            duration: 3000,
            style: {
              background: '#ffffff', 
              color: '#000000',
              border: '1px solid #374151', // gray-700
            },
            success: {
              iconTheme: {
                primary: '#10b981', // green
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // red
                secondary: '#ffffff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#3b82f6', // blue
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
