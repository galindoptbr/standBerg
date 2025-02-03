"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import logo from "../assets/images/seustandlogo.png";

import {
  FaFacebook,
  FaInstagram,
  FaPhoneSquare,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Define se o usuário está logado
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao sair: ", error);
    }
  };

  return (
    <>
      <div className="w-full bg-zinc-800 lg:bg-zinc-100 shadow-lg fixed top-0 left-0 z-50">
        {/* Header Desktop */}
        <div className="hidden lg:block w-full bg-zinc-800 border-b-4 border-red-600">
          <div className="flex justify-between items-center m-auto px-8 py-4 max-w-[1200px]">
            {/* Logo */}
            <Link href="/" replace>
              <Image className="w-48" src={logo} alt="logo stand" />
            </Link>

            {/* Contato (Telefone e E-mail) */}
            <div className="flex gap-8 text-white">
              <div className="flex items-center gap-2">
                <FaPhoneSquare size={20} className="text-red-500" />
                <p className="text-lg font-semibold">999 999 999</p>
              </div>
              <div className="flex items-center gap-2">
                <MdEmail size={20} className="text-red-500" />
                <p className="text-lg font-semibold">seuemail@dominio.com</p>
              </div>
            </div>

            {/* Ícones de Redes Sociais */}
            <div className="flex gap-4 text-white cursor-pointer">
              <FaFacebook className="hover:text-red-500" size={25} />
              <FaInstagram className="hover:text-red-500" size={25} />
              <FaYoutube className="hover:text-red-500" size={25} />
            </div>
          </div>
        </div>

        {/* Header Mobile */}
        <div className="flex justify-center items-center m-auto p-4 max-w-[1200px]">
          {/* Logo visível somente em telas pequenas */}
          <Link href="/" replace className="block lg:hidden">
            <Image className="w-32" src={logo} alt="logo stand" />
          </Link>

          {/* Menu Desktop (oculto em mobile) */}
          <ul className="hidden lg:flex gap-8 items-center font-semibold">
            <li>
              <Link
                href="/"
                replace
                className={`transition-colors duration-300 ${
                  pathname === "/"
                    ? "text-red-500"
                    : "text-zinc-700 hover:text-red-500"
                }`}
                onClick={() => {
                  if (pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className={`transition-colors duration-300 ${
                  pathname === "/catalog"
                    ? "text-red-500"
                    : "text-zinc-800 hover:text-red-500"
                }`}
              >
                Carros
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`transition-colors duration-300 ${
                  pathname === "/about"
                    ? "text-red-500"
                    : "text-zinc-800 hover:text-red-500"
                }`}
              >
                Quem Somos
              </Link>
            </li>
            <li>
              <Link
                href="/intermediation"
                className={`transition-colors duration-300 ${
                  pathname === "/intermediation"
                    ? "text-red-500"
                    : "text-zinc-800 hover:text-red-500"
                }`}
              >
                Intermediação
              </Link>
            </li>
            {isLoggedIn &&
              (["/", "/catalog", "/about", "/intermediation"].includes(
                pathname
              ) ||
                pathname.startsWith("/product/")) && (
                <li>
                  <Link
                    href="/admin"
                    className="text-zinc-800 hover:text-red-500 transition-colors duration-300"
                  >
                    Admin
                  </Link>
                </li>
              )}

            {pathname.startsWith("/admin") && (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-zinc-800 hover:text-red-500 transition-colors duration-300"
                >
                  Sair
                </button>
              </li>
            )}
          </ul>
          {/* Botão do menu (visível somente em mobile) */}
          <button
            onClick={toggleMenu}
            className="block ml-auto w-max lg:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menu para telas pequenas */}
        <ul
          className={`lg:hidden bg-zinc-800 fixed inset-y-0 top-14 left-0 h-1/2 w-full z-10 flex flex-col justify-center items-center transition-all duration-300 gap-8 ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <li>
            <Link
              href="/"
              replace
              className="text-red-500 hover:text-yellow-500 font-bold"
              onClick={() => {
                closeMenu();
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              Início
            </Link>
          </li>
          <li>
            <Link
              href="/catalog"
              className="text-zinc-100 font-bold hover:text-red-500"
              onClick={closeMenu}
            >
              Catálogo
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-zinc-100 font-bold hover:text-red-500"
              onClick={closeMenu}
            >
              Quem Somos
            </Link>
          </li>
          <li>
            <Link
              href="/intermediation"
              className="text-zinc-100 font-bold hover:text-red-500"
              onClick={closeMenu}
            >
              Intermediação
            </Link>
          </li>
          {isLoggedIn && ["/", "/catalog", "/about"].includes(pathname) && (
            <li>
              <Link
                href="/admin"
                className="text-zinc-100 font-bold hover:text-red-500"
                onClick={closeMenu}
              >
                Admin
              </Link>
            </li>
          )}
          {pathname.startsWith("/admin") && (
            <li>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="text-zinc-100 font-bold hover:text-red-500"
              >
                Sair
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};
