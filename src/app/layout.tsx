import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEOPROF - Centro de Comando POF",
  description: "Direcionamento e Acompanhamento do Método POF (Produto -> Oferta -> Funil)",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
