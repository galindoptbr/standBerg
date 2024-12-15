"use client";

import Image from "next/image";
import React from "react";

import paymentsMethods from "../assets/images/payments.png";
import { BsWhatsapp } from "react-icons/bs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ImFacebook2, ImInstagram, ImYoutube } from "react-icons/im";
import { CiLinkedin } from "react-icons/ci";

export const Footer = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="w-full bg-zinc-200 mt-24 p-6 h-[600px] lg:h-72">
        <div className="flex flex-col items-center justify-between max-w-[1200px] m-auto gap-6 lg:flex-row">
          <div className="flex flex-col gap-4 w-96 p-4 lg:p-0">
            <p className="font-semibold text-xl">Informações de contato</p>
            <div className="flex gap-4">
              <BsWhatsapp className="text-green-500" size={40} />
              <p>
                Você tem alguma pergunta? <br /> Envie uma mensagem para nós
                pelo WhatsApp:
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              className="inline-block"
            >
              <button className="flex items-center justify-center gap-2 bg-green-600 p-2 rounded-md w-full m-auto hover:bg-green-500 transition-colors duration-300 text-zinc-200">
                <BsWhatsapp />
                <span className="font-semibold">Enviar mensagem</span>
              </button>
            </a>
          </div>

          <div className="flex flex-col">
            <p className="font-semibold text-xl mb-4">índice</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  replace
                  className={`transition-colors duration-300 flex items-center ${
                    pathname === "/"
                      ? "text-red-500"
                      : "text-zinc-500 hover:text-red-500"
                  }`}
                >
                  <MdKeyboardArrowRight />
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className={`transition-colors duration-300 flex items-center ${
                    pathname === "/catalog"
                      ? "text-red-500"
                      : "text-zinc-500 hover:text-red-500"
                  }`}
                >
                  <MdKeyboardArrowRight />
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`transition-colors duration-300 flex items-center ${
                    pathname === "/about"
                      ? "text-red-500"
                      : "text-zinc-500 hover:text-red-500"
                  }`}
                >
                  <MdKeyboardArrowRight />
                  Quem Somos
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-bold">Formas de Pagamento</p>
            <Image
              className="w-48 mt-4 rounded-md"
              src={paymentsMethods}
              alt="metodos de pagamento"
            />
            <div className="flex flex-col mt-4 items-center">
              <p className="font-bold mb-3">Nos siga nas redes sociais:</p>
              <div className="flex gap-3">
                <Link
                  href="https://www.instagram.com"
                  target="_blank"
                >
                  <ImInstagram className="hover:text-zinc-300" size={30} />
                </Link>
                <Link
                  href="https://www.facebook.com"
                  target="_blank"
                >
                  <ImFacebook2 className="hover:text-zinc-300" size={30} />
                </Link>
                <Link
                  href="https://www.youtube.com"
                  target="_blank"
                >
                  <ImYoutube className="hover:text-zinc-300" size={35} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-16 border-t-2 border-zinc-100 bg-zinc-200">
        <div className="flex gap-2 justify-center mt-4">
          <p>© 2024 desenvolvido por -</p>
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
