"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, storage, app } from "../src/services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { PiRoadHorizonBold } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { TbManualGearboxFilled } from "react-icons/tb";
import { MdOutlineSpeed } from "react-icons/md";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Product } from "../src/types/types";
import Image from "next/image";
import Link from "next/link";
import imageCompression from "browser-image-compression";

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [kilometers, setKilometers] = useState<number | string>("");
  const [fuel, setFuel] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [power, setPower] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login?error=unauthorized"); // Passa um parâmetro de erro
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));

      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();

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
          kilometers: data.kilometers ? Number(data.kilometers) : 0,
          fuel: data.fuel || "Combustivel desconhecido",
          gearbox: data.gearbox || "Cambio desconhecido",
          power: data.power || "Potencia desconhecida",
          top: data.top || false,
        };

        return product;
      });

      setProducts(productsData);
    } catch (error) {
      console.error("Erro ao buscar os produtos: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    setIsLoading(true);

    try {
      let imageUrls = previewImages;

      if (images.length > 0) {
        imageUrls = await Promise.all(
          images.map(async (image) => {
            const options = {
              maxSizeMB: 2,
              maxWidthOrHeight: 1200,
              initialQuality: 0.9,
              useWebWorker: true,
            };

            try {
              const compressedImage = await imageCompression(image, options);

              const storageRef = ref(
                storage,
                `products/${compressedImage.name}-${Date.now()}`
              );
              await uploadBytes(storageRef, compressedImage);
              const url = await getDownloadURL(storageRef);
              return url;
            } catch (error) {
              console.error("Erro ao comprimir a imagem:", error);
              throw error;
            }
          })
        );
      }

      const productData = {
        name,
        price: Number(price),
        description,
        brand,
        kilometers,
        fuel,
        gearbox,
        power,
        images: imageUrls,
        top: isTop,
      };

      if (editId) {
        const productRef = doc(db, "products", editId);
        await updateDoc(productRef, productData);
        setEditId(null);
      } else {
        await addDoc(collection(db, "products"), productData);
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Erro ao cadastrar o produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este anúncio?"
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o produto: ", error);
    }
  };

  const handleEditProduct = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    event.stopPropagation();

    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setBrand(product.brand);
    setKilometers(product.kilometers);
    setFuel(product.fuel);
    setGearbox(product.gearbox);
    setPower(product.power);
    setImages([]);
    setPreviewImages(product.images);
    setEditId(product.id);
    setIsTop(product.top || false);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setBrand("");
    setKilometers("");
    setFuel("");
    setGearbox("");
    setPower("");
    setImages([]);
    setPreviewImages([]);
    setEditId(null);
  };

  return (
    <div className="p-6 pt-20 md:pt-44">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Cadastro de Carros
      </h1>
      <div className="flex flex-col max-w-[750px] m-auto">
        <input
          type="text"
          placeholder="Modelo da Viatura"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 mb-2 block"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Marca"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="number"
          placeholder="Quilometragem"
          value={kilometers}
          onChange={(e) => setKilometers(e.target.value)}
          className="p-2 mb-2 block"
        />
        <input
          type="text"
          placeholder="Potência"
          value={power}
          onChange={(e) => setPower(e.target.value)}
          className="p-2 mb-2 block"
        />
        <select
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
          className="p-2 mb-2 block bg-white border rounded"
        >
          <option value="">Selecione o Combustível</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Diesel">Diesel</option>
          <option value="Elétrico">Elétrico</option>
          <option value="Híbrido">Híbrido</option>
        </select>
        <select
          value={gearbox}
          onChange={(e) => setGearbox(e.target.value)}
          className="p-2 mb-2 block bg-white border rounded"
        >
          <option value="">Selecione o Tipo de Caixa</option>
          <option value="Manual">Manual</option>
          <option value="Automática">Automática</option>
          <option value="CVT">CVT</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isTop}
            onChange={(e) => setIsTop(e.target.checked)}
            className="p-2"
          />
          Destaque este produto
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              setImages(files);

              const previews = files.map((file) => URL.createObjectURL(file));
              setPreviewImages(previews);
            }
          }}
          className="p-2 mb-2 block"
        />

        {previewImages.length > 0 && (
          <div className="flex gap-2 mt-4">
            {previewImages.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Pré-visualização ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
                width={96}
                height={96}
              />
            ))}
          </div>
        )}
        <button
          onClick={handleAddProduct}
          className={`p-2 rounded mt-4 text-zinc-200 font-bold ${
            isLoading
              ? "bg-zinc-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {isLoading
            ? "Processando..."
            : editId
            ? "Atualizar Carro"
            : "Cadastrar Carro"}
        </button>
      </div>

      <div className="mt-8 max-w-[1200px] m-auto">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Carros Cadastrados
        </h2>
        <div className="flex flex-col gap-4 p-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-lg p-4 border shadow-sm flex items-center gap-6"
            >
              {/* Imagem do carro */}
              {product.images && product.images.length > 0 && (
                <Image
                  src={product.images[0]}
                  alt={`Imagem do produto ${product.name}`}
                  width={200}
                  height={140}
                  className="w-[200px] h-[140px] object-cover rounded-lg"
                  priority
                />
              )}

              {/* Informações do carro */}
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-zinc-800">
                  {product.name}
                </h3>
                <p className="text-lg text-zinc-600">{product.brand}</p>

                {/* Linha de especificações */}
                <div className="flex items-center gap-4 text-zinc-500 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <PiRoadHorizonBold size={18} />
                    <p>
                      {new Intl.NumberFormat("de-DE").format(
                        product.kilometers
                      )}{" "}
                      km
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsFuelPump size={18} />
                    <p>{product.fuel}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TbManualGearboxFilled size={18} />
                    <p>{product.gearbox}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdOutlineSpeed size={18} />
                    <p>{product.power} cv</p>
                  </div>
                </div>

                {product.top && (
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded">
                      Novidade 🔥
                    </span>
                  </div>
                )}
              </div>

              {/* Preço e ações */}
              <div className="flex flex-col items-end gap-2">
                <p className="text-2xl font-bold text-zinc-800">
                  {new Intl.NumberFormat("de-DE").format(product.price)} EUR
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      handleEditProduct(e, product);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold"
                  >
                    Deletar
                  </button>
                </div>
                <Link href={`/product/${product.id}`}>
                  <button className="bg-zinc-500 hover:bg-zinc-700 p-2 rounded-md font-bold w-40 mt-2 text-white">
                    Ver Anúncio
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
