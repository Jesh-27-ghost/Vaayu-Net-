import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fresh-Route Engine | AQI-Optimized Smart Logistics",
  description:
    "Real-time Air Quality Index optimized routing for perishable goods delivery. Reduce spoilage, save costs, and protect cargo freshness with intelligent logistics powered by A* routing and Gemini AI.",
  keywords: [
    "AQI routing",
    "logistics dashboard",
    "perishable goods",
    "air quality",
    "smart routing",
    "Delhi NCR",
    "supply chain",
    "freshness tracking",
  ],
  authors: [{ name: "Jeshpreet Mahun", url: "#" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
