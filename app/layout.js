import './globals.css';

export const metadata = {
  title: 'CORA',
  description: 'Your Personal AI Operating System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}