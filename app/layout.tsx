import './globals.css';

export const metadata = {
  title: 'LagosTechBoy — Software Engineer',
  description: 'Abiodun Adeniji (LagosTechBoy) — Software Engineer. WordPress, Laravel, Headless.'
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
