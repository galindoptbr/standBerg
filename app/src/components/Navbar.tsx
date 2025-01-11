"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import logo from "../assets/images/seustandlogo.png";

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
      <div className="w-full bg-zinc-300 shadow-lg fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center m-auto p-4 max-w-[1200px]">
          <Link href="/" replace>
            <Image className="w-48 rounded-lg" src={logo} alt="logo olavo" />
          </Link>
          {/* Navbar para telas grandes */}
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
                    : "text-zinc-700 hover:text-red-500"
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
                    : "text-zinc-700 hover:text-red-500"
                }`}
              >
                Quem Somos
              </Link>
            </li>
            {isLoggedIn && ["/", "/catalog", "/about"].includes(pathname) && (
              <li>
                <Link
                  href="/admin"
                  className="text-zinc-700 hover:text-red-500 transition-colors duration-300"
                >
                  Admin
                </Link>
              </li>
            )}
            {pathname.startsWith("/admin") && (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-zinc-700 hover:text-red-500 transition-colors duration-300"
                >
                  Sair
                </button>
              </li>
            )}
          </ul>
          <button
            onClick={toggleMenu}
            className="block lg:hidden text-white focus:outline-none"
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
          className={`lg:hidden bg-zinc-300 fixed inset-y-0 top-20 left-0 h-1/2 w-full z-10 flex flex-col justify-center items-center transition-all duration-300 gap-8 ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <li>
            <Link
              href="/"
              replace
              className={`text-red-500 hover:text-yellow-500 font-bold`}
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
              className={`text-zinc-700 font-bold hover:text-yellow-500`}
              onClick={closeMenu}
            >
              Catálogo
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`text-zinc-700 font-bold hover:text-yellow-500`}
              onClick={closeMenu}
            >
              Sobre
            </Link>
          </li>
          {isLoggedIn && ["/", "/catalog", "/about"].includes(pathname) && (
            <li>
              <Link
                href="/admin"
                className={`text-zinc-700 font-bold hover:text-yellow-500`}
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
                className="text-zinc-700 font-bold hover:text-yellow-500"
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
