"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "../../src/types/types";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../../src/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { PiRoadHorizonBold } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { TbManualGearboxFilled } from "react-icons/tb";
import { MdOutlineSpeed } from "react-icons/md";

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const params = useParams();
  const { id } = params || {};

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const data = productSnap.data();
          const fetchedProduct: Product = {
            id: productSnap.id,
            name: data.name,
            price: data.price,
            description: data.description,
            images: data.images,
            brand: data.brand,
            kilometers: data.kilometers,
            fuel: data.fuel,
            gearbox: data.gearbox,
            power: data.power,
            top: data.top || false,
          };
          setProduct(fetchedProduct);
          setMainImage(fetchedProduct.images[0] || null);
        } else {
          console.error("Produto não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar o produto: ", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!id) {
    return <div>Produto não encontrado.</div>;
  }

  if (!product) {
    return <div>Carregando produto...</div>;
  }

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "decimal",
    minimumFractionDigits: 0,
  });

  return (
    <>
      <div className="flex gap-2 p-10 m-auto max-w-[1200px] ">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/"
              replace
              className="transition-colors duration-300 text-zinc-400 hover:text-red-500"
            >
              Início /
            </Link>
          </li>
          <li>
            <Link
              href="/catalog"
              className="transition-colors duration-300 text-zinc-400 hover:text-red-500"
            >
              Catálogo /
            </Link>
          </li>
        </ul>
        <p className="text-zinc-400">{product.name}</p>
      </div>
      <div className="bg-zinc-100 border border-zinc-300">
        <div className="flex flex-col lg:flex-row max-w-[1200px] m-auto p-4">
          <div className="lg:w-1/2">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                width={2000}
                height={2000}
                className="w-full rounded pr-8"
                priority
              />
            ) : (
              <div className="w-full h-[400px] bg-zinc-300 flex items-center justify-center">
                Carregando imagem...
              </div>
            )}
            <div className="flex mt-4 gap-2">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className={`w-20 h-20 object-cover rounded cursor-pointer ${
                    mainImage === image
                      ? "border-2 border-red-500"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col lg:w-1/2 mt-5 lg:px-8 lg:border-s-2 border-zinc-300">
            <p className="mb-2 text-zinc-500">{product.brand}</p>
            <h1 className="text-2xl font-bold mb-8">{product.name}</h1>
            <span className="flex gap-2 items-baseline text-3xl font-semibold mb-8">
              {formatter.format(product.price)} <p className="text-sm">EUR</p>
            </span>
            <div className="border border-zinc-300 rounded-md p-4 mb-8">
              <p className="text-2xl font-bold pb-4 text-zinc-700">Destaques</p>
              <ul className="grid grid-cols-2 gap-2 md:flex md:justify-center md:gap-16 pb-4">
                <li className="flex flex-col items-center">
                  <PiRoadHorizonBold size={25} />
                  <p className="text-sm">Quilómetros</p>
                  <p className="font-bold">
                    {new Intl.NumberFormat("de-DE").format(product.kilometers)}{" "}
                    km
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <BsFuelPump size={25} />
                  <p className="text-sm">Combustível</p>
                  <p className="font-bold">{product.fuel}</p>
                </li>
                <li className="flex flex-col items-center">
                  <TbManualGearboxFilled size={25} />
                  <p className="text-sm">Tipo de Caixa</p>
                  <p className="font-bold">{product.gearbox}</p>
                </li>
                <li className="flex flex-col items-center">
                  <MdOutlineSpeed size={25} />
                  <p className="text-sm">Potência</p>
                  <p className="font-bold">{product.power} cv</p>
                </li>
              </ul>
            </div>
            <a
              href="/"
              target="_blank"
              className="inline-block"
            >
              <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 transition-colors duration-300 p-2 rounded-md w-full m-auto">
                <span className="text-zinc-200">
                  <FaWhatsapp size={20} />
                </span>
                <span className="font-semibold text-zinc-200">
                  Enviar Mensagem
                </span>
              </button>
            </a>
            <div className="flex flex-col gap-2 mt-8">
              <p className="font-semibold text-2xl text-zinc-600">Anotações</p>
              <p className="text-zinc-500 text-md pl-4">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
