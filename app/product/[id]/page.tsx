"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ImageType, Product } from "../../src/types/types";
import Image from "next/image";
import { db } from "../../src/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

// Ícones originais
import { PiRoadHorizonBold } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { TbManualGearboxFilled } from "react-icons/tb";
import { MdOutlineSpeed } from "react-icons/md";

// Ícones novos para os campos extras
import { AiOutlineCalendar, AiOutlineFileText } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { FaClipboardCheck } from "react-icons/fa";
import { GiCarDoor, GiCarSeat } from "react-icons/gi";
import { FiGlobe } from "react-icons/fi";
import { RiShieldCheckLine } from "react-icons/ri";

import ProductTrend from "@/app/src/components/ProductTrend";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";

// Componente para os thumbnails
interface ThumbnailProps {
  image: ImageType;
  alt: string;
  selected: boolean;
  onClick: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  image,
  alt,
  selected,
  onClick,
}) => (
  <Image
    src={typeof image === "string" ? image : image.src}
    alt={alt}
    width={100}
    height={100}
    className={`w-20 h-20 object-cover rounded cursor-pointer block ${
      selected ? "border border-red-500" : "border border-transparent"
    }`}
    onClick={onClick}
  />
);

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<ImageType | null>(null);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const [showExtraThumbs, setShowExtraThumbs] = useState(false);

  const params = useParams();
  const { id } = params || {};

  // Função para filtrar imagens válidas
  const getValidImages = (images: Array<string | { url: string }>): string[] =>
    images
      .filter((img) => {
        if (typeof img === "string") return img.trim() !== "";
        if (img && typeof img === "object" && "url" in img) {
          return img.url.trim() !== "";
        }
        return false;
      })
      .map((img) => (typeof img === "string" ? img : img.url));

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
            images: getValidImages(data.images || []),
            brand: data.brand,
            kilometers: data.kilometers,
            fuel: data.fuel,
            gearbox: data.gearbox,
            power: data.power,
            top: data.top || false,
            // Novos campos
            mesAno: data.mesAno || "",
            cor: data.cor || "",
            lugares: data.lugares || "",
            portas: data.portas || "",
            origem: data.origem || "",
            registos: data.registos || "",
            inspecao: data.inspecao || "",
            garantia: data.garantia || "",
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

  if (!id) return <div>Produto não encontrado.</div>;
  if (!product) return <div>Carregando produto...</div>;

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "decimal",
    minimumFractionDigits: 0,
  });

  const handleOpenZoom = () => {
    if (mainImage && product.images) {
      const index = product.images.findIndex((img) => img === mainImage);
      setZoomedImageIndex(index);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomedImageIndex === null) return;
    setZoomedImageIndex((prev) =>
      prev! > 0 ? prev! - 1 : product.images.length - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomedImageIndex === null) return;
    setZoomedImageIndex((prev) =>
      prev! < product.images.length - 1 ? prev! + 1 : 0
    );
  };

  const handleCloseZoom = () => setZoomedImageIndex(null);

  // Renderização dos thumbnails
  const renderThumbnails = () => {
    if (showExtraThumbs || product.images.length <= 5) {
      return product.images.map((image, index) => (
        <Thumbnail
          key={index}
          image={image}
          alt={`${product.name} thumbnail ${index + 1}`}
          selected={mainImage === image}
          onClick={() => setMainImage(image)}
        />
      ));
    }

    // Se houver mais de 5 imagens, mostra as 4 primeiras e a quinta como botão para expandir
    return (
      <>
        {product.images.slice(0, 4).map((image, index) => (
          <Thumbnail
            key={index}
            image={image}
            alt={`${product.name} thumbnail ${index + 1}`}
            selected={mainImage === image}
            onClick={() => setMainImage(image)}
          />
        ))}
        <div
          className="w-20 h-20 flex items-center justify-center border-2 border-gray-300 rounded cursor-pointer"
          onClick={() => setShowExtraThumbs(true)}
        >
          <span className="text-xl font-bold">
            +{product.images.length - 3}
          </span>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex gap-2 p-10 pt-20 md:pt-44 m-auto max-w-[1200px]">
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
          <div className="w-full rounded-lg">
            {mainImage ? (
              <div
                className="relative cursor-pointer"
                onClick={handleOpenZoom}
                style={{ cursor: "zoom-in" }}
              >
                <Image
                  src={
                    typeof mainImage === "string" ? mainImage : mainImage.src
                  }
                  alt={product.name}
                  width={2000}
                  height={2000}
                  className="w-full rounded-lg"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-[400px] bg-zinc-300 flex items-center justify-center">
                Carregando imagem...
              </div>
            )}

            {/* Thumbnails */}
            <div className="inline-grid grid-cols-5 gap-2 mt-4">
              {renderThumbnails()}
            </div>
          </div>
          <div className="flex flex-col lg:w-1/2 mt-5 lg:px-6 border-zinc-300">
            <p className="mb-2 text-zinc-500">{product.brand}</p>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <span className="flex gap-2 items-baseline text-3xl text-red-500 font-semibold mb-4">
              {formatter.format(product.price)} <p className="text-sm">EUR</p>
            </span>
            <div className="border border-zinc-300 bg-zinc-50 rounded-md p-8 mb-8 w-full">
              <ul className="grid grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
                {/* Informações do carro */}
                <li className="flex flex-col items-center">
                  <PiRoadHorizonBold size={25} />
                  <p className="text-sm">Quilómetros</p>
                  <p className="font-bold whitespace-nowrap">
                    {formatter.format(product.kilometers)} km
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <BsFuelPump size={25} />
                  <p className="text-sm">Combustível</p>
                  <p className="font-bold">{product.fuel}</p>
                </li>
                <li className="flex flex-col items-center">
                  <TbManualGearboxFilled size={25} />
                  <p className="text-sm">Caixa</p>
                  <p className="font-bold">{product.gearbox}</p>
                </li>
                <li className="flex flex-col items-center">
                  <MdOutlineSpeed size={25} />
                  <p className="text-sm">Potência</p>
                  <p className="font-bold">{product.power} cv</p>
                </li>
                <li className="flex flex-col items-center">
                  <AiOutlineCalendar size={25} />
                  <p className="text-sm">Mês/Ano</p>
                  <p className="font-bold">{product.mesAno}</p>
                </li>
                <li className="flex flex-col items-center">
                  <IoIosColorPalette size={25} />
                  <p className="text-sm">Cor</p>
                  <p className="font-bold">{product.cor}</p>
                </li>
                <li className="flex flex-col items-center">
                  <GiCarSeat size={25} />
                  <p className="text-sm">Lugares</p>
                  <p className="font-bold">{product.lugares}</p>
                </li>
                <li className="flex flex-col items-center">
                  <GiCarDoor size={25} />
                  <p className="text-sm">Portas</p>
                  <p className="font-bold">{product.portas}</p>
                </li>
                <li className="flex flex-col items-center">
                  <FiGlobe size={25} />
                  <p className="text-sm">Origem</p>
                  <p className="font-bold">{product.origem}</p>
                </li>
                <li className="flex flex-col items-center">
                  <AiOutlineFileText size={25} />
                  <p className="text-sm">Registos</p>
                  <p className="font-bold">{product.registos}</p>
                </li>
                <li className="flex flex-col items-center">
                  <FaClipboardCheck size={25} />
                  <p className="text-sm">Inspeção</p>
                  <p className="font-bold">{product.inspecao}</p>
                </li>
                <li className="flex flex-col items-center">
                  <RiShieldCheckLine size={25} />
                  <p className="text-sm">Garantia</p>
                  <p className="font-bold">{product.garantia}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] p-8 mt-8 ml-24">
        <p className="font-semibold text-2xl pb-8 ml-4 text-zinc-600">
          Anotações
        </p>
        <p className="text-zinc-500 text-md pl-4 whitespace-pre-line">
          {product.description}
        </p>
      </div>

      <ProductTrend />

      {/* Modal de zoom */}
      {zoomedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={handleCloseZoom}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseZoom}
              className="absolute top-2 right-2 text-white text-3xl"
            >
              <IoMdClose />
            </button>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              <IoIosArrowBack />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              <IoIosArrowForward />
            </button>
            <Image
              src={
                typeof product.images[zoomedImageIndex] === "string"
                  ? product.images[zoomedImageIndex]
                  : product.images[zoomedImageIndex].src
              }
              alt={`${product.name} ampliada`}
              width={2000}
              height={2000}
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
