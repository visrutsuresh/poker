import type { Metadata } from "next";
import localFont from "next/font/local";
import "./colours.generated.css";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Variable.ttf", style: "normal" },
    { path: "../fonts/Satoshi-VariableItalic.ttf", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const cabinet = localFont({
  src: "../fonts/CabinetGrotesk-Variable.ttf",
  variable: "--font-cabinet",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poker | High Stakes Online",
  description: "Play poker online. Elegant, immersive, real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} ${cabinet.variable} bg-colour1 font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
