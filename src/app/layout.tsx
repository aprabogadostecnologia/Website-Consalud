import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Consalud — Aliado Vital SST",
  description: "Tu socio estratégico en seguridad, salud y sostenibilidad empresarial. Consultoría SST en Bogotá desde 1998.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#05123e] text-white antialiased">
        <Navbar />
        {children}
        <footer />
      </body>
    </html>
  );
}
