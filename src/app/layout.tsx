import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { AppNav } from "@/components/AppNav";
import { ProgressProvider } from "@/hooks/ProgressProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cert Exam Trainer",
  description:
    "Daily practice for top cert exams — CKA, AWS SAA-C03, AWS Cloud Practitioner, AZ-104 and Security+ — with streaks and progress tracking.",
  applicationName: "Cert Exam Trainer",
  authors: [{ name: "Shohrab Hossen Niaz" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cert Trainer",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProgressProvider>
          <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-6 sm:px-6">
            <AppNav />
            {children}
          </div>
          <ServiceWorkerRegister />
        </ProgressProvider>
      </body>
    </html>
  );
}
