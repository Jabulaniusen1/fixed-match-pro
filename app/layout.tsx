import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PWAHead } from "@/components/pwa/pwa-head";
// import { CustomerCareChatButton } from "@/components/layout/customer-care-chat-button";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Fixed Match Pro - Accurate Football Predictions & Betting Tips",
    template: "%s | Fixed Match Pro"
  },
  description: "Get professional fixed match predictions, accurate betting tips, and expert analysis. Premium fixed match predictions, VIP packages, correct score tips, and live scores. Trusted by thousands of bettors worldwide.",
  keywords: [
    "fixed match predictions",
    "fixed match pro",
    "fixed predictions",
    "football predictions",
    "betting tips",
    "soccer predictions",
    "football betting",
    "sports betting tips",
    "accurate predictions",
    "VIP predictions",
    "correct score predictions",
    "free football tips",
    "daily predictions",
    "betting advice",
    "football analysis",
    "fixed match tips"
  ],
  authors: [{ name: "Fixed Match Pro" }],
  creator: "Fixed Match Pro",
  publisher: "Fixed Match Pro",
  manifest: "/manifest.json",
  themeColor: "#1e3a8a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fixed Match Pro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fixedmatchpro.com",
    siteName: "Fixed Match Pro",
    title: "Fixed Match Pro - Accurate Football Predictions & Betting Tips",
    description: "Get professional fixed match predictions, accurate betting tips, and expert analysis. Premium fixed match predictions, VIP packages, and correct score tips.",
  },
  twitter: {
    card: "summary_large_image",
  title: "Fixed Match Pro - Accurate Football Predictions",
    description: "Get accurate football predictions, betting tips, and expert analysis.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fixedmatchpro.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/fixed-match-pro favicon.png',
    shortcut: '/fixed-match-pro favicon.png',
    apple: '/fixed-match-pro favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-montserrat antialiased`}
      >
        {/* <script
          src="https://nordan-backend-production.up.railway.app/public/widget.js"
          defer
          {...({ nordankey: "drsQsq8VSVOimI" } as any)}
        /> */}
        <PWAHead />
        {children}
        <Toaster />
        <InstallPrompt />
        {/* <CustomerCareChatButton /> */}
        {/* Tawk.to Chat Widget */}
        {/* <Script
          id="tawk-to-script"
          strategy="afterInteractive" 
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/692cff132e3bec197df70f89/1jbbs8q3a';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        /> */}
      </body>
    </html>
  );
}
