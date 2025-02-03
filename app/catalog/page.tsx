"use client";

import { usePathname } from "next/navigation";
import ProductList from "../src/components/ProductList";
import React from "react";
import Link from "next/link";

const Catalog = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="mt-10 md:mt-32">
        <div className="flex gap-2 md:mt-44 mt-24 pl-10  m-auto max-w-[1200px] ">
          <ul className="flex gap-2">
            <li>
              <Link
                href="/"
                replace
                className={`transition-colors duration-300 ${
                  pathname === "/"
                    ? "text-yellow-500"
                    : "text-zinc-400 hover:text-red-500"
                }`}
              >
                Início /
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`transition-colors duration-300 ${
                  pathname === "/catalog"
                    ? "text-zinc-400"
                    : "text-zinc-400 hover:text-red-500"
                }`}
              >
                Catálogo
              </Link>
            </li>
          </ul>
        </div>
        <ProductList />
      </div>
    </>
  );
};

export default Catalog;
