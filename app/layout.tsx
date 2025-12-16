import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "KrixFlow Inventory",
  description: "Modern inventory management system for hardware businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}