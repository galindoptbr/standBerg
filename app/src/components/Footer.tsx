"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { CiLinkedin } from "react-icons/ci";

import logo from "../assets/images/seustandlogo.png";

export const Footer = () => {
  const pdfPoliticas = "/pdf/privacidade.pdf";

  return (
    <>
      <div className="w-full bg-zinc-900 p-6 flex flex-col items-center text-center mt-20">
        {/* Logo */}
        <Image
          src={logo}
          alt="Logo"
          width={250}
          height={80}
          className="mb-4"
        />

        {/* Informações da empresa */}
        <p className="text-zinc-400 text-sm">Seu Stand - NIF: 999999999</p>
        <p className="text-zinc-400 text-sm">Copyright © 2025 Seu Stand</p>

        {/* Links institucionais */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-zinc-400">
          <Link href={pdfPoliticas} target="_blank">
            <p className="hover:text-zinc-200 transition-colors cursor-pointer">
              TERMOS E CONDIÇÕES
            </p>
          </Link>
          <span className="text-zinc-500">|</span>
          <Link href={pdfPoliticas} target="_blank">
            <p className="hover:text-zinc-200 transition-colors cursor-pointer">
              POLÍTICA DE PRIVACIDADE
            </p>
          </Link>
          <span className="text-zinc-500">|</span>
          <Link href={pdfPoliticas} target="_blank">
            <p className="hover:text-zinc-200 transition-colors cursor-pointer">
              CONFLITOS DE CONSUMO
            </p>
          </Link>
          <span className="text-zinc-500">|</span>
          <Link href="https://www.livroreclamacoes.pt/Inicio/" target="_blank">
            <p className="hover:text-zinc-200 transition-colors cursor-pointer">
              LIVRO DE RECLAMAÇÕES
            </p>
          </Link>
          <span className="text-zinc-500">|</span>
          <Link href="/intermediacao.pdf" target="_blank">
            <p className="hover:text-zinc-200 transition-colors cursor-pointer">
              INTERMEDIAÇÃO DE CRÉDITO
            </p>
          </Link>
        </div>
      </div>
      {/* Rodapé com créditos */}
      <div className="w-full h-16 border-t border-zinc-700 bg-zinc-900">
        <div className="flex gap-2 justify-center mt-4">
          <p className="text-zinc-400">© 2025 desenvolvido por -</p>
          <span className="flex items-center text-blue-500 hover:text-blue-400">
            <CiLinkedin />
            <Link
              href="https://www.linkedin.com/in/galindoptbr/"
              target="_blank"
            >
              <p className="cursor-pointer">GalindoPtBr</p>
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};
