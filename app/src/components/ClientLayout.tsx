"use client";

import React from "react";
import WhatsAppButton from "./WhatsAppButton";
import { usePathname } from "next/navigation";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  return (
    <>
      {children}
      {/* Exibir o botão do WhatsApp somente se a rota não começar com "/admin" */}
      {!pathname.startsWith("/admin") && <WhatsAppButton />}
    </>
  );
};

export default ClientLayout;
