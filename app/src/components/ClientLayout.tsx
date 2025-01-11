"use client";

import React from "react";
import WhatsAppButton from "./WhatsAppButton";
import { usePathname } from "next/navigation";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  // Rotas onde o botão do WhatsApp não deve aparecer
  const excludedRoutes = ["/admin", "/login"]; // Adicione mais rotas aqui

  // Verifica se a rota atual começa com alguma rota da lista
  const shouldShowWhatsAppButton = !excludedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {children}
      {/* Exibir o botão do WhatsApp somente se não estiver em uma rota excluída */}
      {shouldShowWhatsAppButton && <WhatsAppButton />}
    </>
  );
};

export default ClientLayout;
