"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../types/types";
import Image from "next/image";
import Link from "next/link";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brandsWithCount, setBrandsWithCount] = useState<
    { brand: string; count: number }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProductsAndBrands = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Fazendo o casting para garantir que temos todas as propriedades do tipo Product
          const product: Product = {
            id: doc.id,
            name: data.name || "Produto sem nome",
            price: data.price ? Number(data.price) : 0,
            description: data.description || "Sem descrição",
            images:
              data.images && data.images.length
                ? data.images
                : ["/placeholder.jpg"],
            brand: data.brand || "Marca desconhecida",
            kilometers: data.kilometers || "Sem Quilometragem",
            fuel: data.fuel || "Combustível desconhecido",
            gearbox: data.gearbox || "Câmbio desconhecido",
            power: data.power || "Potência desconhecida",
            top: data.top || false,
          };

          return product;
        });

        setProducts(productsData);

        // Criando um objeto para contar quantas vezes cada marca aparece
        const brandCounts: Record<string, number> = {};

        productsData.forEach((product) => {
          if (product.brand in brandCounts) {
            brandCounts[product.brand]++;
          } else {
            brandCounts[product.brand] = 1;
          }
        });

        // Convertendo o objeto para um array de objetos
        const brandsWithCountArray = Object.entries(brandCounts).map(
          ([brand, count]) => ({
            brand,
            count,
          })
        );

        setBrandsWithCount(brandsWithCountArray);
      } catch (error) {
        console.error("Erro ao buscar os produtos: ", error);
      }
    };

    fetchProductsAndBrands();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(event.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = selectedBrand
    ? products.filter((product) => product.brand === selectedBrand)
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="max-w-[1200px] m-auto">
        <div className="flex flex-col text-center mt-12">
          <p className="text-3xl font-semibold">Catálogo de viaturas</p>
          <p className="text-zinc-400">
            Conheça todas as nossas viaturas ou pesquise por marcas.
          </p>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <select
            onChange={handleBrandChange}
            value={selectedBrand || ""}
            className="p-3 text-center bg-zinc-300 text-red-500 font-bold rounded w-80"
          >
            <option value="">TODOS</option>
            {brandsWithCount.map(({ brand, count }) => (
              <option key={brand} value={brand}>
                {brand} ({count})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 p-2 lg:p-0">
          {currentProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} passHref>
              <div className="bg-zinc-100 border border-zinc-300 rounded-lg p-4 cursor-pointer">
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
                  <span className="flex items-center gap-1 mt-2 text-2xl font-semibold text-zinc-600">
                    {new Intl.NumberFormat("de-DE").format(product.price)}{" "}
                    <p className="text-sm">EUR</p>
                  </span>
                  <div className="flex gap-1 text-zinc-400 text-xs">
                    <p>
                      {new Intl.NumberFormat("de-DE").format(
                        product.kilometers
                      )}{" "}
                      km
                    </p>·
                    <p>{product.fuel}</p>·
                    <p>{product.gearbox}</p>·
                    <p>{product.power} cv</p>
                  </div>

                  <button className="bg-red-500 hover:bg-zinc-700 p-2 rounded-md font-bold w-48 mt-4">
                    <span className="text-white">VER VIATURA</span>
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
                  ? "bg-red-500 text-zinc-200 font-bold"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
