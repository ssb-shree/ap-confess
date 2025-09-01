import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/myComponents/Navbar";

import { Comic_Relief } from "next/font/google";
import CheckAuth from "@/myComponents/hoc/CheckAuth";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Ap-Confess | Anonymous Confessions App",
  description:
    "Share your thoughts, secrets, and confessions anonymously. A safe space to express yourself, connect with others, and read stories without judgment.",
  keywords: ["anonymous confessions", "confession app", "share secrets", "anonymous chat", "safe space", "vent online"],
  authors: [{ name: "Ap-Confess Team" }],
  creator: "Ap-Confess",
  publisher: "Ap-Confess",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Ap-Confess | Anonymous Confessions App",
    description:
      "A platform to share your secrets and stories anonymously. Engage with confessions by liking, disliking, or reporting — no judgment, just voices.",
    url: "https://yourdomain.com",
    siteName: "Ap-Confess",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ap-Confess - Anonymous Confessions App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ap-Confess | Anonymous Confessions App",
    description: "Express yourself anonymously with Ap-Confess. Share thoughts, secrets, and stories without judgment.",
    images: ["https://yourdomain.com/og-image.png"],
    creator: "@yourhandle",
  },
  verification: {
    google: "4UWpzGbWa2Ay5avi0nm3Gk6r724QeZE-2WfLwui3C4I",
  },
};

const comicRelif = Comic_Relief({
  weight: ["700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="coffee" lang="en" suppressHydrationWarning>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-MPXQSDP7VZ" strategy="afterInteractive" />
      <Script id="ga" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MPXQSDP7VZ');
          `}
      </Script>
      <body className={`${comicRelif.className} scroll-smooth overflow-x-hidden`}>
        <main>
          <CheckAuth>
            <Navbar />
            {children}
          </CheckAuth>
        </main>
      </body>
    </html>
  );
}
