import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterProviders from "@/components/providers/toaster-providers";
import ProgressBarProvider from "@/components/providers/ProgressBarProvider";
import Footer from "@/components/globals/navigation/Footer";
import { WatchHistoryStoreProvider } from "@/components/globals/histories/provider/watch-history-provider";
import dynamic from "next/dynamic";
import ScrollTop from "@/components/globals/ScrollTop";

const Navbar = dynamic(() => import("@/components/globals/navigation/Navbar"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-x-0 top-0 z-50 h-16 w-full bg-background"></div>
  ),
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Sisableng Flix",
    default: "Sisableng Flix", // a default is required when creating a template
  },
  description: "Free Movie and Series streaming website",
  icons: {
    icon: "/assets/favicon-32x32.png",
    shortcut: "/assets/favicon-32x32.png",
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    title: "SFlix",
    description: "Free Movie and Series streaming website",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "SFlix",
    images: [
      {
        url: "https://res.cloudinary.com/dswltmkrv/image/upload/v1722986205/sflix/7c837532-b80f-4cd5-b636-a7e7f5b40979_iuns0l.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: "https://res.cloudinary.com/dswltmkrv/image/upload/v1722986205/sflix/7c837532-b80f-4cd5-b636-a7e7f5b40979_iuns0l.png", // Must be an absolute URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  searchModal,
  children,
}: Readonly<{
  searchModal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ProgressBarProvider>
          <ToasterProviders>
            <WatchHistoryStoreProvider>
              <Navbar />
              <div>{searchModal}</div>
              <main className="mb-20">{children}</main>
              <Footer />
              <ScrollTop />
            </WatchHistoryStoreProvider>
          </ToasterProviders>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
