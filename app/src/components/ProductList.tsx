"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { ImageType, Product } from "../types/types";
import Image from "next/image";
import Link from "next/link";
import { db } from "../services/firebase";
import {
  collection,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { IoMdMenu } from "react-icons/io";

// Função auxiliar para extrair a URL da imagem
const getImageUrl = (img: ImageType | undefined): string => {
  if (!img) return "";
  if (typeof img === "string") return img;

  // Se a imagem tiver a propriedade "url", usamos ela.
  if ("url" in img && typeof img.url === "string") {
    return img.url;
  }

  // Caso contrário, usamos a propriedade "src" (disponível no StaticImageData)
  if ("src" in img && typeof img.src === "string") {
    return img.src;
  }

  return "";
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const titleRef = useRef<HTMLDivElement | null>(null);

  // Mapeamento dos dados do Firestore para o tipo Product
  const mapProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name || "Produto sem nome",
      price: data.price ? Number(data.price) : 0,
      description: data.description || "Sem descrição",
      images: data.images?.length ? data.images : ["/placeholder.jpg"],
      brand: data.brand || "Marca desconhecida",
      kilometers: data.kilometers ?? 0,
      fuel: data.fuel || "Combustível desconhecido",
      gearbox: data.gearbox || "Câmbio desconhecido",
      power: data.power || "Potência desconhecida",
      top: data.top || false,
      // Novos campos adicionados:
      mesAno: data.mesAno || "",
      cor: data.cor || "",
      lugares: data.lugares || "",
      portas: data.portas || "",
      origem: data.origem || "",
      registos: data.registos || "",
      inspecao: data.inspecao || "",
      garantia: data.garantia || "",
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(mapProduct);
        setProducts(productsData);
      } catch (error) {
        console.error("Erro ao buscar os produtos: ", error);
      }
    };

    fetchProducts();
  }, []);

  // Gera as opções para o filtro de marcas com contagem
  const brandsOptions = useMemo(() => {
    const brandCounts: Record<string, number> = {};
    products.forEach((product) => {
      brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
    });
    return Object.entries(brandCounts).map(([brand, count]) => ({
      brand,
      count,
    }));
  }, [products]);

  // Gera as opções de modelo baseadas na marca selecionada (se houver)
  const modelOptions = useMemo(() => {
    const modelos = new Set<string>();
    const source = selectedBrand
      ? products.filter((p) => p.brand === selectedBrand)
      : products;
    source.forEach((p) => modelos.add(p.name));
    return Array.from(modelos);
  }, [products, selectedBrand]);

  // Gera as opções de combustível com base em todos os produtos
  const fuelOptions = useMemo(() => {
    const combustiveis = new Set<string>();
    products.forEach((p) => combustiveis.add(p.fuel));
    return Array.from(combustiveis);
  }, [products]);

  // Opções fixas de preço
  const priceOptions = useMemo(
    () => [
      { label: "Todos", value: "" },
      { label: "5.000", value: "5000" },
      { label: "10.000", value: "10000" },
      { label: "15.000", value: "15000" },
      { label: "20.000", value: "20000" },
      { label: "25.000", value: "25000" },
      { label: "30.000", value: "30000" },
      { label: "40.000", value: "40000" },
      { label: "50.000", value: "50000" },
      { label: "60.000", value: "60000" },
      { label: "70.000", value: "70000" },
      { label: "100.000", value: "100000" },
      { label: "200.000", value: "200000" },
    ],
    []
  );

  // Filtra os produtos com base nos filtros selecionados
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchModel = selectedModel ? product.name === selectedModel : true;
      const matchFuel = selectedFuel ? product.fuel === selectedFuel : true;
      const matchPrice = selectedPrice
        ? product.price <= Number(selectedPrice)
        : true;

      return matchBrand && matchModel && matchFuel && matchPrice;
    });
  }, [products, selectedBrand, selectedModel, selectedFuel, selectedPrice]);

  const totalPages = useMemo(
    () => Math.ceil(filteredProducts.length / productsPerPage),
    [filteredProducts]
  );

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  // Rola a tela para o título ao mudar de página
  useEffect(() => {
    if (titleRef.current) {
      const navbarHeight = 160;
      const elementPosition =
        titleRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, [currentPage]);

  // Handlers para os filtros
  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(event.target.value);
    setSelectedModel(""); // Reseta o modelo quando a marca muda
    setCurrentPage(1);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
    setCurrentPage(1);
  };

  const handleFuelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFuel(event.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice(event.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-[1200px] m-auto">
      {/* Título */}
      <div ref={titleRef} className="flex flex-col text-center mt-12">
        <p className="text-3xl font-semibold">Catálogo de carros</p>
        <p className="text-zinc-500 text-md">
          Veja todos os nossos carros a venda ou pesquise por marcas, modelos,
          combustível e preço.
        </p>
      </div>

      {/* Filtros */}
      <div className="max-w-[1100px] flex flex-wrap justify-center gap-4 m-auto mt-6 bg-zinc-800 p-4 rounded-lg">
        {/* Filtro por Marca */}
        <div className="relative">
          <select
            onChange={handleBrandChange}
            value={selectedBrand}
            className="p-3 text-center bg-zinc-200 text-red-500 font-bold rounded w-60 appearance-none"
          >
            <option value="">MARCA</option>
            {brandsOptions.map(({ brand, count }) => (
              <option key={brand} value={brand}>
                {brand} ({count})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <IoMdMenu size={20} className="text-red-500" />
          </div>
        </div>

        {/* Filtro por Modelo */}
        <div className="relative">
          <select
            onChange={handleModelChange}
            value={selectedModel}
            className="p-3 text-center bg-zinc-200 text-red-500 font-bold rounded w-60 appearance-none"
            disabled={!selectedBrand && products.length > 0}
          >
            <option value="">
              {selectedBrand ? "TODOS OS MODELOS" : "MODELO"}
            </option>
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <IoMdMenu size={20} className="text-red-500" />
          </div>
        </div>

        {/* Filtro por Combustível */}
        <div className="relative">
          <select
            onChange={handleFuelChange}
            value={selectedFuel}
            className="p-3 text-center bg-zinc-200 text-red-500 font-bold rounded w-60 appearance-none"
          >
            <option value="">COMBUSTÍVEL</option>
            {fuelOptions.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <IoMdMenu size={20} className="text-red-500" />
          </div>
        </div>

        {/* Filtro por Preço Máximo */}
        <div className="relative">
          <select
            onChange={handlePriceChange}
            value={selectedPrice}
            className="p-3 text-center bg-zinc-200 text-red-500 font-bold rounded w-60 appearance-none"
          >
            <option value="" disabled hidden>
              PREÇO ATÉ
            </option>
            {priceOptions.map(({ label, value }) => (
              <option key={value || "all"} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <IoMdMenu size={20} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 p-2 lg:p-0">
        {currentProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} passHref>
            <div className="relative bg-zinc-50 border border-zinc-200 rounded-lg p-4 cursor-pointer">
              {product.top && (
                <span className="absolute italic top-0 left-0 p-2 px-4 text-zinc-100 font-bold text-sm rounded-tl-lg bg-gradient-to-r from-red-500 via-red-500/90 to-red-500/0">
                  Novidade 🔥
                </span>
              )}
              {getImageUrl(product.images[0]).trim() !== "" ? (
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full bg-contain rounded"
                  priority
                />
              ) : (
                <div className="w-full h-[300px] bg-gray-300 flex items-center justify-center">
                  Sem imagem
                </div>
              )}
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
                  <p>{product.mesAno}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Paginação */}
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
  );
};

export default ProductList;
