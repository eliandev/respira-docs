import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Respira — ordená tus deudas y mirá tu salida, con calma",
  description:
    "Herramienta privada y sin juicios para ver una proyección honesta de tu salida de deudas. El cálculo corre en tu navegador: tus números no salen de tu pantalla.",
  applicationName: "Respira",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1F7A6D",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${sans.variable} antialiased`}>{children}</body>
    </html>
  );
}
