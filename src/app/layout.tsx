// Root layout - apenas redirecionamento para locale
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import '../styles/fullcalendar.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
