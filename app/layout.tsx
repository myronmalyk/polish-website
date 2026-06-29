import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanta Polish — Every reflection, perfected.",
  description:
    "A high-end detailing studio for paint correction, ceramic coating, and finishes that look better than the showroom floor. By appointment — mobile or in-studio. Greater Seattle.",
  openGraph: {
    title: "Vanta Polish — Every reflection, perfected.",
    description:
      "Premium auto detailing for the Greater Seattle area. Paint correction, ceramic coating, and the perfect finish.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Manrope:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
