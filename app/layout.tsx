import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
  description: 'An application built with Google AI Studio.',
  openGraph: {
    title: 'My Google AI Studio App',
    description: 'An application built with Google AI Studio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Google AI Studio App',
    description: 'An application built with Google AI Studio.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('app_theme');
                  if (savedTheme === 'light') {
                    document.documentElement.classList.add('light-mode');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
