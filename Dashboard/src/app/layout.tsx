import './globals.css';

export const metadata = {
  title: 'Air Purifier Dashboard',
  description: 'Real-time air quality monitoring dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
