import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cert Exam Trainer",
  description:
    "Daily practice questions for CKA, AZ-104 and Security+ with streaks and progress tracking.",
  applicationName: "Cert Exam Trainer",
  authors: [{ name: "Shohrab Hossen Niaz" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cert Trainer",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
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
        <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-6 sm:px-6">
          {children}
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
