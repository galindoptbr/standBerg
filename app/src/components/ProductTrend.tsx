"use client";

import React, { useState } from "react";
import { Product } from "../types/types";
import Image from "next/image";
import Link from "next/link";

interface ProductListProps {
  products: Product[];
}

const ProductTrend: React.FC<ProductListProps> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const topProducts = products.filter((product) => product.top);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = topProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(topProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-[1200px] m-auto">
      <div className="mt-8 p-4 lg:p-0 lg:mt-16">
        <h1 className=" text-3xl font-bold">Em destaque🔥</h1>
        <p className="text-zinc-500">
          Veja nossa lista de modelos que acabaram de chegar.{" "}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 p-2 lg:p-0 mt-4">
        {currentProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} passHref>
            <div className="bg-zinc-300 rounded-lg p-4 cursor-pointer">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={300}
                height={300}
                className="w-full bg-contain rounded"
                priority
              />
              <div className="flex flex-col items-center">
                <p className="text-zinc-500 pt-2">{product.brand}</p>
                <h2 className="mt-2 text-2xl font-bold">{product.name}</h2>
                <p className="mt-2 text-lg font-semibold">
                  € {product.price.toFixed(2)}
                </p>
                <button className="bg-zinc-600 hover:bg-zinc-700 p-2 rounded-full font-bold w-48 mt-4">
                  <span className="text-white">VER PRODUTO</span>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              index + 1 === currentPage
                ? "bg-yellow-500 text-zinc-800"
                : "bg-[#282828] text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTrend;
