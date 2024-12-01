import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../app/src/components/Navbar";
import { Footer } from "../app/src/components/Footer";

interface CustomMetadata extends Metadata {
  image?: string;
}

export const metadata: CustomMetadata = {
  title: "Stand PT",
  description: "Seu carro aqui",
  keywords: "",
  image: "/assets/images/apple-touch-icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="text-zinc-700 bg-zinc-100">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
