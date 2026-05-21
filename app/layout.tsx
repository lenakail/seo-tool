import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ranksy — SEO Audit in seconds",
  description: "Get a clear list of SEO issues and ready-made tasks for your dev team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-[var(--font-jakarta)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
