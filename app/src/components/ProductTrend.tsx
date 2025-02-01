"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Product } from "../types/types";
import Image from "next/image";
import Link from "next/link";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const ProductTrend: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // Função para mapear os dados do Firestore para Product
  const mapProduct = (doc: any): Product => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "Produto sem nome",
      price: data.price ? Number(data.price) : 0,
      description: data.description || "Sem descrição",
      images: data.images?.length ? data.images : ["/placeholder.jpg"],
      brand: data.brand || "Marca desconhecida",
      kilometers: data.kilometers || "Sem Quilometragem",
      fuel: data.fuel || "Combustível desconhecido",
      gearbox: data.gearbox || "Câmbio desconhecido",
      power: data.power || "Potência desconhecida",
      top: data.top || false,
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(mapProduct);
        setProducts(productsData);
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Calcula somente os produtos em destaque
  const topProducts = useMemo(
    () => products.filter((product) => product.top),
    [products]
  );

  // Paginação
  const totalPages = useMemo(
    () => Math.ceil(topProducts.length / productsPerPage),
    [topProducts]
  );

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return topProducts.slice(start, start + productsPerPage);
  }, [topProducts, currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-[1200px] m-auto">
      <div className="p-8 lg:p-10">
        <h1 className="text-3xl font-semibold text-center">Acabou de chegar</h1>
        <p className="text-zinc-500 text-md text-center">
          Veja nossa lista de modelos que acabaram de chegar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 p-2 lg:p-0">
        {currentProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} passHref>
            <div className="relative bg-zinc-50 border border-zinc-200 rounded-lg p-4 cursor-pointer">
              {product.top && (
                <span className="absolute italic top-0 left-0 p-2 px-4 text-zinc-100 font-bold text-sm rounded-tl-lg bg-gradient-to-r from-red-500 via-red-500/90 to-red-500/0">
                  Novidade 🔥
                </span>
              )}
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
                <p className="mt-2 text-2xl text-zinc-600 font-bold">
                  {product.name}
                </p>
                <span className="flex bg-red-500 py-1 px-4 rounded-md text-zinc-100 items-center gap-1 mt-2 text-2xl font-semibold mb-4">
                  {new Intl.NumberFormat("de-DE").format(product.price)}{" "}
                  <span className="text-sm">EUR</span>
                </span>
                <div className="flex gap-1 text-zinc-500 text-xs">
                  <p>
                    {new Intl.NumberFormat("de-DE").format(product.kilometers)}{" "}
                    km
                  </p>
                  ·<p>{product.fuel}</p>·<p>{product.gearbox}</p>·
                  <p>{product.power} cv</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 mx-1 rounded ${
                index + 1 === currentPage
                  ? "bg-red-500 text-zinc-200 font-bold"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTrend;
